import { ThemeType } from './themes';
import { CalendarStyles } from './calendar';

// Basic color utilities (kept lightweight to avoid extra deps)
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '');
  if (![3,6].includes(normalized.length)) return null;
  const full = normalized.length === 3 ? normalized.split('').map(c => c + c).join('') : normalized;
  const int = parseInt(full, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const toLinear = (c: number) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  };
  const r = toLinear(rgb.r), g = toLinear(rgb.g), b = toLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg: string, bg: string): number {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

function mix(hex: string, withHex: string, ratio: number): string {
  const a = hexToRgb(hex); const b = hexToRgb(withHex);
  if (!a || !b) return hex;
  const r = Math.round(a.r * (1-ratio) + b.r * ratio);
  const g = Math.round(a.g * (1-ratio) + b.g * ratio);
  const bl = Math.round(a.b * (1-ratio) + b.b * ratio);
  return rgbToHex(r,g,bl);
}

function ensureContrast(color: string, bg: string, target: number): string {
  if (!/^#([0-9a-fA-F]{3}){1,2}$/.test(color) || !/^#([0-9a-fA-F]{3}){1,2}$/.test(bg)) return color;
  let current = color;
  let ratio = contrastRatio(current, bg);
  let iterations = 0;
  while (ratio < target && iterations < 12) {
    // Decide direction: if bg is light (luminance > .5) darken color; else lighten
    const bgLum = relativeLuminance(bg);
    current = mix(current, bgLum > 0.5 ? '#000000' : '#FFFFFF', 0.2);
    ratio = contrastRatio(current, bg);
    iterations++;
  }
  return current;
}

function normalizeColorCandidate(candidate?: string): string | undefined {
  if (!candidate) return undefined;
  if (candidate === 'transparent') return undefined;
  return candidate;
}

function pickAccent(theme: ThemeType): string {
  const { title, section } = theme.styles;
  const candidates = [
    normalizeColorCandidate(title.color),
    normalizeColorCandidate(section.headingBackgroundColor),
    normalizeColorCandidate(section.borderColor),
    normalizeColorCandidate(section.headingColor),
    '#3B82F6'
  ].filter(Boolean) as string[];
  // Return first usable hex color
  const hexRegex = /^#([0-9a-fA-F]{3}){1,2}$/;
  const found = candidates.find(c => hexRegex.test(c));
  return found || '#3B82F6';
}

function weekendTint(accent: string, darkMode: boolean): string {
  // Append alpha 20 (~12.5%) or 30 (~18%) for dark mode
  const hexRegex = /^#([0-9a-fA-F]{6})$/;
  let base = accent;
  if (!hexRegex.test(accent)) {
    const rgb = hexToRgb(accent.replace('#',''));
    if (!rgb) return '#3B82F620';
  }
  // Ensure full 6-digit hex
  if (accent.length === 4) {
    const r = accent[1]; const g = accent[2]; const b = accent[3];
    base = '#' + r + r + g + g + b + b;
  }
  return base + (darkMode ? '30' : '20');
}

export function deriveCalendarStyles(theme: ThemeType): Partial<CalendarStyles> {
  const pageBg = normalizeColorCandidate(theme.styles.page.backgroundColor) || '#FFFFFF';
  const sectionBg = normalizeColorCandidate(theme.styles.section.backgroundColor) || '#FFFFFF';
  const contentColor = normalizeColorCandidate(theme.styles.section.contentColor) || '#111827';
  const headingBg = normalizeColorCandidate(theme.styles.section.headingBackgroundColor) || sectionBg;
  const sectionBorder = normalizeColorCandidate(theme.styles.section.borderColor) || '#D1D5DB';
  const accent = pickAccent(theme);
  const darkMode = relativeLuminance(pageBg) < 0.35; // heuristic

  // Header color fallback: if title.color is transparent/gradient, use accent
  let headerColor = normalizeColorCandidate(theme.styles.title.color) || accent;
  if (!headerColor) headerColor = accent;
  headerColor = ensureContrast(headerColor, pageBg, 4.5);

  // Weekday background: use heading background if contrast ok else mix accent with page bg
  let weekdayBackground = headingBg || mix(accent, pageBg, 0.8);
  if (contrastRatio(contentColor, weekdayBackground) < 4.0) {
    weekdayBackground = mix(weekdayBackground, pageBg, 0.15);
  }

  // Weekday text: prefer headingColor or headerColor
  let weekdayColor = normalizeColorCandidate(theme.styles.section.headingColor) || headerColor;
  weekdayColor = ensureContrast(weekdayColor, weekdayBackground, 4.5);

  // Cell background: prefer section background if it differs enough from page
  let cellBackground = sectionBg;
  if (contrastRatio(sectionBg, pageBg) < 1.2) {
    cellBackground = '#FFFFFF';
    if (darkMode) cellBackground = mix(pageBg, '#FFFFFF', 0.1);
  }
  const cellText = ensureContrast(contentColor, cellBackground, 4.5);

  const weekendBackground = weekendTint(accent, darkMode);

  // Non-current month styles (neutral grays scaled by mode)
  const nonCurrentText = darkMode ? '#94A3B8' : '#6B7280';
  const nonCurrentBg = cellBackground; // keep same background, rely on opacity

  const base: Partial<CalendarStyles> = {
    headerFontFamily: theme.styles.title.fontFamily,
    headerColor,
    weekdayFontFamily: theme.styles.section.headingFontFamily || theme.styles.title.fontFamily,
    weekdayBackgroundColor: weekdayBackground,
    weekdayColor,
    cellFontFamily: theme.styles.section.contentFontFamily,
    cellBackgroundColor: cellBackground,
    cellTextColor: cellText,
    cellBorderColor: sectionBorder,
    weekendCellBackgroundColor: weekendBackground,
    weekendCellTextColor: cellText,
    nonCurrentMonthCellTextColor: nonCurrentText,
    nonCurrentMonthCellBackgroundColor: nonCurrentBg,
    nonCurrentMonthOpacity: 0.5
  };

  // Default theme: switch to a chalkboard aesthetic for calendar
  // Dark green board, soft chalk-white text, faint dusty borders.
  if (theme.name === 'Default') {
    const boardBg = '#1f362b'; // deep green
  // const boardBgAlt = '#223d31';
    const chalk = '#F4F6F3';
    const chalkMuted = '#B8C4BC';
    const chalkAccent = '#F8F9F3';
  // Align calendar header styling with newsletter section heading aesthetic
  base.headerFontFamily = theme.styles.section.headingFontFamily || base.headerFontFamily;
  base.headerColor = theme.styles.section.headingColor || chalkAccent;
  base.headerBackgroundColor = theme.styles.section.headingBackgroundColor || '#C8A978';
  // Weekday headers mimic section heading styling (wood strip) for consistency
  base.weekdayBackgroundColor = theme.styles.section.headingBackgroundColor || '#C8A978';
  base.weekdayColor = theme.styles.section.headingColor || '#1F3D2E';
  base.weekdayFontFamily = theme.styles.section.headingFontFamily || base.weekdayFontFamily;
    base.cellBackgroundColor = boardBg;
    base.cellTextColor = ensureContrast(chalk, boardBg, 4.5);
    base.cellBorderColor = '#ffffff22'; // subtle chalk line
    base.weekendCellBackgroundColor = '#2a493a'; // mild lighten
    base.weekendCellTextColor = base.cellTextColor;
    base.nonCurrentMonthCellTextColor = chalkMuted;
    base.nonCurrentMonthCellBackgroundColor = boardBg;
    base.nonCurrentMonthOpacity = 0.35;
  }

  return base;
}

export function mergeDerivedCalendarStyles(theme: ThemeType, overrides?: CalendarStyles): CalendarStyles {
  const derived = deriveCalendarStyles(theme);
  if (!overrides) return derived as CalendarStyles;
  // Important: Only apply user overrides that are explicitly defined.
  // The initial calendarStyles object intentionally contains many keys with value undefined
  // to signal "no override". Previously we spread these undefined values which overwrote
  // derived theme-based values and prevented theme changes from showing in the inspector UI.
  // By skipping undefined entries we allow live theme switching while still honoring any
  // user-set concrete values. Setting a style back to undefined now correctly reverts to the
  // theme-derived value.
  const merged: Partial<CalendarStyles> = { ...derived };
  (Object.entries(overrides) as [keyof CalendarStyles, unknown][]) .forEach(([k, v]) => {
    if (v !== undefined) {
      (merged as Record<string, unknown>)[k as string] = v;
    }
  });
  return merged as CalendarStyles;
}
