
import { StateCreator } from 'zustand';
import type { LayoutType, NewsletterSliceType } from '@/types/newsletterSliceTypes';

import { HorizontalLineElementType } from '@/features/newsletter/types';
import { ThemeType } from '@/lib/themes';
import { horizontalLineLibrary, resolveThemedLine } from '@/lib/horizontalLines';
import type { HorizontalLineStyle } from '@/lib/horizontalLines';
import { nanoid } from 'nanoid';
import { applyTextEffect } from '@/lib/textEffects';
import { RootStore } from '.';
import { LayoutDecorationType } from '@/features/newsletter/utils/layouts';

export const createNewsletterSlice: StateCreator<NewsletterSliceType, [], [], NewsletterSliceType> = (set, get) => ({
  addTextBlock: (id?: string) => {
    // Add a new text block with a unique id and default content, or restore by id
    const blockId = id || nanoid();
    set(state => {
      // If block already exists in map, just add to order
      if (state.textBlockMap[blockId]) {
        return {
          ...state,
          textBlockOrder: [...state.textBlockOrder, blockId],
          sectionStyles: { ...state.sectionStyles, [blockId]: state.sectionStyles[blockId] || {} },
        };
      }
      // Otherwise, create new block
      return {
        ...state,
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
		theme: {} as ThemeType, // Should be initialized in root store
    layout: { base: { id: '' }, variant: { name: '' } }, // Should be initialized in root store
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
  const { base, variant } = layout as LayoutType;
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
  const newAutoLines = decorations.map((dec: LayoutDecorationType) => {
          const key = `${base.id}:${variant.name}:${dec.position}:${dec.sectionIndex ?? ''}`;
          // Use StoreState type to access horizontalLines from the global store
          const existing: HorizontalLineElementType | undefined = (get() as RootStore).horizontalLines.find((l: HorizontalLineElementType) => l.autoGenerated && l.decorationKey === key);
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
                    // Lookup table for position logic
                    const positionLookup: Record<string, () => { y: number; metrics: { x: number; width: number } }> = {
                      afterTitle: () => ({ y: titleEndY - 2, metrics: getLineMetrics(titleAlign, true) }),
                      afterDate: () => ({ y: dateEndY - 4, metrics: getLineMetrics(dateAlign, false) }),
                      beforeSections: () => ({ y: sectionsStartY - 8, metrics: getLineMetrics('center', false) }),
                      betweenSections: () => ({ y: sectionsStartY + 200, metrics: getLineMetrics('center', false) }),
                      afterSections: () => ({ y: 11 * 96 - canvasPadding - 80, metrics: getLineMetrics('center', false) }),
                    };
                    if (dec.position === 'afterSection' && typeof dec.sectionIndex === 'number') {
                      y = sectionsStartY + (dec.sectionIndex + 1) * 120 + 8;
                      const metrics = getLineMetrics('center', false);
                      x = metrics.x;
                      width = metrics.width;
                    } else if (positionLookup[dec.position]) {
                      const { y: newY, metrics } = positionLookup[dec.position]!();
                      y = newY;
                      x = metrics.x;
                      width = metrics.width;
                    }
          let baseLine: HorizontalLineElementType;
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
  const keptManual = (state as RootStore).horizontalLines.filter((l: HorizontalLineElementType) => !l.autoGenerated);
        // Apply layout-provided alignment to theme styles (non-destructive for unspecified fields)
        const updatedTheme: ThemeType = {
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
      set(state => {
        const currentCount = state.textBlockOrder.length;
        if (count > currentCount) {
          // Add new blocks
          let newState = { ...state };
          for (let i = 0; i < count - currentCount; i++) {
            const blockId = nanoid();
            newState = {
              ...newState,
              textBlockMap: {
                ...newState.textBlockMap,
                [blockId]: {
                  id: blockId,
                  type: 'text',
                  title: '',
                  content: '',
                  locked: false
                }
              },
              textBlockOrder: [...newState.textBlockOrder, blockId],
              sectionStyles: { ...newState.sectionStyles, [blockId]: {} },
            };
          }
          return newState;
        } else if (count < currentCount) {
          // Remove blocks
          const toRemove = state.textBlockOrder.slice(count);
          const newTextBlockOrder = state.textBlockOrder.slice(0, count);
          const newSectionStyles = { ...state.sectionStyles };
          const newTextBlockMap = { ...state.textBlockMap };
          toRemove.forEach(id => {
            delete newSectionStyles[id];
            delete newTextBlockMap[id];
          });
          return {
            ...state,
            textBlockOrder: newTextBlockOrder,
            sectionStyles: newSectionStyles,
            textBlockMap: newTextBlockMap,
          };
        }
        return state;
      });
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
