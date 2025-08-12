import React from 'react';
import type { Theme } from '@/lib/themes';

interface WatermarkProps {
  theme: Theme;
}

/**
 * Watermark component - displays the creation attribution
 * Follows SRP by focusing only on watermark display
 */
export function Watermark({ theme }: WatermarkProps) {
  return (
    <div
      className="pointer-events-none select-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-wide text-gray-400 opacity-60 z-10"
      style={{ 
        letterSpacing: '0.1em', 
        fontFamily: theme.styles.title.fontFamily 
      }}
    >
      CREATED WITH ELEMENTARYSCHOOLNEWSLETTERS.COM
    </div>
  );
}
