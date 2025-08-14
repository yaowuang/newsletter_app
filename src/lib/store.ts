import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { horizontalLineLibrary, resolveThemedLine, HorizontalLineStyle } from './horizontalLines';
import { allLayouts } from '@/features/newsletter/utils/layouts';
import { allThemes, Theme } from '@/lib/themes';
import { deriveCalendarStyles } from '@/lib/calendarTheme';
import { buildInitialBlocks, createUserTextBlock } from './initialData';
import { AppState, TextBlock, ImageElement, HorizontalLineElement } from '@/features/newsletter/types';
import { applyTextEffect } from './textEffects';
import { CalendarData, CalendarEvent, CalendarStyles } from '@/lib/calendar';


// Note: Default section templates & initial block builders have been moved to initialData.ts

// Initialize calendar data with current month
const initializeCalendarData = (): CalendarData => {
  const today = new Date();
  const year = today.getFullYear();

  // Helper for nth weekday of month (e.g., 3rd Monday Jan)
  const nthWeekday = (y: number, month: number, weekday: number, n: number) => {
    const first = new Date(y, month, 1);
    const firstWeekday = first.getDay();
    const offset = ( (7 + weekday - firstWeekday) % 7 ) + (n - 1) * 7;
    return new Date(y, month, 1 + offset);
  };
  // Helper for last weekday of month (e.g., last Monday May)
  const lastWeekday = (y: number, month: number, weekday: number) => {
    const last = new Date(y, month + 1, 0); // last day
    const lastWeekdayVal = last.getDay();
    const offset = (7 + lastWeekdayVal - weekday) % 7;
    return new Date(y, month + 1, 0 - offset);
  };

  const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  // Compute federal holidays (US) for given year
  const holidays: Record<string,string> = {};
  // Fixed-date holidays
  holidays[`${year}-01-01`] = 'New Year\'s Day';
  holidays[`${year}-07-04`] = 'Independence Day';
  holidays[`${year}-06-19`] = 'Juneteenth';
  holidays[`${year}-12-25`] = 'Christmas Day';
  // Movable holidays
  holidays[dateKey(nthWeekday(year, 0, 1, 3))] = 'MLK Jr. Day'; // Third Monday January
  holidays[dateKey(nthWeekday(year, 1, 1, 3))] = 'Presidents\' Day'; // Third Monday February
  holidays[dateKey(lastWeekday(year, 4, 1))] = 'Memorial Day'; // Last Monday May
  holidays[dateKey(nthWeekday(year, 8, 1, 1))] = 'Labor Day'; // First Monday September
  holidays[dateKey(nthWeekday(year, 10, 4, 4))] = 'Thanksgiving'; // Fourth Thursday November (weekday 4)

  // Prefill cell contents with holiday names (markdown friendly, short)
  const cellContents: Record<string,string> = {};
  Object.entries(holidays).forEach(([k,v]) => { cellContents[k] = v; });

  return {
    selectedDate: today,
    customEvents: [],
    cellContents,
    calendarStyles: {
  // Keep most values undefined so they inherit from the active theme until user overrides
  headerFontFamily: undefined,
  headerColor: undefined,
  headerBackgroundColor: undefined,
  weekdayFontFamily: undefined,
  weekdayColor: undefined,
  weekdayBackgroundColor: undefined,
  cellFontFamily: undefined,
  cellTextColor: undefined,
  cellBackgroundColor: undefined,
  cellBorderColor: undefined,
  weekendCellTextColor: undefined,
  weekendCellBackgroundColor: undefined,
  // Non-current month styles now also derive from theme unless user overrides
  nonCurrentMonthCellTextColor: undefined,
  nonCurrentMonthCellBackgroundColor: undefined,
  nonCurrentMonthOpacity: 0.5,
  weekNumberTextColor: undefined,
  weekNumberBackgroundColor: undefined
    }
  };
};

