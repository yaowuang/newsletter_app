import React from 'react';
import type { Theme } from '@/lib/themes';
import { CSSProperties } from 'react';
import { PastelRotateText } from '@/components/common/PastelRotateText';
import { RainbowRotateText } from '@/components/common/RainbowRotateText';

interface NewsletterHeaderProps {
  title: string;
  date: string;
  theme: Theme;
  denseMode: boolean;
}

/**
 * Formats a raw date string into a human-readable format
 */
function formatDisplayDate(raw: string): string {
  if (!raw) return '';
  
  // Month-only (YYYY-MM)
  if (/^\d{4}-\d{2}$/.test(raw)) {
    const [y, m] = raw.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);
  }
  
  // If already looks like a long month name, assume formatted
  if (/January|February|March|April|May|June|July|August|September|October|November|December/.test(raw)) {
    return raw;
  }
  
  const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const isoSingle = /^\d{4}-\d{2}-\d{2}$/;
  const isoRange = /^(\d{4}-\d{2}-\d{2})\s*(?:to|–|-)\s*(\d{4}-\d{2}-\d{2})$/;
  
  if (isoSingle.test(raw)) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return fmt.format(d);
    return raw;
  }
  
  const rangeMatch = raw.match(isoRange);
  if (rangeMatch) {
    const start = new Date(rangeMatch[1]);
    const end = new Date(rangeMatch[2]);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      return `${fmt.format(start)} - ${fmt.format(end)}`;
    }
    return raw;
  }
  
  return raw; // fallback
}

/**
 * Newsletter header component - renders title and date
 * Follows SRP by focusing only on header content
 */
export function NewsletterHeader({ 
  title, 
  date, 
  theme, 
  denseMode 
}: NewsletterHeaderProps) {
  // Create title style with proper text effect handling - explicit application
  const titleStyle: CSSProperties = {
    gridArea: 'title',
    fontFamily: theme.styles.title.fontFamily,
    color: theme.styles.title.color,
    textAlign: theme.styles.title.textAlign || 'center',
    marginBottom: denseMode ? '12px' : '0px',
  };

  // Apply text effect properties explicitly
  if (theme.styles.title.textShadow) {
    titleStyle.textShadow = theme.styles.title.textShadow;
  }
  if (theme.styles.title.filter) {
    titleStyle.filter = theme.styles.title.filter;
  }
  if (theme.styles.title.transform) {
    titleStyle.transform = theme.styles.title.transform;
  }
  if (theme.styles.title.backgroundImage) {
    titleStyle.backgroundImage = theme.styles.title.backgroundImage;
  }
  if (theme.styles.title.backgroundColor) {
    titleStyle.backgroundColor = theme.styles.title.backgroundColor;
  }
  if (theme.styles.title.backgroundSize) {
    titleStyle.backgroundSize = theme.styles.title.backgroundSize;
  }
  if (theme.styles.title.WebkitBackgroundClip) {
    titleStyle.WebkitBackgroundClip = theme.styles.title.WebkitBackgroundClip;
  }
  if (theme.styles.title.backgroundClip) {
    titleStyle.backgroundClip = theme.styles.title.backgroundClip;
  }

  const dateStyle: CSSProperties = {
    gridArea: 'date',
    fontFamily: theme.styles.date.fontFamily,
    color: theme.styles.date.color,
    textAlign: theme.styles.date.textAlign || 'center',
    marginBottom: denseMode ? '12px' : '0px',
  };

  const displayDate = formatDisplayDate(date);

  // Use simple classes without complex logic that might interfere
  const hasTextEffect = Boolean(theme.styles.title.textEffectId);
  const titleClasses = hasTextEffect 
    ? "text-4xl font-bold relative z-10 newsletter-title-effect"
    : "text-4xl font-bold relative z-10";

  const isPastelRotate = theme.styles.title.textEffectId === 'pastel-rotate';
  const isRainbowRotate = theme.styles.title.textEffectId === 'rainbow-rotate';
  
  let renderedTitle: React.ReactNode = title;
  if (isPastelRotate) {
    renderedTitle = <PastelRotateText text={title} />;
  } else if (isRainbowRotate) {
    renderedTitle = <RainbowRotateText text={title} />;
  }
  return (
    <>
      <h1 style={titleStyle} className={titleClasses}>
        {renderedTitle}
      </h1>
      <p style={dateStyle} className="text-muted-foreground relative z-10">
        {displayDate}
      </p>
    </>
  );
}
