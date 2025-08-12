import type { Theme } from '@/lib/themes';
import type { LayoutSelection } from '@/lib/types';
import { CSSProperties } from 'react';

interface StyleConfig {
  theme: Theme;
  layoutSelection: LayoutSelection;
  denseMode: boolean;
}

/**
 * Generates styles for the main page container
 */
export function createPageStyle({ theme, layoutSelection, denseMode }: StyleConfig): CSSProperties {
  const { base, variant } = layoutSelection;
  
  return {
    display: 'grid',
    gridTemplateAreas: base.gridTemplateAreas,
    gridTemplateColumns: variant.gridTemplateColumns,
    gridTemplateRows: variant.gridTemplateRows,
    rowGap: denseMode ? '12px' : '24px',
    columnGap: denseMode ? '12px' : '24px',
    backgroundColor: theme.styles.page.backgroundColor,
    position: 'relative',
    width: '100%',
    height: '100%',
  };
}

/**
 * Generates styles for the title element
 */
export function createTitleStyle({ theme, layoutSelection, denseMode }: StyleConfig): CSSProperties {
  const { variant } = layoutSelection;
  
  return {
    gridArea: 'title',
    fontFamily: theme.styles.title.fontFamily,
    color: theme.styles.title.color,
    textAlign: variant.titleAlign || theme.styles.title.textAlign || 'center',
    marginBottom: denseMode ? '12px' : '0px',
  };
}

/**
 * Generates styles for the date element
 */
export function createDateStyle({ theme, layoutSelection, denseMode }: StyleConfig): CSSProperties {
  const { variant } = layoutSelection;
  
  return {
    gridArea: 'date',
    fontFamily: theme.styles.date.fontFamily,
    color: theme.styles.date.color,
    textAlign: variant.dateAlign || theme.styles.date.textAlign || 'center',
    marginBottom: denseMode ? '12px' : '0px',
  };
}

/**
 * Generates background image styles
 */
export function createBackgroundImageStyle(theme: Theme): CSSProperties {
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