const initialBlocks = buildInitialBlocks();
const initialLayout = allLayouts.find(l => l.sections === initialBlocks.length)!;

export const useStore = create<AppState>()(
  (set, get) => ({
  title: 'Newsletter Title', // used
    date: 'August 6, 2025',
  textBlocks: initialBlocks,
  horizontalLines: [],
  images: [],
  selectedElement: null,
    sectionStyles: {},
    theme: allThemes[0],
    layout: { base: initialLayout, variant: initialLayout.variants[0] },
    denseMode: false,
    calendarData: initializeCalendarData(),
  editingCaret: null,

  setTitle: (title) => set({ title }), // used
    setDate: (date) => set({ date }),

  addTextBlock: () => {
    const count = get().textBlocks.length;
    const newBlock = createUserTextBlock(count);
    set(state => ({ textBlocks: [...state.textBlocks, newBlock] }));
  },

  addHorizontalLine: (props = {}) => {
    const state = get();
    // Get the default color for classic-solid if no color is provided
    const defaultLibItem = horizontalLineLibrary.find(item => item.id === 'classic-solid');
    const defaultColor = props.color || defaultLibItem?.defaultColor || state.theme.styles.section.borderColor || '#888';
    
    const newLine: HorizontalLineElement = {
      id: nanoid(),
      type: 'horizontalLine',
      x: 40,
      y: 140,
      width: 400, // use numeric width for draggable/resizable line
      height: 24, // default height for SVG scaling
      color: defaultColor,
      thickness: 2,
      style: 'solid',
      ...props,
    };
    set(state => ({ horizontalLines: [...state.horizontalLines, newLine] }));
  },

  updateHorizontalLine: (id: string, newProps: Partial<HorizontalLineElement>) => {
    set(state => ({
      horizontalLines: state.horizontalLines.map(line => {
  if (line.id !== id) return line;
  // Allow autoGenerated decorative lines to be repositioned even if locked (layout-driven)
  if (line.locked && !line.autoGenerated && !('locked' in newProps)) return line; // do not mutate if locked unless unlocking
        return { ...line, ...newProps };
      })
    }));
  },

    addImage: () => {
      const newImage: ImageElement = { id: nanoid(), type: 'image', src: '', x: 50, y: 50, width: 200, height: 150 };
      set(state => ({ images: [...state.images, newImage] }));
    },

    updateTextBlock: (id, property, value) => {
      set(state => ({
        textBlocks: state.textBlocks.map(b => (b.id === id && !b.locked)
          ? { ...b, [property]: value } as TextBlock
          : b)
      }));
    },

    updateImage: (id, newProps) => {
      set(state => ({ images: state.images.map(img => {
        if (img.id !== id) return img;
        if (img.locked && !('locked' in newProps)) return img;
        return { ...img, ...newProps };
      }) }));
    },

  selectElement: (id: string | null, type?: 'text' | 'image' | 'horizontalLine' | 'calendarDate', subType?: 'title' | 'content') => {
      if (!id || !type) set({ selectedElement: null });
      else set({ selectedElement: { id, type, subType } });
    },

    deleteElement: (id, type) => {
      set(state => {
        if (type === 'image' && state.images.find(i => i.id === id && i.locked)) return { ...state };
        if (type === 'text' && state.textBlocks.find(b => b.id === id && b.locked)) return { ...state };
        if (type === 'horizontalLine' && state.horizontalLines.find(l => l.id === id && l.locked)) return { ...state };
        return {
          textBlocks: type === 'text' ? state.textBlocks.filter(b => b.id !== id) : state.textBlocks,
          images: type === 'image' ? state.images.filter(i => i.id !== id) : state.images,
          horizontalLines: type === 'horizontalLine' ? state.horizontalLines.filter(l => l.id !== id) : state.horizontalLines,
          selectedElement: null,
        };
      });
    },

    setElementLocked: (id, type, locked) => {
      const updater = <T extends { id: string }>(arr: T[]) => arr.map(el => el.id === id ? { ...el, locked } : el);
      if (type === 'text') set(state => ({ textBlocks: updater(state.textBlocks) }));
      else if (type === 'image') set(state => ({ images: updater(state.images) }));
      else if (type === 'horizontalLine') set(state => ({ horizontalLines: updater(state.horizontalLines) }));
    },

    updateStyle: (blockId, newStyles) => {
      set(state => ({
        sectionStyles: (() => {
          const blk = state.textBlocks.find(b => b.id === blockId);
          if (blk?.locked) return state.sectionStyles; // ignore when locked
          return { ...state.sectionStyles, [blockId]: { ...(state.sectionStyles[blockId] || {}), ...newStyles } };
        })()
      }));
    },

  setTheme: (theme) => {
      const state = get();
      const newBorderColor = theme.styles.section.borderColor || '#888';
      const oldBorderColor = state.theme.styles.section.borderColor || '#888';
      
      // Preserve layout-specific alignments
  const currentTitleAlign = state.theme.styles.title.textAlign; // used
      const currentDateAlign = state.theme.styles.date.textAlign;

      const newTheme = {
        ...theme,
        styles: {
          ...theme.styles,
          title: {
            ...theme.styles.title,
            textAlign: currentTitleAlign,
          },
          date: {
            ...theme.styles.date,
            textAlign: currentDateAlign,
          },
        },
      };
      
      // Update existing non-SVG horizontal lines to use the new theme's border color
      // Only update lines that are currently using the old theme's default color
      const updatedHorizontalLines = state.horizontalLines.map(line => {
        // Only update non-SVG lines (solid, dashed, dotted, shadow)
        if (line.style !== 'clipart') {
          // Find the corresponding library item
          const libItem = horizontalLineLibrary.find(item => 
            (line.style === 'solid' && item.id === 'classic-solid') ||
            (line.style === 'dashed' && item.id === 'classic-dashed') ||
            (line.style === 'dotted' && item.id === 'classic-dotted') ||
            (line.style === 'shadow' && item.id === 'shadow')
          );
          
          // If the library item doesn't have a default color (meaning it should use theme color)
          // and the current line color matches the old theme's border color, update it to new theme color
          if (libItem && !libItem.defaultColor && line.color === oldBorderColor) {
            return { ...line, color: newBorderColor };
          }
        }
        return line;
      });
      
      // Refresh auto-generated themed lines
  const refreshed: HorizontalLineElement[] = updatedHorizontalLines.map(line => {
        if (line.autoGenerated && line.decorationKey) {
          const deco = state.layout.variant.decorations?.find(d => `${state.layout.base.id}:${state.layout.variant.name}:${d.position}:${d.sectionIndex ?? ''}` === line.decorationKey);
          if (deco && deco.lineId === 'themed') {
            const themed = resolveThemedLine(newTheme.name);
            const style: HorizontalLineElement['style'] = themed.type === 'svg'
              ? 'clipart'
              : themed.id.includes('dashed') ? 'dashed'
              : themed.id.includes('dotted') ? 'dotted'
              : themed.id === 'shadow' ? 'shadow' : 'solid';
            return {
              ...line,
              style,
              clipartSrc: themed.type === 'svg' ? themed.preview : undefined,
              color: themed.defaultColor || newBorderColor
            };
          }
        }
        return line;
      });
      // Adapt calendar derived styles: update any calendar overrides that were effectively "linked" to the old theme.
      const currentCalendar = state.calendarData;
      const oldDerived = deriveCalendarStyles(state.theme);
      const newDerived = deriveCalendarStyles(newTheme);
      const updatedCalendarStyles = { ...(currentCalendar.calendarStyles || {}) };
      const calendarStylesBefore = currentCalendar.calendarStyles || {};
      (Object.keys(newDerived) as (keyof typeof newDerived)[]).forEach(key => {
        const originalOverride = calendarStylesBefore[key as keyof typeof calendarStylesBefore];
        // If user never explicitly overrode (undefined) leave undefined so new derived flows through.
        if (originalOverride === undefined) return;
        // If override matches old derived value, treat it as theme-linked and swap to new derived (or clear to allow derivation)
        if (originalOverride === (oldDerived as Record<string, unknown>)[key as string]) {
          // Prefer clearing so future theme changes continue to flow; but if we set to new derived we pin it again.
          delete (updatedCalendarStyles as Record<string, unknown>)[key as string];
        }
      });

      set({ 
        theme: newTheme, 
        sectionStyles: {},
        horizontalLines: refreshed,
        calendarData: { ...currentCalendar, calendarStyles: updatedCalendarStyles }
      });
    },
    setThemeTitleFont: (font: string) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, title: { ...state.theme.styles.title, fontFamily: font } } } })),
    setThemeDateFont: (font: string) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, date: { ...state.theme.styles.date, fontFamily: font } } } })),
    setThemeTitleColor: (color: string) => set(state => {
  const currentTitle = state.theme.styles.title; // used
      // If changing from a text effect, clear all text effect properties
      if (currentTitle.textEffectId || currentTitle.backgroundImage) {
        return { 
          theme: { 
            ...state.theme, 
            styles: { 
              ...state.theme.styles, 
              title: { 
                ...currentTitle, 
                color,
                backgroundImage: undefined,
                backgroundColor: undefined,
                backgroundSize: undefined,
                WebkitBackgroundClip: undefined,
                backgroundClip: undefined,
                textShadow: undefined,
                filter: undefined,
                transform: undefined,
                textEffectId: undefined
              } 
            } 
          } 
        };
      }
      // Otherwise, just update color normally
      return { theme: { ...state.theme, styles: { ...state.theme.styles, title: { ...currentTitle, color } } } };
    }),
    setThemeDateColor: (color: string) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, date: { ...state.theme.styles.date, color } } } })),
    setThemeTitleAlignment: (align) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, title: { ...state.theme.styles.title, textAlign: align } } } })),
    setThemeDateAlignment: (align) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, date: { ...state.theme.styles.date, textAlign: align } } } })),
    setThemeTitleTextEffect: (effectId: string | undefined) => set(state => {
      if (!effectId) {
        // Clear text effect
        const currentTitle = state.theme.styles.title;
        return {
          theme: {
            ...state.theme,
            styles: {
              ...state.theme.styles,
              title: {
                ...currentTitle,
                backgroundImage: undefined,
                backgroundColor: undefined,
                backgroundSize: undefined,
                WebkitBackgroundClip: undefined,
                backgroundClip: undefined,
                textShadow: undefined,
                filter: undefined,
                transform: undefined,
                textEffectId: undefined,
                color: currentTitle.color === 'transparent' ? '#3B82F6' : currentTitle.color
              }
            }
          }
        };
      }
      
      // Apply text effect using the helper function to ensure mutual exclusion
      const currentTitle = state.theme.styles.title;
      const updatedStyles = applyTextEffect(currentTitle, effectId);
      
      return {
        theme: {
          ...state.theme,
          styles: {
            ...state.theme.styles,
            title: {
              ...updatedStyles,
              textEffectId: effectId
            }
          }
        }
      };
    }),
    setThemePageBackgroundColor: (color) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, page: { ...state.theme.styles.page, backgroundColor: color } } } })),
    setThemePageBackgroundImage: (image) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, page: { ...state.theme.styles.page, backgroundImage: image || undefined } } } })),
    setThemePageBackgroundSize: (size) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, page: { ...state.theme.styles.page, backgroundSize: size || undefined } } } })),
    setThemePageBackgroundPosition: (position) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, page: { ...state.theme.styles.page, backgroundPosition: position || undefined } } } })),
    setThemePageBackgroundRepeat: (repeat) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, page: { ...state.theme.styles.page, backgroundRepeat: repeat || undefined } } } })),
    setThemePageBackgroundImageOpacity: (opacity) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, page: { ...state.theme.styles.page, backgroundImageOpacity: Math.min(1, Math.max(0, opacity)) } } } })),

    setLayout: (layout) => {
      // Helper function to convert horizontal line library item to style
      const getStyleFromLibItem = (libItem: HorizontalLineStyle | null | undefined): 'solid' | 'dashed' | 'dotted' | 'clipart' | 'shadow' => {
        if (!libItem) return 'solid';
        if (libItem.type === 'svg') return 'clipart';
        if (libItem.id.includes('dashed')) return 'dashed';
        if (libItem.id.includes('dotted')) return 'dotted';
        if (libItem.id === 'shadow') return 'shadow';
        return 'solid';
      };

      set(state => {
        const { base, variant } = layout;
        const theme = state.theme;
        // Auto-reorder content blocks to new layout's section sizing
        // Only when section counts match and we have targets on new layout.
        let reorderedBlocks = state.textBlocks;
        if (variant.sectionCharTargets && variant.sectionCharTargets.length === state.textBlocks.length) {
          // Greedy best-fit: iterate targets largest->smallest, pick remaining block with closest length.
          const blocksWithLen = state.textBlocks.map(b => ({ block: b, len: (b.title + ' ' + b.content).trim().length }));
          const targets = variant.sectionCharTargets.map((t, idx) => ({ idx, target: t }));
          targets.sort((a,b)=> b.target - a.target); // largest spaces first
          const remaining = [...blocksWithLen];
          const assignment: Record<number, typeof blocksWithLen[0]> = {};
          for (const tgt of targets) {
            if (!remaining.length) break;
            let bestI = 0;
            let bestDiff = Math.abs(remaining[0].len - tgt.target);
            for (let i=1;i<remaining.length;i++) {
              const diff = Math.abs(remaining[i].len - tgt.target);
              if (diff < bestDiff) { bestDiff = diff; bestI = i; }
            }
            assignment[tgt.idx] = remaining.splice(bestI,1)[0];
          }
          // Any leftover (shouldn't) append arbitrarily in ascending unfilled indices
            if (remaining.length) {
              const unfilled = variant.sectionCharTargets.map((_,i)=>i).filter(i => !(i in assignment));
              unfilled.forEach((idx,ri)=> { assignment[idx] = remaining[ri]; });
            }
          reorderedBlocks = Object.keys(assignment)
            .map(k => parseInt(k,10))
            .sort((a,b)=> a-b)
            .map(idx => assignment[idx].block);
        }
        const decorations = variant.decorations || [];
        const newAutoLines = decorations.map(dec => {
          const key = `${base.id}:${variant.name}:${dec.position}:${dec.sectionIndex ?? ''}`;
          const existing: HorizontalLineElement | undefined = state.horizontalLines.find(l => l.autoGenerated && l.decorationKey === key);
          const libItem = dec.lineId === 'themed' ? resolveThemedLine(theme.name) : horizontalLineLibrary.find(l => l.id === dec.lineId);
          const color = libItem?.defaultColor || theme.styles.section.borderColor || '#888';
          
          // Calculate position based on layout alignment and grid structure
          const canvasPadding = 32;
          const canvasWidth = 8.5 * 96 - (canvasPadding * 2);
          const titleAlign = variant.titleAlign || 'center';
          const dateAlign = variant.dateAlign || 'center';
          
          // Estimate typical element heights based on CSS grid auto sizing
          const titleHeight = 48;
          const dateHeight = 24;
          const rowGap = 24;
          const baseY = canvasPadding;
          
          // Calculate Y positions based on grid row structure
          const titleEndY = baseY + titleHeight;
          const dateStartY = titleEndY + rowGap;
          const dateEndY = dateStartY + dateHeight;
          const sectionsStartY = dateEndY + rowGap;
          
          const getLineMetrics = (align: string, isTitle: boolean = false) => {
            const shortLineWidth = Math.min(200, canvasWidth * 0.3);
            const mediumLineWidth = Math.min(300, canvasWidth * 0.5);
            const longLineWidth = Math.min(400, canvasWidth * 0.7);
            
            let width = isTitle ? mediumLineWidth : shortLineWidth;
            let x = canvasPadding;
            
            switch (align) {
              case 'left':
                x = canvasPadding;
                width = isTitle ? longLineWidth : mediumLineWidth;
                break;
              case 'right':
                width = isTitle ? longLineWidth : mediumLineWidth;
                x = canvasPadding + canvasWidth - width;
                break;
              case 'center':
              default:
                width = isTitle ? mediumLineWidth : shortLineWidth;
                x = canvasPadding + (canvasWidth - width) / 2;
                break;
            }
            
            return { x, width };
          };
          
          // Determine position and alignment based on decoration position
          let y = titleEndY + 8; // default: after title
          let x = canvasPadding;
          let width = 200;
          
          if (dec.position === 'afterTitle') {
            y = titleEndY - 2;
            const metrics = getLineMetrics(titleAlign, true);
            x = metrics.x;
            width = metrics.width;
          } else if (dec.position === 'afterDate') {
            y = dateEndY - 4;
            const metrics = getLineMetrics(dateAlign, false);
            x = metrics.x;
            width = metrics.width;
          } else if (dec.position === 'beforeSections') {
            y = sectionsStartY - 8;
            const metrics = getLineMetrics('center', false);
            x = metrics.x;
            width = metrics.width;
          } else if (dec.position === 'betweenSections') {
            y = sectionsStartY + 200;
            const metrics = getLineMetrics('center', false);
            x = metrics.x;
            width = metrics.width;
          } else if (dec.position === 'afterSections') {
            y = 11 * 96 - canvasPadding - 80;
            const metrics = getLineMetrics('center', false);
            x = metrics.x;
            width = metrics.width;
          } else if (dec.position === 'afterSection' && typeof dec.sectionIndex === 'number') {
            y = sectionsStartY + (dec.sectionIndex + 1) * 120 + 8;
            const metrics = getLineMetrics('center', false);
            x = metrics.x;
            width = metrics.width;
          }
          let baseLine: HorizontalLineElement;
          if (existing) {
            baseLine = existing;
          } else {
            baseLine = {
              id: nanoid(),
              type: 'horizontalLine',
              x, y,
              width,
              height: libItem?.type === 'svg' ? 24 : undefined,
              color,
              thickness: 2,
              style: getStyleFromLibItem(libItem),
              clipartSrc: libItem?.type === 'svg' ? libItem.preview : undefined,
              autoGenerated: true,
              decorationKey: key,
              locked: true,
            };
          }
          // Update positions for all lines (existing and new) to match current layout
          return { ...baseLine, x, y, width, color };
        });
        const keptManual = state.horizontalLines.filter(l => !l.autoGenerated);
        // Apply layout-provided alignment to theme styles (non-destructive for unspecified fields)
        const updatedTheme: Theme = {
          ...theme,
          styles: {
            ...theme.styles,
            title: { ...theme.styles.title, textAlign: variant.titleAlign || 'center' },
            date: { ...theme.styles.date, textAlign: variant.dateAlign || 'center' }
          }
        };
  return { layout, horizontalLines: [...keptManual, ...newAutoLines], theme: updatedTheme, textBlocks: reorderedBlocks };
      });
    },

    setSectionCount: (count) => {
      const currentBlocks = get().textBlocks;
      if (count === currentBlocks.length) return;
      if (count > currentBlocks.length) {
        const newBlocks = Array.from({ length: count - currentBlocks.length }, (_, i) =>
          createUserTextBlock(currentBlocks.length + i)
        );
        set({ textBlocks: [...currentBlocks, ...newBlocks] });
      } else {
        set({ textBlocks: currentBlocks.slice(0, count) });
      }
      get().selectElement(null);
    },
    loadSnapshot: (snapshot) => {
      try {
        if (!snapshot || typeof snapshot !== 'object') return;
        // Basic version gating if needed later
        set({
          title: snapshot.title ?? get().title,
          date: snapshot.date ?? get().date,
          textBlocks: Array.isArray(snapshot.textBlocks) ? snapshot.textBlocks : get().textBlocks,
          images: Array.isArray(snapshot.images) ? snapshot.images : get().images,
          sectionStyles: snapshot.sectionStyles ?? get().sectionStyles,
          theme: snapshot.theme ?? get().theme,
          layout: snapshot.layout ?? get().layout,
          denseMode: snapshot.denseMode ?? get().denseMode,
          calendarData: snapshot.calendarData ?? get().calendarData,
          selectedElement: null,
        });
      } catch (e) {
        console.error('Failed to load snapshot', e);
      }
    },
    swapTextBlocks: (id1, id2) => {
      set(state => {
        const i1 = state.textBlocks.findIndex(b => b.id === id1);
        const i2 = state.textBlocks.findIndex(b => b.id === id2);
        if (i1 === -1 || i2 === -1 || i1 === i2) return {};
        const newBlocks = [...state.textBlocks];
        [newBlocks[i1], newBlocks[i2]] = [newBlocks[i2], newBlocks[i1]];
        return { textBlocks: newBlocks };
      });
    },
    setDenseMode: (denseMode) => set({ denseMode }),

    // Calendar-specific actions
    setCalendarDate: (date: Date) => set(state => ({
      calendarData: { ...state.calendarData, selectedDate: date }
    })),
    
    setCalendarTitle: (title: string) => {
      // No-op since we don't use titles anymore - keeping for compatibility
    },
    
    setCellContent: (dateKey: string, content: string) => set(state => ({
      calendarData: {
        ...state.calendarData,
        cellContents: {
          ...state.calendarData.cellContents,
          [dateKey]: content
        }
      }
    })),
    
    addCalendarEvent: (event: CalendarEvent) => set(state => ({
      calendarData: {
        ...state.calendarData,
        customEvents: [...(state.calendarData.customEvents || []), event]
      }
    })),
    
    updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => set(state => ({
      calendarData: {
        ...state.calendarData,
        customEvents: (state.calendarData.customEvents || []).map(event =>
          event.id === id ? { ...event, ...updates } : event
        )
      }
    })),
    
    deleteCalendarEvent: (id: string) => set(state => ({
      calendarData: {
        ...state.calendarData,
        customEvents: (state.calendarData.customEvents || []).filter(event => event.id !== id)
      }
    })),
    
  // Removed setters for week numbers & weekend highlighting (now fixed)
    
    // Calendar styling actions
    setCalendarStyle: (styleKey: keyof CalendarStyles, value: string | number | undefined) => set(state => ({
      calendarData: {
        ...state.calendarData,
        calendarStyles: {
          ...state.calendarData.calendarStyles,
          [styleKey]: value
        }
      }
    })),

    setCalendarStyles: (styles: Partial<CalendarStyles>) => set(state => ({
      calendarData: {
        ...state.calendarData,
        calendarStyles: {
          ...state.calendarData.calendarStyles,
          ...styles
        }
      }
    })),

    resetCalendarStylesToDefaults: () => set(state => ({
      calendarData: {
        ...state.calendarData,
  // Recreate default (theme-derivable) calendar styles; preserve selectedDate & contents
  calendarStyles: initializeCalendarData().calendarStyles
      }
  })),

  setEditingCaret: (blockId, field, index) => set({ editingCaret: { blockId, field, index } })
  })
);
