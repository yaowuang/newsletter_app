// A decorative element that a consumer (canvas) may render automatically
// without the user manually inserting it. For now we support horizontal line
// separators placed relative to structural blocks. Rendering code can inspect
// these and create / position HorizontalLineElements intelligently.
export type LayoutDecorationType = {
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

export type LayoutVariantType = {
  name: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  description?: string;
  // Optional text alignment guidance (view layer decides how to apply)
  titleAlign?: 'left' | 'center' | 'right';
  dateAlign?: 'left' | 'center' | 'right';
  // Optional decorative helpers
  decorations?: LayoutDecorationType[];
  // Approximate recommended character counts per section (title+content) for this variant.
  // Length must equal parent layout's sections. Used to auto-map existing content
  // to best-fitting section sizes when the user switches variants/layouts.
  sectionCharTargets?: number[];
  // Orientation for special layouts like calendar
  orientation?: 'portrait' | 'landscape';
};

export type LayoutType = {
  id: string;            // stable id for persistence (new)
  name: string;          // display name
  legacyName?: string;   // previous name (for migration / reference)
  sections: number;
  gridTemplateAreas: string;
  variants: LayoutVariantType[]; // each variant can tailor alignments & decorations
  category?: string;     // optional grouping category
  notes?: string;        // optional notes
  type?: 'newsletter' | 'calendar'; // layout type for special handling
  orientation?: 'portrait' | 'landscape'; // overall orientation
};

// Helper to assemble multiline template areas for readability
function areas(lines: string[]): string {
  return lines.map(l => `"${l}"`).join(' ');
}

export const newsletterLayouts: LayoutType[] = [
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
  ],
  sectionCharTargets: [1200]
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterDate' } ], sectionCharTargets: [750, 750] },
  { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ], sectionCharTargets: [900, 600] },
  { name: 'Wide Right', gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 1fr', titleAlign: 'right', dateAlign: 'right', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ], sectionCharTargets: [600, 900] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ], sectionCharTargets: [800, 800] },
  { name: 'Tall Top', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ], sectionCharTargets: [950, 650] },
  { name: 'Tall Bottom', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr 2fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ], sectionCharTargets: [650, 950] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ], sectionCharTargets: [1000, 600, 600] },
  { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ], sectionCharTargets: [1050, 600, 600] },
  { name: 'Wide Right', gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'right', dateAlign: 'right', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ], sectionCharTargets: [1050, 600, 600] },
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
  { name: 'Balanced', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ], sectionCharTargets: [1100, 550, 550] },
  { name: 'Tall Top', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ], sectionCharTargets: [1200, 500, 500] },
  { name: 'Tall Bottom', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr 2fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ], sectionCharTargets: [1000, 600, 600] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ], sectionCharTargets: [650, 650, 650, 650] },
  { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ], sectionCharTargets: [750, 550, 750, 550] },
  { name: 'Tall Top', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ], sectionCharTargets: [750, 750, 600, 600] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 4fr 3fr 3fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ], sectionCharTargets: [1000, 600, 600, 600, 600] },
  { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 4fr 3fr 3fr', titleAlign: 'left', dateAlign: 'left', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ], sectionCharTargets: [1050, 600, 600, 600, 600] },
  { name: 'Wide Right', gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 4fr 3fr 3fr', titleAlign: 'right', dateAlign: 'right', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ], sectionCharTargets: [1050, 600, 600, 600, 600] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ], sectionCharTargets: [600, 600, 600, 600, 600, 600] },
  { name: 'Wide Center', gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ], sectionCharTargets: [550, 700, 550, 550, 700, 550] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ], sectionCharTargets: [550, 550, 550, 550, 550, 550, 800] },
  { name: 'Tall Base', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1.5fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ], sectionCharTargets: [550, 550, 550, 550, 550, 550, 900] },
  { name: 'Wide Center', gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ], sectionCharTargets: [550, 650, 550, 550, 650, 550, 800] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterDate' } ], sectionCharTargets: [750, 500, 550, 550, 550, 550, 700] },
  { name: 'Wide Ends', gridTemplateColumns: '1.5fr 1fr 1.5fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterDate' } ], sectionCharTargets: [780, 500, 560, 560, 560, 560, 720] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 0.9fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ], sectionCharTargets: [900, 550, 550, 550, 550, 650] },
  { name: 'Wide Closing', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 0.9fr 1fr 1.2fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterTitle' } ], sectionCharTargets: [900, 550, 550, 550, 550, 750] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ], sectionCharTargets: [550, 550, 550, 550, 550, 550, 800] },
  { name: 'Hero Center', gridTemplateColumns: '1fr 1.4fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dotted', position: 'afterDate' } ], sectionCharTargets: [550, 650, 550, 550, 650, 550, 800] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 0.8fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ], sectionCharTargets: [600, 600, 600, 750, 550, 650] },
  { name: 'Wide Telemetry', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-solid', position: 'afterTitle' } ], sectionCharTargets: [600, 600, 600, 700, 550, 650] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterDate' } ], sectionCharTargets: [600, 600, 600, 750, 550] },
  { name: 'Wide Finale', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1.2fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'themed', position: 'afterDate' } ], sectionCharTargets: [600, 600, 600, 800, 550] },
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
  { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ], sectionCharTargets: [650, 650, 650, 650, 650, 650] },
  { name: 'Tall Stats', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1.2fr 1fr 1fr', titleAlign: 'center', dateAlign: 'center', decorations: [ { kind: 'separator', lineId: 'classic-dashed', position: 'afterDate' } ], sectionCharTargets: [750, 750, 600, 600, 600, 600] },
    ]
  },

  // Monthly Calendar Layout (Landscape)
  {
    id: 'monthly-calendar',
    name: 'Monthly Calendar',
    type: 'calendar',
    sections: 1, // Single section for calendar grid
    orientation: 'landscape',
    category: 'Calendar',
    notes: 'Landscape 5x7 grid calendar automatically populated with selected month',
    gridTemplateAreas: areas([
      'calendar calendar calendar calendar calendar calendar calendar'
    ]),
    variants: [
      {
        name: 'Standard',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridTemplateRows: '1fr',
        orientation: 'landscape',
        description: 'Standard calendar layout with equal-sized cells',
        decorations: []
      }
    ]
  }
];

// Backward compatibility export (existing code imports allLayouts)
export const allLayouts = newsletterLayouts;
