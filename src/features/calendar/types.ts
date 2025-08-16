// Calendar feature types

export interface CalendarData {
  selectedDate: Date;
  customEvents?: CalendarEvent[];
  cellContents?: { [dateKey: string]: string };
  calendarStyles?: CalendarStylesType;
  editingDateKey?: string | null;
  draftContent?: string;
}

export interface CalendarStylesType {
  headerFontFamily?: string;
  headerColor?: string;
  headerBackgroundColor?: string;
  weekdayFontFamily?: string;
  weekdayColor?: string;
  weekdayBackgroundColor?: string;
  cellFontFamily?: string;
  cellTextColor?: string;
  cellBackgroundColor?: string;
  cellBorderColor?: string;
  weekendCellTextColor?: string;
  weekendCellBackgroundColor?: string;
  nonCurrentMonthCellTextColor?: string;
  nonCurrentMonthCellBackgroundColor?: string;
  nonCurrentMonthOpacity?: number;
  weekNumberTextColor?: string;
  weekNumberBackgroundColor?: string;
}

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  color?: string;
  description?: string;
}
