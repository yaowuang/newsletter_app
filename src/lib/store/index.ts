
import { create } from 'zustand';
import { createNewsletterSlice } from './newsletterSlice';
import { createImageSlice, ImageSlice } from './imageSlice';
import { createHorizontalLineSlice, HorizontalLineSlice } from './horizontalLineSlice';
import { createCalendarSlice, CalendarSlice } from './calendarSlice';
import { createSelectionSlice, SelectionSlice } from './selectionSlice';
import { createMetaSlice, MetaSlice } from './metaSlice';

// Import any initializers needed for state
import { buildInitialBlocks,  } from '../initialData';
import { allLayouts } from '@/features/newsletter/utils/layouts';
import { allThemes, ThemeType as ThemeType } from '@/lib/themes';
import { initializeCalendarData } from './calendarSlice';
import { ImageElementType, SectionStylesType, TextBlockType } from '@/features/newsletter/types';
import { CalendarData as CalendarDataType } from '../calendar';

import type { LayoutType, LayoutVariantType } from '@/features/newsletter/utils/layouts';
import { NewsletterSliceType } from '@/types/newsletterSliceTypes';

export type SelectedElementType =
  | { id: string; type: 'text'; subType?: 'title' | 'content' }
  | { id: string; type: 'image' }
  | { id: string; type: 'horizontalLine' }
  | { id: string; type: 'calendarDate' }
  | null;

export type RootStore = NewsletterSliceType & ImageSlice & HorizontalLineSlice & CalendarSlice & SelectionSlice & MetaSlice & {
  textBlockMap: Record<string, TextBlockType>;
  textBlockOrder: string[];
  textBlocks: TextBlockType[];
  images: ImageElementType[];
  sectionStyles: SectionStylesType;
  layout: {
    base: LayoutType;
    variant: LayoutVariantType;
  };
  theme: ThemeType;
  denseMode: boolean;
  calendarData: CalendarDataType;
  selectedElement: SelectedElementType;
  title: string;
  date: string;
  selectElement?: (id: string | null, type?: 'text' | 'image' | 'horizontalLine' | 'calendarDate', subType?: 'title' | 'content') => void;
};

export const useStore = create<RootStore>()((set, get, store) => ({
  // NewsletterSlice initial state
  ...createNewsletterSlice(set, get, store),
  ...createImageSlice(set, get, store),
  ...createHorizontalLineSlice(set, get, store),
  ...createCalendarSlice(set, get, store),
  ...createSelectionSlice(set, get, store),
  ...createMetaSlice(set, get, store),

  // Overwrite initial state for newsletter/calendar as needed
  textBlocks: buildInitialBlocks(),
  textBlockMap: (() => {
    const arr = buildInitialBlocks();
    const map: Record<string, TextBlockType> = {};
    for (const block of arr) {
      map[block.id] = block;
    }
    return map;
  })(),
  textBlockOrder: (() => buildInitialBlocks().map(b => b.id))(),
  layout: (() => {
    const blocks = buildInitialBlocks();
    const base = allLayouts.find(l => l.sections === blocks.length) || allLayouts[0];
    const variant = base.variants[0];
    return { base, variant };
  })(),
  sectionStyles: {},
  theme: allThemes[0],
  calendarData: initializeCalendarData(),
  setElementLocked: (id: string, type: 'text' | 'image' | 'horizontalLine', locked: boolean) => {
    if (type === 'text') {
      get().setElementLocked_text(id, locked);
    } else if (type === 'image') {
      get().setElementLocked_image(id, locked);
    } else if (type === 'horizontalLine') {
      get().setElementLocked_horizontalLine(id, locked);
    }
  },
}));
