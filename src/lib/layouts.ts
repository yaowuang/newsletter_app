// A decorative element that a consumer (canvas) may render automatically
// without the user manually inserting it. For now we support horizontal line
// separators placed relative to structural blocks. Rendering code can inspect
// these and create / position HorizontalLineElements intelligently.
export type LayoutDecoration = {
  kind: 'separator';
  // Reference to a horizontal line style id (from horizontalLineLibrary) OR
  // the special value 'themed' meaning pick the first matching themed style.
  lineId: string; 
  // Placement relative to core areas. Additional placements can be added later
  // (SOLID open for extension, closed for modification – new placements won't
  // break existing switch statements if handled via default fallbacks).
  position: 'beforeTitle' | 'afterTitle' | 'afterDate' | 'beforeSections' | 'betweenSections' | 'afterSections' | 'afterSection';
  // For position 'afterSection' specify the zero-based section index.
  sectionIndex?: number;
};

export type LayoutVariant = {
  name: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  description?: string;
  // Optional text alignment guidance (view layer decides how to apply)
  titleAlign?: 'left' | 'center' | 'right';
  dateAlign?: 'left' | 'center' | 'right';
  // Optional decorative helpers
  decorations?: LayoutDecoration[];
};

export type Layout = {
  id: string;            // stable id for persistence (new)
  name: string;          // display name
  legacyName?: string;   // previous name (for migration / reference)
  sections: number;
  gridTemplateAreas: string;
  variants: LayoutVariant[]; // each variant can tailor alignments & decorations
  category?: string;     // optional grouping category
  notes?: string;        // optional notes
};

// Helper to assemble multiline template areas for readability
function areas(lines: string[]): string {
  return lines.map(l => `"${l}"`).join(' ');
}

