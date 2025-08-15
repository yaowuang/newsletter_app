import React from 'react';
import type { ThemeType } from '@/lib/themes';

interface WatermarkProps {
  theme: ThemeType;
}

/**
 * Watermark component - displays the creation attribution
 * Follows SRP by focusing only on watermark display
 */
export function Watermark({ theme }: WatermarkProps) {
  // Attempt to derive a contrasting color from the page background
  const bg = theme.styles.page.backgroundColor || '#ffffff';

  const parseHex = (hex: string): { r: number; g: number; b: number } | null => {
    const m = hex.trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (!m) return null;
    let h = m[1];
    if (h.length === 3) {
      h = h.split('').map(c => c + c).join('');
    }
    const num = parseInt(h, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };

  const relativeLuminance = (r: number, g: number, b: number) => {
    // sRGB to linear
    const srgb = [r, g, b].map(v => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  };

  let useLight = false;
  const parsed = parseHex(bg);
  if (parsed) {
    const lum = relativeLuminance(parsed.r, parsed.g, parsed.b);
    // Threshold ~0.55 (tuned for mid-tone backgrounds used in themes)
    useLight = lum < 0.45;
  } else {
    // If we cannot parse (maybe gradient / named color / image overlay), fall back to evaluating presence of a dark themed title color
    useLight = true; // safer default for busy / image backgrounds
  }

  const color = useLight ? 'rgba(255,255,255,0.85)' : 'rgba(31,41,55,0.75)'; // white-ish vs slate-700-ish
  const textShadow = useLight
    ? '0 0 2px rgba(0,0,0,0.35), 0 0 4px rgba(0,0,0,0.25)'
    : '0 0 1px rgba(255,255,255,0.4)';

  return (
    <div
      className="pointer-events-none select-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-wide z-10"
      style={{
        letterSpacing: '0.1em',
        fontFamily: theme.styles.title.fontFamily,
        color,
        textShadow,
        mixBlendMode: 'normal'
      }}
    >
      CREATED WITH ELEMENTARYSCHOOLNEWSLETTERS.COM
    </div>
  );
}
