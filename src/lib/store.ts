import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { allLayouts, Layout, LayoutVariant } from '@/lib/layouts';
import { allThemes, Theme } from '@/lib/themes';


// Default templates for up to 7 sections
const defaultSectionTemplates: { title: string; content: string }[] = [
  { title: 'Announcements', content: `- Welcome back to a new week!
- Assembly on Wednesday at 10am.
- Field trip forms due Friday.` },
  { title: 'Homework', content: `- Math: Workbook p. 52 (#1-10)
- Reading: 20 minutes from your library book
- Science: Finish lab sheet` },
  { title: 'Upcoming Events', content: `| Date | Event |
| ---- | ----- |
| Thu  | Art Showcase |
| Fri  | School Play Rehearsal |
| Mon  | Quiz: Fractions |` },
  { title: 'Class Highlights', content: `**This Week:**

- Great teamwork during group science experiments.
- Creative story starters shared on Tuesday.
- Improved quiet reading focus — keep it up!` },
  { title: 'Student Shoutouts', content: `- 🎉 Alex for helping a classmate.
- 🌟 Priya for outstanding math problem solving.
- 💡 Jordan for a creative art project idea.` },
  { title: 'Reminders', content: `- Bring a water bottle daily.
- Return library books by Thursday.
- Wear sneakers for PE tomorrow.` },
  { title: 'Looking Ahead', content: `Next week we begin our **ecosystems** unit.
Start thinking about an animal you’d like to research!` },
];

// Deterministic slug function for stable IDs (avoids hydration mismatch)
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Build initial blocks with STABLE IDs (no nanoid) so server & client match
const buildInitialBlocks = () => {
  const seen: Record<string, number> = {};
  return defaultSectionTemplates.map((t, i) => {
    let base = slugify(t.title) || `section-${i + 1}`;
    if (seen[base]) {
      seen[base] += 1;
      base = `${base}-${seen[base]}`;
    } else {
      seen[base] = 1;
    }
    return {
      id: base, // stable deterministic id
      type: 'text' as const,
      title: t.title,
      content: t.content,
    };
  });
};

export type TextBlock = {
  id: string;
  type: 'text';
  title: string;
  content: string;
};

