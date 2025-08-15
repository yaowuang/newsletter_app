import { StateCreator } from 'zustand';
import { createUserTextBlock } from '../initialData';
import type { TextBlockType, EditorSnapshotType } from '@/features/newsletter/types';
import { RootStore } from '.';



export interface MetaSlice {
  loadSnapshot: (snapshot: EditorSnapshotType) => void;
  setSectionCount: (count: number) => void;
  setDenseMode: (denseMode: boolean) => void;
}

export const createMetaSlice: StateCreator<RootStore, [], [], MetaSlice> = (set, get) => ({
  loadSnapshot: (snapshot) => {
    try {
      if (!snapshot || typeof snapshot !== 'object') return;
      let textBlocks = Array.isArray(snapshot.textBlocks) ? [...snapshot.textBlocks] : [...get().textBlocks];
      let textBlockMap: Record<string, TextBlockType> = {};
      let textBlockOrder: string[] = [];
      if (snapshot.textBlockMap && snapshot.textBlockOrder) {
        textBlockMap = { ...snapshot.textBlockMap };
        textBlockOrder = [...snapshot.textBlockOrder];
        textBlocks = textBlockOrder.map(id => textBlockMap[id]).filter((b): b is TextBlockType => Boolean(b));
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
