/**
 * Date formatting utilities
 * Handles various date formats and converts them to human-readable strings
 */

const DATE_FORMATS = {
  MONTH_ONLY: /^\d{4}-\d{2}$/,
  ISO_SINGLE: /^\d{4}-\d{2}-\d{2}$/,
  ISO_RANGE: /^(\d{4}-\d{2}-\d{2})\s*(?:to|–|-)\s*(\d{4}-\d{2}-\d{2})$/,
  FORMATTED_MONTH: /January|February|March|April|May|June|July|August|September|October|November|December/,
};

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

/**
 * Formats a raw date string into a human-readable format
 */
export function formatDisplayDate(raw: string): string {
  if (!raw) return "";

  // Month-only (YYYY-MM)
  if (DATE_FORMATS.MONTH_ONLY.test(raw)) {
    const [y, m] = raw.split("-").map(Number);
    const date = new Date(y, m - 1, 1);
    return monthYearFormatter.format(date);
  }

  // If already formatted with month names, return as-is
  if (DATE_FORMATS.FORMATTED_MONTH.test(raw)) {
    return raw;
  }

  // Single ISO date
  if (DATE_FORMATS.ISO_SINGLE.test(raw)) {
    const date = new Date(raw);
    if (!isNaN(date.getTime())) {
      return formatter.format(date);
    }
    return raw;
  }

  // Date range
  const rangeMatch = raw.match(DATE_FORMATS.ISO_RANGE);
  if (rangeMatch) {
    const startDate = new Date(rangeMatch[1]);
    const endDate = new Date(rangeMatch[2]);
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
    }
    return raw;
  }

  return raw; // fallback
}
