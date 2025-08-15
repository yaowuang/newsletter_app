
import { create } from 'zustand';
import { createNewsletterSlice, NewsletterSlice } from './newsletterSlice';
import { createImageSlice, ImageSlice } from './imageSlice';
import { createHorizontalLineSlice, HorizontalLineSlice } from './horizontalLineSlice';
import { createCalendarSlice, CalendarSlice } from './calendarSlice';
import { createSelectionSlice, SelectionSlice } from './selectionSlice';
import { createMetaSlice, MetaSlice } from './metaSlice';

// Import any initializers needed for state
import { buildInitialBlocks, createUserTextBlock } from '../initialData';
import { allLayouts } from '@/features/newsletter/utils/layouts';
import { allThemes } from '@/lib/themes';
import { initializeCalendarData } from './calendarSlice';

type StoreState = NewsletterSlice & ImageSlice & HorizontalLineSlice & CalendarSlice & SelectionSlice & MetaSlice & {
  textBlockMap: Record<string, import('@/features/newsletter/types').TextBlock>;
  textBlockOrder: string[];
};

export const useStore = create<StoreState>()((set, get, store) => ({
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
    const map: Record<string, import('@/features/newsletter/types').TextBlock> = {};
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
