// Calendar-specific types and helpers for the monthly calendar layout
export interface CalendarData {
  selectedDate: Date;
  customEvents?: CalendarEvent[];
  cellContents?: { [dateKey: string]: string };
  calendarStyles?: CalendarStyles;
}

export interface CalendarStyles {
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

export interface CalendarCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: CalendarEvent[];
  content?: string;
  weekNumber?: number;
}

export interface CalendarGrid {
  month: number;
  year: number;
  weeks: CalendarCell[][];
}

export function generateCalendarGrid(date: Date): CalendarGrid {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysFromPrevMonth = startDayOfWeek;
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const daysInCurrentMonth = lastDay.getDate();
  const weeks: CalendarCell[][] = [];
  let currentCellIndex = 0;
  for (let week = 0; week < 6; week++) {
    const weekCells: CalendarCell[] = [];
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      let cellDate: Date;
      let isCurrentMonth = false;
      if (currentCellIndex < daysFromPrevMonth) {
        const day = prevMonthLastDay - daysFromPrevMonth + currentCellIndex + 1;
        cellDate = new Date(year, month - 1, day);
      } else if (currentCellIndex < daysFromPrevMonth + daysInCurrentMonth) {
        const day = currentCellIndex - daysFromPrevMonth + 1;
        cellDate = new Date(year, month, day);
        isCurrentMonth = true;
      } else {
        const day = currentCellIndex - daysFromPrevMonth - daysInCurrentMonth + 1;
        cellDate = new Date(year, month + 1, day);
      }
      const today = new Date();
      const isToday = cellDate.toDateString() === today.toDateString();
      const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
      weekCells.push({
        date: cellDate,
        isCurrentMonth,
        isToday,
        isWeekend,
        events: [],
        weekNumber: week + 1
      });
      currentCellIndex++;
    }
    weeks.push(weekCells);
  }
  return {
    month,
    year,
    weeks
  };
}

export function formatCalendarTitle(date: Date, monthFormat: 'full' | 'short' | 'numeric' = 'full', yearFormat: 'full' | 'short' = 'full'): string {
  const monthNames = {
    full: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December'],
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    numeric: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  };
  const month = monthNames[monthFormat][date.getMonth()];
  const year = yearFormat === 'full' ? date.getFullYear().toString() : date.getFullYear().toString().slice(-2);
  return `${month} ${year}`;
}

export function getWeekdayNames(format: 'long' | 'short' | 'narrow' = 'short'): string[] {
  const weekdays = {
    long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  };
  return weekdays[format];
}
