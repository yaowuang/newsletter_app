import React from 'react';
import type { Theme } from '@/lib/themes';

/**
 * Generates background image styles
 */
function createBackgroundImageStyle(theme: Theme) {
  if (!theme.styles.page.backgroundImage) return {};
  
  return {
    backgroundImage: theme.styles.page.backgroundImage,
    backgroundSize: theme.styles.page.backgroundSize || 'cover',
    backgroundPosition: theme.styles.page.backgroundPosition || 'center',
    backgroundRepeat: theme.styles.page.backgroundRepeat || 'no-repeat',
    opacity: theme.styles.page.backgroundImageOpacity ?? 1,
    pointerEvents: 'none' as const,
    zIndex: 0,
  };
}

interface PageBackgroundProps {
  theme: Theme;
}

/**
 * Page background component - handles background image rendering
 * Follows SRP by focusing only on background display
 */
export function PageBackground({ theme }: PageBackgroundProps) {
  if (!theme.styles.page.backgroundImage) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={createBackgroundImageStyle(theme)}
    />
  );
}
