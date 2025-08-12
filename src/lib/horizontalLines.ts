// Library of horizontal line styles for use in the editor
// Each entry can be used as a clipart (SVG) or CSS style

export type HorizontalLineStyle = {
  id: string;
  name: string;
  preview: string; // SVG string or CSS style
  type: 'svg' | 'css';
  themeTags: string[];
  repeat?: boolean; // whether svg should tile horizontally when stretched
  defaultColor?: string; // default color for the element
  colorCustomizable?: boolean; // whether the color can be changed by the user
  weight?: 'light' | 'regular' | 'bold'; // optional semantic weight hint
};

export const horizontalLineLibrary: HorizontalLineStyle[] = [
  {
    id: 'classic-solid',
    name: 'Classic Solid',
    preview: '',
    type: 'css',
    themeTags: ['Default', 'Magazine', 'Storybook'],
  colorCustomizable: true,
  weight: 'regular'
  },
  {
    id: 'classic-dashed',
    name: 'Classic Dashed',
    preview: '',
    type: 'css',
    themeTags: ['Default', 'Magazine', 'Storybook'],
  colorCustomizable: true,
  weight: 'light'
  },
  {
    id: 'classic-dotted',
    name: 'Classic Dotted',
    preview: '',
    type: 'css',
    themeTags: ['Default', 'Magazine', 'Storybook'],
  colorCustomizable: true,
  weight: 'light'
  },
  {
    id: 'shadow',
    name: 'Shadow Line',
    preview: '',
    type: 'css',
    themeTags: ['Magazine', 'Arcade'],
  colorCustomizable: true,
  weight: 'bold'
  },
  {
    id: 'hearts',
    name: 'Hearts',
    preview: '/horizontal-lines/hearts.svg',
    type: 'svg',
    themeTags: ['Valentine\'s Day'],
    repeat: true,
    defaultColor: '#ef4444', // Red
    colorCustomizable: true
  },
  {
    id: 'stars',
    name: 'Stars',
    preview: '/horizontal-lines/stars.svg',
    type: 'svg',
    themeTags: ['Galaxy Mission', 'Hollywood'],
    repeat: true,
    defaultColor: '#fbbf24', // Gold/Yellow
    colorCustomizable: true
  },
  {
    id: 'patriotic-flags',
    name: 'Patriotic Flags',
    preview: '/horizontal-lines/patriotic-flags.svg',
    type: 'svg',
    themeTags: ['Patriotic'],
    repeat: true,
    defaultColor: '#B22234', // Red (matches the SVG's primary color)
    colorCustomizable: false
  },
  {
    id: 'clover',
    name: 'Clover',
    preview: '/horizontal-lines/clover.svg',
    type: 'svg',
    themeTags: ["St. Patrick's Day"],
    repeat: true,
    defaultColor: '#16a34a', // Green
    colorCustomizable: false
  },
  {
    id: 'snowflakes',
    name: 'Snowflakes',
    preview: '/horizontal-lines/snowflakes.svg',
    type: 'svg',
    themeTags: ['Winter Holiday', 'Christmas'],
    repeat: true,
    defaultColor: '#FFFFFF', // White (matches the SVG's actual color)
    colorCustomizable: false
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    preview: '/horizontal-lines/pumpkin.svg',
    type: 'svg',
    themeTags: ['Halloween', 'Thanksgiving'],
    repeat: true,
    defaultColor: '#ea580c', // Orange
    colorCustomizable: false
  },
  {
    id: 'comic-halftone',
    name: 'Comic Halftone',
    preview: '/horizontal-lines/comic-halftone.svg',
    repeat: true,
    type: 'svg',
    themeTags: ['Comic Boom'],
    defaultColor: '#7c3aed', // Purple
    colorCustomizable: false
  },
  {
    id: 'arcade-pixel',
    name: 'Arcade Pixel',
    preview: '/horizontal-lines/arcade-pixel.svg',
    type: 'svg',
    themeTags: ['Arcade', 'Galaxy Mission'],
    repeat: true,
    defaultColor: '#08F7FE', // Cyan (primary color from arcade theme)
    colorCustomizable: false // Fixed colors - cyan and neon green
  }
];

// Helper: Given a theme name, pick a suitable line id for 'themed' placeholder.
// Strategy: prefer an exact theme tag match with a repeatable SVG for richer look; fall back to any match; finally default solid.
export function resolveThemedLine(themeName: string): HorizontalLineStyle {
  const candidates = horizontalLineLibrary.filter(l => l.themeTags.includes(themeName));
  if (candidates.length) {
    const svgRepeat = candidates.find(c => c.type === 'svg' && c.repeat);
    return svgRepeat || candidates[0];
  }
  return horizontalLineLibrary.find(l => l.id === 'classic-solid')!;
}
