
import { StateCreator } from 'zustand';
import { NewsletterSlice } from './newsletterSlice';

export interface SelectionSlice {
  selectedElement: { id: string; type: string; subType?: string } | null;
  selectElement: (id: string | null, type?: string, subType?: string) => void;
  setEditingCaret: (blockId: string, field: string, index: number) => void;
  swapTextBlocks: (id1: string, id2: string) => void;
  editingCaret: { blockId: string; field: string; index: number } | null;
}

export const createSelectionSlice: StateCreator<NewsletterSlice & SelectionSlice, [], [], SelectionSlice> = (set, get) => ({
  selectedElement: null,
  editingCaret: null,
  selectElement: (id, type, subType) => {
    if (!id || !type) set({ selectedElement: null });
    else set({ selectedElement: { id, type, subType } });
  },
  setEditingCaret: (blockId, field, index) => set({ editingCaret: { blockId, field, index } }),
  swapTextBlocks: (id1, id2) => {
    set((state) => {
      const i1 = state.textBlocks.findIndex((b: any) => b.id === id1);
      const i2 = state.textBlocks.findIndex((b: any) => b.id === id2);
      if (i1 === -1 || i2 === -1 || i1 === i2) return {};
      const newBlocks = [...state.textBlocks];
      [newBlocks[i1], newBlocks[i2]] = [newBlocks[i2], newBlocks[i1]];
      return { textBlocks: newBlocks };
    });
  },
});