export const newsletterLayouts: Layout[] = [
  // 1 Section
  {
    id: 'one-single', legacyName: 'Single', name: 'One Column', sections: 1, category: 'Basic',
    gridTemplateAreas: areas([
      'title',
      'date',
      'sec1'
    ]),
    variants: [
      { 
        name: 'Default', 
        gridTemplateColumns: '1fr', 
        gridTemplateRows: 'auto auto 1fr', 
        description: 'Single flowing vertical column.',
        titleAlign: 'center',
        dateAlign: 'center',
        decorations: [
          { kind: 'separator', lineId: 'themed', position: 'afterTitle' },
          { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' }
        ]
      }
    ]
  },

  // 2 Sections
  {
    id: 'two-columns', legacyName: 'Columns', name: 'Two Columns', sections: 2, category: 'Split',
    gridTemplateAreas: areas([
      'title title',
      'date date',
      'sec1 sec2'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterDate' } ] },
  { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ] },
  { name: 'Wide Right', gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 1fr', titleAlign: 'right', dateAlign: 'right', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ] },
    ]
  },
  {
    id: 'two-rows', legacyName: 'Rows', name: 'Stacked Two', sections: 2, category: 'Stacked',
    gridTemplateAreas: areas([
      'title',
      'date',
      'sec1',
      'sec2'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ] },
  { name: 'Tall Top', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ] },
  { name: 'Tall Bottom', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr 2fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ] },
    ]
  },

  // 3 Sections
  {
    id: 'three-hero', legacyName: 'Hero', name: 'Hero Split', sections: 3, category: 'Hero',
    gridTemplateAreas: areas([
      'title title',
      'date date',
      'sec1 sec1',
      'sec2 sec3'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ] },
  { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ] },
  { name: 'Wide Right', gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'right', dateAlign: 'right', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ] },
    ]
  },
  {
    id: 'three-feature-left', legacyName: 'Feature Left', name: 'Sidebar Feature', sections: 3, category: 'Sidebar',
    gridTemplateAreas: areas([
      'title title',
      'date date',
      'sec1 sec2',
      'sec1 sec3'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ] },
  { name: 'Tall Top', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ] },
  { name: 'Tall Bottom', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr 2fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ] },
    ]
  },

  // 4 Sections
  {
    id: 'four-grid', legacyName: 'Grid', name: '2x2 Grid', sections: 4, category: 'Grid',
    gridTemplateAreas: areas([
      'title title',
      'date date',
      'sec1 sec2',
      'sec3 sec4'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ] },
  { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ] },
  { name: 'Tall Top', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ] },
    ]
  },

  // 5 Sections
  {
    id: 'five-hero-plus', legacyName: 'Hero+', name: 'Hero Plus', sections: 5, category: 'Hero',
    gridTemplateAreas: areas([
      'title title',
      'date date',
      'sec1 sec1',
      'sec2 sec3',
      'sec4 sec5'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 4fr 3fr 3fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ] },
  { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 4fr 3fr 3fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ] },
  { name: 'Wide Right', gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 4fr 3fr 3fr', titleAlign: 'right', dateAlign: 'right', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ] },
    ]
  },

  // 6 Sections
  {
    id: 'six-grid', legacyName: 'Grid', name: '3x2 Grid', sections: 6, category: 'Grid',
    gridTemplateAreas: areas([
      'title title title',
      'date date date',
      'sec1 sec2 sec3',
      'sec4 sec5 sec6'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ] },
  { name: 'Wide Center', gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ] },
    ]
  },

  // 7 Sections (new)
  {
    id: 'seven-mosaic', name: 'Mosaic 7', sections: 7, category: 'Mosaic',
    gridTemplateAreas: areas([
      'title title title',
      'date date date',
      'sec1 sec2 sec3',
      'sec4 sec5 sec6',
      'sec7 sec7 sec7'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ] },
  { name: 'Tall Base', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1.5fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ] },
  { name: 'Wide Center', gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ] },
    ]
  },
  {
    id: 'seven-feature-band', name: 'Band Feature 7', sections: 7, category: 'Mosaic',
    gridTemplateAreas: areas([
      'title title title',
      'date date date',
      'sec1 sec1 sec2',
      'sec3 sec4 sec5',
      'sec6 sec7 sec7'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterDate' } ] },
  { name: 'Wide Ends', gridTemplateColumns: '1.5fr 1fr 1.5fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterDate' } ] },
    ]
  },

  // Thematic / Elementary / Events / Pop Culture (new)
  {
    id: 'event-program', name: 'Event Program', sections: 6, category: 'Events', notes: 'Agenda style: intro + 5 segments.',
    gridTemplateAreas: areas([
      'title title title',
      'date date date',
      'sec1 sec1 sec1',
      'sec2 sec3 sec4',
      'sec5 sec6 sec6'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 0.9fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ] },
  { name: 'Wide Closing', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 0.9fr 1fr 1.2fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ] },
    ]
  },
  {
    id: 'superhero-grid', name: 'Superhero Grid', sections: 7, category: 'Pop Culture', notes: 'Explosive mosaic with double finale.',
    gridTemplateAreas: areas([
      'title title title',
      'date date date',
      'sec1 sec2 sec3',
      'sec4 sec5 sec6',
      'sec7 sec7 sec7'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ] },
  { name: 'Hero Center', gridTemplateColumns: '1fr 1.4fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ] },
    ]
  },
  {
    id: 'space-mission', name: 'Space Mission', sections: 6, category: 'Pop Culture', notes: 'Telemetry band across center.',
    gridTemplateAreas: areas([
      'title title title',
      'date date date',
      'sec1 sec2 sec3',
      'sec4 sec4 sec4',
      'sec5 sec6 sec6'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 0.8fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ] },
  { name: 'Wide Telemetry', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ] },
    ]
  },
  {
    id: 'holiday-garland', name: 'Holiday Garland', sections: 5, category: 'Holiday', notes: 'Banner top, two feature rows + footer.',
    gridTemplateAreas: areas([
      'title title title',
      'date date date',
      'sec1 sec2 sec3',
      'sec4 sec4 sec5'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterDate' } ] },
  { name: 'Wide Finale', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1.2fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterDate' } ] },
    ]
  },
  {
    id: 'game-scoreboard', name: 'Game Scoreboard', sections: 6, category: 'Events', notes: 'Top stats row, dynamic bottom split.',
    gridTemplateAreas: areas([
      'title title',
      'date date',
      'sec1 sec2',
      'sec3 sec4',
      'sec5 sec6'
    ]),
    variants: [
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ] },
  { name: 'Tall Stats', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1.2fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ] },
    ]
  },
];

// Backward compatibility export (existing code imports allLayouts)
export const allLayouts = newsletterLayouts;
