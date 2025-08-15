import { StateCreator } from 'zustand';
import { createUserTextBlock } from '../initialData';
import { NewsletterSlice } from './newsletterSlice';
import { ImageSlice } from './imageSlice';
import { HorizontalLineSlice } from './horizontalLineSlice';
import { CalendarSlice } from './calendarSlice';
import { SelectionSlice } from './selectionSlice';

import type { TextBlock, ImageElement, SectionStyles, EditorSnapshot } from '@/features/newsletter/types';
import type { Theme } from '@/lib/themes';
import type { Layout } from '@/features/newsletter/utils/layouts';
import type { CalendarData } from '@/features/calendar/types';



export interface MetaSlice {
  loadSnapshot: (snapshot: EditorSnapshot) => void;
  setSectionCount: (count: number) => void;
  setDenseMode: (denseMode: boolean) => void;
}


type RootStore = NewsletterSlice & ImageSlice & HorizontalLineSlice & CalendarSlice & SelectionSlice & MetaSlice & {
  textBlockMap: Record<string, TextBlock>;
  textBlockOrder: string[];
  textBlocks: TextBlock[];
  images: ImageElement[];
  sectionStyles: SectionStyles;
  theme: Theme;
  layout: Layout;
  denseMode: boolean;
  calendarData: CalendarData;
  selectedElement: string | null;
  title: string;
  date: string;
  selectElement?: (el: string | null) => void;
};

export const createMetaSlice: StateCreator<RootStore, [], [], MetaSlice> = (set, get) => ({
  loadSnapshot: (snapshot) => {
    try {
      if (!snapshot || typeof snapshot !== 'object') return;
      let textBlocks = Array.isArray(snapshot.textBlocks) ? [...snapshot.textBlocks] : [...get().textBlocks];
      let textBlockMap: Record<string, TextBlock> = {};
      let textBlockOrder: string[] = [];
      if (snapshot.textBlockMap && snapshot.textBlockOrder) {
        textBlockMap = { ...snapshot.textBlockMap };
        textBlockOrder = [...snapshot.textBlockOrder];
        textBlocks = textBlockOrder.map(id => textBlockMap[id]).filter((b): b is TextBlock => Boolean(b));
      } else {
        for (const block of textBlocks) {
          if (block && block.id) {
            textBlockMap[block.id] = block;
            textBlockOrder.push(block.id);
          }
        }
      }
      set((state: RootStore) => ({
        title: snapshot.title !== undefined ? String(snapshot.title) : state.title,
        date: snapshot.date !== undefined ? String(snapshot.date) : state.date,
        textBlocks,
        textBlockMap,
        textBlockOrder,
        images: Array.isArray(snapshot.images) ? [...snapshot.images] : [...state.images],
        sectionStyles: snapshot.sectionStyles ? { ...snapshot.sectionStyles } : { ...state.sectionStyles },
        theme: snapshot.theme ? { ...snapshot.theme } : { ...state.theme },
        layout: snapshot.layout ? { ...snapshot.layout } : { ...state.layout },
        denseMode: snapshot.denseMode !== undefined ? !!snapshot.denseMode : state.denseMode,
        calendarData: snapshot.calendarData ? { ...snapshot.calendarData } : { ...state.calendarData },
        selectedElement: null,
      }));
    } catch (e) {
      console.error('Failed to load snapshot', e);
    }
  },
  setSectionCount: (count) => {
    const state = get();
    const currentBlocks = state.textBlocks;
    if (count === currentBlocks.length) return;
    if (count > currentBlocks.length) {
      const newBlocks = Array.from({ length: count - currentBlocks.length }, (_, i) =>
        createUserTextBlock(currentBlocks.length + i)
      );
      set({ textBlocks: [...currentBlocks, ...newBlocks] });
    } else {
      set({ textBlocks: currentBlocks.slice(0, count) });
    }
    if (typeof state.selectElement === 'function') {
      state.selectElement(null);
    }
  },
  setDenseMode: (denseMode) => set({ denseMode }),
});
