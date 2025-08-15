import { StateCreator } from 'zustand';
import { TextBlock, HorizontalLineElement } from '@/features/newsletter/types';
import { Theme } from '@/lib/themes';
import { horizontalLineLibrary, resolveThemedLine } from '@/lib/horizontalLines';
import type { HorizontalLineStyle } from '@/lib/horizontalLines';
import { nanoid } from 'nanoid';
import { applyTextEffect } from '@/lib/textEffects';

export interface NewsletterSlice {
  title: string;
  date: string;
  textBlockMap: Record<string, TextBlock>; // All blocks ever created, keyed by id
  textBlockOrder: string[]; // IDs of blocks currently visible on canvas
  sectionStyles: Record<string, any>;
  theme: Theme;
  layout: any; // Replace with actual layout type if available
  denseMode: boolean;
  setTitle: (title: string) => void;
  setDate: (date: string) => void;
  setTheme: (theme: Theme) => void;
  setThemeTitleFont: (font: string) => void;
  setThemeDateFont: (font: string) => void;
  setThemeTitleColor: (color: string) => void;
  setThemeDateColor: (color: string) => void;
  setThemeTitleAlignment: (align: 'left' | 'center' | 'right') => void;
  setThemeDateAlignment: (align: 'left' | 'center' | 'right') => void;
  setThemeTitleTextEffect: (effectId: string | undefined) => void;
  setThemePageBackgroundColor: (color: string) => void;
  setThemePageBackgroundImage: (image: string) => void;
  setThemePageBackgroundSize: (size: string) => void;
  setThemePageBackgroundPosition: (position: string) => void;
  setThemePageBackgroundRepeat: (repeat: string) => void;
  setThemePageBackgroundImageOpacity: (opacity: number) => void;
  setLayout: (layout: any) => void; // Replace with actual layout type if available
  setSectionCount: (count: number) => void;
  setDenseMode: (denseMode: boolean) => void;
  updateStyle: (blockId: string, newStyles: Record<string, any>) => void;
  deleteTextBlock: (id: string) => void;
  addTextBlock: (id?: string) => void;
  setElementLocked_text: (id: string, locked: boolean) => void;
  updateTextBlock: (id: string, property: 'title' | 'content', value: string) => void;
}

