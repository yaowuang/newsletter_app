// Centralized type definitions for Zustand store slices in /store
// Follows project convention: PascalCase + 'Type' suffix

import type { HorizontalLineElementType } from "@/features/newsletter/types";

export type HorizontalLineSliceType = {
  horizontalLines: HorizontalLineElementType[];
  addHorizontalLine: (props?: Partial<HorizontalLineElementType>) => void;
  updateHorizontalLine: (id: string, newProps: Partial<HorizontalLineElementType>) => void;
  deleteHorizontalLine: (id: string) => void;
  setElementLocked_horizontalLine: (id: string, locked: boolean) => void;
};

export type MetaSliceType = {
  loadSnapshot: (snapshot: import("@/features/newsletter/types").EditorSnapshotType) => void;
  setSectionCount: (count: number) => void;
  setDenseMode: (denseMode: boolean) => void;
};

export type CalendarSliceType = {
  calendarData: import("@/features/calendar/types").CalendarData;
  setCalendarDate: (date: Date) => void;
  setEditingDateKey: (key: string | null) => void;
  setDraftContent: (content: string) => void;
  setCellContent: (dateKey: string, content: string) => void;
  addCalendarEvent: (event: import("@/features/calendar/types").CalendarEvent) => void;
  updateCalendarEvent: (id: string, updates: Partial<import("@/features/calendar/types").CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  setCalendarStyle: (
    styleKey: keyof import("@/features/calendar/types").CalendarStylesType,
    value: string | number | undefined,
  ) => void;
  setCalendarStyles: (styles: Partial<import("@/features/calendar/types").CalendarStylesType>) => void;
  resetCalendarStylesToDefaults: () => void;
};

export type ImageSliceType = {
  images: import("@/features/newsletter/types").ImageElementType[];
  addImage: () => void;
  updateImage: (id: string, newProps: Partial<import("@/features/newsletter/types").ImageElementType>) => void;
  deleteImage: (id: string) => void;
  setElementLocked_image: (id: string, locked: boolean) => void;
};

export type SelectionSliceType = {
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
};