export type ImageElement = {
  id: string;
  type: 'image';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SelectableElement = (TextBlock | ImageElement) & { type: 'text' | 'image' };

export type LayoutSelection = {
  base: Layout;
  variant: LayoutVariant;
};

export type SectionStyle = {
  backgroundColor?: string;
  textColor?: string;
  contentColor?: string;
  fontFamily?: string;
  contentFontFamily?: string;
  headingColor?: string;
  headingBackgroundColor?: string;
  headingFontFamily?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
};

export type SectionStyles = {
  [blockId: string]: SectionStyle;
};

export type EditorSnapshot = {
  version: number;
  title: string;
  date: string;
  textBlocks: TextBlock[];
  images: ImageElement[];
  sectionStyles: SectionStyles;
  theme: Theme;
  layout: LayoutSelection;
};

interface AppState {
  title: string;
  date: string;
  textBlocks: TextBlock[];
  images: ImageElement[];
  selectedElement: { id: string; type: 'text' | 'image' } | null;
  sectionStyles: SectionStyles;
  theme: Theme;
  layout: LayoutSelection;
  
  setTitle: (title: string) => void;
  setDate: (date: string) => void;
  addTextBlock: () => void;
  addImage: () => void;
  updateTextBlock: (id: string, property: 'title' | 'content', value: string) => void;
  updateImage: (id: string, newProps: Partial<ImageElement>) => void;
  selectElement: (id: string | null, type?: 'text' | 'image') => void;
  deleteElement: (id: string, type: 'text' | 'image') => void;
  updateStyle: (blockId: string, newStyles: Partial<SectionStyle>) => void;
  setTheme: (theme: Theme) => void;
  setThemeTitleFont?: (font: string) => void;
  setThemeDateFont?: (font: string) => void;
  setThemeTitleColor?: (color: string) => void;
  setThemeDateColor?: (color: string) => void;
  setThemeTitleAlignment?: (align: 'left' | 'center' | 'right') => void; // new
  setThemeDateAlignment?: (align: 'left' | 'center' | 'right') => void; // new
  setLayout: (layout: LayoutSelection) => void;
  setSectionCount: (count: number) => void;
  loadSnapshot: (snapshot: EditorSnapshot) => void;
  swapTextBlocks: (id1: string, id2: string) => void;
}

const initialBlocks = buildInitialBlocks();
const initialLayout = allLayouts.find(l => l.sections === initialBlocks.length)!;

export const useStore = create<AppState>()(
  (set, get) => ({
    title: 'Newsletter Title',
    date: 'August 6, 2025',
    textBlocks: initialBlocks,
    images: [],
    selectedElement: null,
    sectionStyles: {},
    theme: allThemes[0],
    layout: { base: initialLayout, variant: initialLayout.variants[0] },

    setTitle: (title) => set({ title }),
    setDate: (date) => set({ date }),

    addTextBlock: () => {
      const count = get().textBlocks.length;
      const template = defaultSectionTemplates[count];
      const newBlock: TextBlock = {
        id: nanoid(), // acceptable for user-added blocks after hydration
        type: 'text',
        title: template ? template.title : `Section ${count + 1}`,
        content: template ? template.content : '- Your content here'
      };
      set(state => ({ textBlocks: [...state.textBlocks, newBlock] }));
    },

    addImage: () => {
      const newImage: ImageElement = { id: nanoid(), type: 'image', src: '', x: 50, y: 50, width: 200, height: 150 };
      set(state => ({ images: [...state.images, newImage] }));
    },

    updateTextBlock: (id, property, value) => {
      set(state => ({ 
        textBlocks: state.textBlocks.map(b => 
          b.id === id ? { ...b, [property]: value } : b
        ) 
      }));
    },

    updateImage: (id, newProps) => {
      set(state => ({ images: state.images.map(img => img.id === id ? { ...img, ...newProps } : img) }));
    },

    selectElement: (id, type) => {
      if (!id || !type) set({ selectedElement: null });
      else set({ selectedElement: { id, type } });
    },

    deleteElement: (id, type) => {
      set(state => ({
        textBlocks: type === 'text' ? state.textBlocks.filter(b => b.id !== id) : state.textBlocks,
        images: type === 'image' ? state.images.filter(i => i.id !== id) : state.images,
        selectedElement: null,
      }));
    },

    updateStyle: (blockId, newStyles) => {
      set(state => ({
        sectionStyles: { ...state.sectionStyles, [blockId]: { ...(state.sectionStyles[blockId] || {}), ...newStyles } }
      }));
    },

    setTheme: (theme) => set({ theme, sectionStyles: {} }),
    setThemeTitleFont: (font: string) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, title: { ...state.theme.styles.title, fontFamily: font } } } })),
    setThemeDateFont: (font: string) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, date: { ...state.theme.styles.date, fontFamily: font } } } })),
    setThemeTitleColor: (color: string) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, title: { ...state.theme.styles.title, color } } } })),
    setThemeDateColor: (color: string) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, date: { ...state.theme.styles.date, color } } } })),
    setThemeTitleAlignment: (align) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, title: { ...state.theme.styles.title, textAlign: align } } } })),
    setThemeDateAlignment: (align) => set(state => ({ theme: { ...state.theme, styles: { ...state.theme.styles, date: { ...state.theme.styles.date, textAlign: align } } } })),

    setLayout: (layout) => set({ layout }),

    setSectionCount: (count) => {
      const currentBlocks = get().textBlocks;
      const diff = count - currentBlocks.length;
      if (diff > 0) {
        const startIndex = currentBlocks.length;
        const newBlocks = Array.from({ length: diff }, (_, i) => {
          const template = defaultSectionTemplates[startIndex + i];
            return { 
              id: nanoid(), 
              type: 'text' as const, 
              title: template ? template.title : `Section ${startIndex + i + 1}`, 
              content: template ? template.content : '- Your content here' 
            };
        });
        set({ textBlocks: [...currentBlocks, ...newBlocks] });
      } else if (diff < 0) {
        set({ textBlocks: currentBlocks.slice(0, count) });
      }
      get().selectElement(null);
    },
    loadSnapshot: (snapshot) => {
      try {
        if (!snapshot || typeof snapshot !== 'object') return;
        // Basic version gating if needed later
        set({
          title: snapshot.title ?? get().title,
          date: snapshot.date ?? get().date,
          textBlocks: Array.isArray(snapshot.textBlocks) ? snapshot.textBlocks : get().textBlocks,
          images: Array.isArray(snapshot.images) ? snapshot.images : get().images,
          sectionStyles: snapshot.sectionStyles ?? get().sectionStyles,
          theme: snapshot.theme ?? get().theme,
          layout: snapshot.layout ?? get().layout,
          selectedElement: null,
        });
      } catch (e) {
        console.error('Failed to load snapshot', e);
      }
    },
    swapTextBlocks: (id1, id2) => {
      set(state => {
        const i1 = state.textBlocks.findIndex(b => b.id === id1);
        const i2 = state.textBlocks.findIndex(b => b.id === id2);
        if (i1 === -1 || i2 === -1 || i1 === i2) return {};
        const newBlocks = [...state.textBlocks];
        [newBlocks[i1], newBlocks[i2]] = [newBlocks[i2], newBlocks[i1]];
        return { textBlocks: newBlocks };
      });
    }
  })
);
