import { StateCreator } from 'zustand';
import { createUserTextBlock } from '../initialData';
import { NewsletterSlice } from './newsletterSlice';
import { ImageSlice } from './imageSlice';
import { HorizontalLineSlice } from './horizontalLineSlice';
import { CalendarSlice } from './calendarSlice';
import { SelectionSlice } from './selectionSlice';


export interface MetaSlice {
  loadSnapshot: (snapshot: any) => void;
  setSectionCount: (count: number) => void;
  setDenseMode: (denseMode: boolean) => void;
}

// Use the root store type for set/get
type RootStore = NewsletterSlice & ImageSlice & HorizontalLineSlice & CalendarSlice & SelectionSlice & MetaSlice & {
  textBlockMap: Record<string, any>;
  textBlockOrder: string[];
};

export const createMetaSlice: StateCreator<RootStore, [], [], MetaSlice> = (set, get) => ({
  loadSnapshot: (snapshot) => {
    try {
      if (!snapshot || typeof snapshot !== 'object') return;
      // Always set textBlocks, textBlockMap, and textBlockOrder in sync
      let textBlocks: import('@/features/newsletter/types').TextBlock[] = Array.isArray(snapshot.textBlocks) ? [...snapshot.textBlocks] : [...get().textBlocks];
      let textBlockMap: Record<string, import('@/features/newsletter/types').TextBlock> = {};
      let textBlockOrder: string[] = [];
      if (snapshot.textBlockMap && snapshot.textBlockOrder) {
        textBlockMap = { ...snapshot.textBlockMap };
        textBlockOrder = [...snapshot.textBlockOrder];
        // Optionally, sync textBlocks array to match order
        textBlocks = textBlockOrder.map(id => textBlockMap[id]).filter(Boolean);
      } else {
        for (const block of textBlocks) {
          if (block && block.id) {
            textBlockMap[block.id] = block;
            textBlockOrder.push(block.id);
          }
        }
      }
      set((state: RootStore) => ({
        title: snapshot.title !== undefined ? ('' + snapshot.title) : state.title,
        date: snapshot.date !== undefined ? ('' + snapshot.date) : state.date,
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
    const state = get() as RootStore;
    const currentBlocks = state.textBlocks;
    if (count === currentBlocks.length) return;
    if (count > currentBlocks.length) {
      const newBlocks = Array.from({ length: count - currentBlocks.length }, (_, i) =>
        createUserTextBlock(currentBlocks.length + i)
      );
      set({ textBlocks: [...currentBlocks, ...newBlocks] } as Partial<RootStore>);
    } else {
      set({ textBlocks: currentBlocks.slice(0, count) } as Partial<RootStore>);
    }
    if (typeof state.selectElement === 'function') {
      state.selectElement(null);
    }
  },
  setDenseMode: (denseMode) => set({ denseMode } as Partial<RootStore>),
});
