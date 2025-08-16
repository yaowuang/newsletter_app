import type { StateCreator } from "zustand";
import type { NewsletterSliceType } from "@/types/newsletterSliceTypes";

export interface SelectionSlice {
  selectedElement:
    | { id: string; type: "text"; subType?: "title" | "content" }
    | { id: string; type: "image" }
    | { id: string; type: "horizontalLine" }
    | { id: string; type: "calendarDate" }
    | null;
  selectElement: (
    id: string | null,
    type?: "text" | "image" | "horizontalLine" | "calendarDate",
    subType?: "title" | "content",
  ) => void;
  setEditingCaret: (blockId: string, field: string, index: number) => void;
  swapTextBlocks: (id1: string, id2: string) => void;
  editingCaret: { blockId: string; field: string; index: number } | null;
}

export const createSelectionSlice: StateCreator<NewsletterSliceType & SelectionSlice, [], [], SelectionSlice> = (
  set,
) => ({
  selectedElement: null,
  editingCaret: null,
  selectElement: (id, type, subType) => {
    if (!id || !type) set({ selectedElement: null });
    else if (type === "text") set({ selectedElement: { id, type, subType } });
    else set({ selectedElement: { id, type } });
  },
  setEditingCaret: (blockId, field, index) => set({ editingCaret: { blockId, field, index } }),
  swapTextBlocks: (id1, id2) => {
    set((state) => {
      const blocks = Object.values(state.textBlockMap) as import("@/features/newsletter/types").TextBlockType[];
      const i1 = blocks.findIndex((b) => b.id === id1);
      const i2 = blocks.findIndex((b) => b.id === id2);
      if (i1 === -1 || i2 === -1 || i1 === i2) return {};
      const newBlocks = [...blocks];
      [newBlocks[i1], newBlocks[i2]] = [newBlocks[i2], newBlocks[i1]];
      // Rebuild textBlockMap with the new order
      const newTextBlockMap: Record<string, import("@/features/newsletter/types").TextBlockType> = {};
      newBlocks.forEach((block) => {
        newTextBlockMap[block.id] = block;
      });
      return { textBlockMap: newTextBlockMap };
    });
  },
});
