export type LayoutVariant = {
  name: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  description?: string;
};

export type Layout = {
  id: string;            // stable id for persistence (new)
  name: string;          // display name
  legacyName?: string;   // previous name (for migration / reference)
  sections: number;
  gridTemplateAreas: string;
  variants: LayoutVariant[];
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
      { name: 'Default', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr', description: 'Single flowing vertical column.' }
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr' },
      { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr' },
      { name: 'Wide Right', gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 1fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr 1fr' },
      { name: 'Tall Top', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 2fr 1fr' },
      { name: 'Tall Bottom', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr 2fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr' },
      { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr' },
      { name: 'Wide Right', gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 2fr 1fr' },
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
      { name: 'Balanced', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr' },
      { name: 'Tall Top', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr' },
      { name: 'Tall Bottom', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr 2fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr' },
      { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr' },
      { name: 'Tall Top', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr 1fr' },
      { name: 'Wide Left', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto 2fr 1fr 1fr' },
      { name: 'Wide Right', gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 2fr 1fr 1fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr' },
      { name: 'Wide Center', gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr' },
      { name: 'Tall Base', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1.5fr' },
      { name: 'Wide Center', gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr' },
      { name: 'Wide Ends', gridTemplateColumns: '1.5fr 1fr 1.5fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 0.9fr 1fr 1fr' },
      { name: 'Wide Closing', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 0.9fr 1fr 1.2fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr' },
      { name: 'Hero Center', gridTemplateColumns: '1fr 1.4fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 0.8fr 1fr' },
      { name: 'Wide Telemetry', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr' },
      { name: 'Wide Finale', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto 1fr 1.2fr' },
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
      { name: 'Balanced', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr 1fr 1fr' },
      { name: 'Tall Stats', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1.2fr 1fr 1fr' },
    ]
  },
];

// Backward compatibility export (existing code imports allLayouts)
export const allLayouts = newsletterLayouts;