export const createNewsletterSlice: StateCreator<NewsletterSlice, [], [], NewsletterSlice> = (set, get) => ({
  addTextBlock: (id?: string) => {
    // Add a new text block with a unique id and default content, or restore by id
    let blockId = id || nanoid();
    set(state => {
      // If block already exists in map, just add to order
      if (state.textBlockMap[blockId]) {
        return {
          textBlockOrder: [...state.textBlockOrder, blockId],
          sectionStyles: { ...state.sectionStyles, [blockId]: state.sectionStyles[blockId] || {} },
        };
      }
      // Otherwise, create new block
      return {
        textBlockMap: {
          ...state.textBlockMap,
          [blockId]: {
            id: blockId,
            type: 'text',
            title: '',
            content: '',
            locked: false
          }
        },
        textBlockOrder: [...state.textBlockOrder, blockId],
        sectionStyles: { ...state.sectionStyles, [blockId]: {} },
      };
    });
  },
  deleteTextBlock: (id) => {
    set(state => ({
      textBlockOrder: state.textBlockOrder.filter(blockId => blockId !== id),
      sectionStyles: Object.fromEntries(Object.entries(state.sectionStyles).filter(([k]) => k !== id)),
    }));
  },
		title: 'Newsletter Title',
		date: 'August 6, 2025',
  textBlockMap: {}, // All blocks ever created
  textBlockOrder: [], // IDs of blocks currently visible
		sectionStyles: {},
		theme: {} as Theme, // Should be initialized in root store
		layout: {}, // Should be initialized in root store
		denseMode: false,
		setTitle: (title) => set({ title }),
		setDate: (date) => set({ date }),
		setTheme: (theme) => {
			// The real logic for setTheme should be implemented in the root store to access other slices if needed
			set({ theme });
		},
		setThemeTitleFont: (font) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, title: { ...state.theme.styles.title, fontFamily: font } } } })),
		setThemeDateFont: (font) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, date: { ...state.theme.styles.date, fontFamily: font } } } })),
		setThemeTitleColor: (color) => set(state => {
			const currentTitle = state.theme.styles.title;
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
			return { theme: { ...state.theme, styles: { ...state.theme.styles, title: { ...currentTitle, color } } } };
		}),
		setThemeDateColor: (color) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, date: { ...state.theme.styles.date, color } } } })),
  setThemeTitleAlignment: (align: 'left' | 'center' | 'right') => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, title: { ...state.theme.styles.title, textAlign: align } } } })),
  setThemeDateAlignment: (align: 'left' | 'center' | 'right') => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, date: { ...state.theme.styles.date, textAlign: align } } } })),
     setThemeTitleTextEffect: (effectId) => set(state => {
       const currentTitle = state.theme.styles.title;
       let newTitleStyles;
       if (!effectId) {
         // Remove all effect-related styles and restore color
         newTitleStyles = {
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
         };
       } else {
         // Apply the effect using the helper
         newTitleStyles = {
           ...applyTextEffect(currentTitle, effectId),
           textEffectId: effectId
         };
       }
       return {
         theme: {
           ...state.theme,
           styles: {
             ...state.theme.styles,
             title: newTitleStyles
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
        let reorderedBlocks = state.textBlockOrder.map(id => state.textBlockMap[id]);
        if (variant.sectionCharTargets && variant.sectionCharTargets.length === state.textBlockOrder.length) {
          // Greedy best-fit: iterate targets largest->smallest, pick remaining block with closest length.
          const blocksWithLen = state.textBlockOrder.map((id: string) => {
            const b = state.textBlockMap[id];
            return { block: b, len: (b.title + ' ' + b.content).trim().length };
          });
          const targets = variant.sectionCharTargets.map((t: number, idx: number) => ({ idx, target: t }));
          targets.sort((a: {target: number}, b: {target: number})=> b.target - a.target); // largest spaces first
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
            const unfilled = variant.sectionCharTargets.map((_: unknown, i: number)=>i).filter((i: number) => !(i in assignment));
            unfilled.forEach((idx: number,ri: number)=> { assignment[idx] = remaining[ri]; });
          }
          reorderedBlocks = Object.keys(assignment)
            .map((k: string) => parseInt(k,10))
            .sort((a: number,b: number)=> a-b)
            .map((idx: number) => assignment[idx].block);
        }
        const decorations = variant.decorations || [];
        const newAutoLines = decorations.map((dec: any) => {
          const key = `${base.id}:${variant.name}:${dec.position}:${dec.sectionIndex ?? ''}`;
          const existing: HorizontalLineElement | undefined = (state as any).horizontalLines.find((l: HorizontalLineElement) => l.autoGenerated && l.decorationKey === key);
          const libItem = dec.lineId === 'themed' ? resolveThemedLine(theme.name) : horizontalLineLibrary.find((l: HorizontalLineStyle) => l.id === dec.lineId);
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
  const keptManual = (state as any).horizontalLines.filter((l: HorizontalLineElement) => !l.autoGenerated);
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
			// The real logic for setSectionCount should be implemented in the root store to access textBlocks
			set({});
		},
		setDenseMode: (denseMode) => set({ denseMode }),
    updateStyle: (blockId, newStyles) => {
      set(state => {
        const blk = state.textBlockMap[blockId];
        if (blk?.locked) return { sectionStyles: state.sectionStyles };
        return {
          sectionStyles: { ...state.sectionStyles, [blockId]: { ...(state.sectionStyles[blockId] || {}), ...newStyles } }
        };
      });
    },
  updateTextBlock: (id: string, property: 'title' | 'content', value: string) => {
    set(state => ({
      textBlockMap: {
        ...state.textBlockMap,
        [id]: {
          ...state.textBlockMap[id],
          [property]: value,
        },
      },
    }));
  },
  setElementLocked_text: (id, locked) => {
    set(state => ({
      textBlockMap: {
        ...state.textBlockMap,
        [id]: {
          ...state.textBlockMap[id],
          locked,
        },
      },
    }));
  },
});
