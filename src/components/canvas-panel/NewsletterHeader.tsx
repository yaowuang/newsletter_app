import React from 'react';
import type { Theme } from '@/lib/themes';
import type { LayoutSelection } from '@/lib/types';
import { CSSProperties } from 'react';

interface NewsletterHeaderProps {
  title: string;
  date: string;
  theme: Theme;
  layoutSelection: LayoutSelection;
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

interface NewsletterHeaderProps {
  title: string;
  date: string;
  theme: Theme;
  layoutSelection: LayoutSelection;
  denseMode: boolean;
}

/**
 * Newsletter header component - renders title and date
 * Follows SRP by focusing only on header content
 */
export function NewsletterHeader({ 
  title, 
  date, 
  theme, 
  layoutSelection, 
  denseMode 
}: NewsletterHeaderProps) {
  const { variant } = layoutSelection;
  
  const titleStyle: CSSProperties = {
    gridArea: 'title',
    fontFamily: theme.styles.title.fontFamily,
    color: theme.styles.title.color,
    textAlign: variant.titleAlign || theme.styles.title.textAlign || 'center',
    marginBottom: denseMode ? '12px' : '0px',
  };
  
  const dateStyle: CSSProperties = {
    gridArea: 'date',
    fontFamily: theme.styles.date.fontFamily,
    color: theme.styles.date.color,
    textAlign: variant.dateAlign || theme.styles.date.textAlign || 'center',
    marginBottom: denseMode ? '12px' : '0px',
  };

  const displayDate = formatDisplayDate(date);

  return (
    <>
      <h1 style={titleStyle} className="text-4xl font-bold relative z-10">
        {title}
      </h1>
      <p style={dateStyle} className="text-muted-foreground relative z-10">
        {displayDate}
      </p>
    </>
  );
}
