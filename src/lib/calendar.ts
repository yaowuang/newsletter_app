// Calendar-specific types for the monthly calendar layout
export interface CalendarData {
  selectedDate: Date;
  // Week numbers always hidden; weekends always highlighted (fields removed)
  customEvents?: CalendarEvent[];
  cellContents?: { [dateKey: string]: string }; // dateKey format: 'YYYY-MM-DD'
  // Calendar-specific styling
  calendarStyles?: CalendarStyles;
}

export interface CalendarStyles {
  // Header styles (month/year title)
  headerFontFamily?: string;
  headerColor?: string;
  headerBackgroundColor?: string;
  
  // Weekday header styles
  weekdayFontFamily?: string;
  weekdayColor?: string;
  weekdayBackgroundColor?: string;
  
  // Cell styles
  cellFontFamily?: string;
  cellTextColor?: string;
  cellBackgroundColor?: string;
  cellBorderColor?: string;
  // Today cell styles removed (fixed highlight)
  
  // Weekend cell styles (weekends always highlighted)
  weekendCellTextColor?: string;
  weekendCellBackgroundColor?: string;
  
  // Non-current month cell styles
  nonCurrentMonthCellTextColor?: string;
  nonCurrentMonthCellBackgroundColor?: string;
  nonCurrentMonthOpacity?: number;
  
  // Week number column styles
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
  content?: string; // Cell content instead of just events
  weekNumber?: number;
}

export interface CalendarGrid {
  month: number;
  year: number;
  weeks: CalendarCell[][];
}

// Calendar layout variant specifically for landscape orientation
export interface CalendarLayoutVariant {
  name: string;
  gridTemplateColumns: string; // 7 columns for days of week
  gridTemplateRows: string; // 6-7 rows for weeks + header
  description?: string;
  orientation: 'landscape'; // Always landscape for calendar
  showHeader?: boolean;
  cellAspectRatio?: number; // width/height ratio for calendar cells
}

export interface CalendarLayout {
  id: string;
  name: string;
  type: 'calendar';
  orientation: 'landscape';
  gridTemplateAreas: string;
  variants: CalendarLayoutVariant[];
  category: string;
  notes?: string;
}

// Helper function to generate calendar grid for a given date
export function generateCalendarGrid(date: Date): CalendarGrid {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Get first day of the month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get the day of week for first day (0 = Sunday)
  const startDayOfWeek = firstDay.getDay();
  
  // Calculate days from previous month to show
  const daysFromPrevMonth = startDayOfWeek;
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  // Calculate total cells needed (always show 6 weeks = 42 cells)
  const totalCells = 42;
  const daysInCurrentMonth = lastDay.getDate();
  const daysFromNextMonth = totalCells - daysFromPrevMonth - daysInCurrentMonth;
  
  const weeks: CalendarCell[][] = [];
  let currentCellIndex = 0;
  
  for (let week = 0; week < 6; week++) {
    const weekCells: CalendarCell[] = [];
    
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      let cellDate: Date;
      let isCurrentMonth = false;
      
      if (currentCellIndex < daysFromPrevMonth) {
        // Previous month
        const day = prevMonthLastDay - daysFromPrevMonth + currentCellIndex + 1;
        cellDate = new Date(year, month - 1, day);
      } else if (currentCellIndex < daysFromPrevMonth + daysInCurrentMonth) {
        // Current month
        const day = currentCellIndex - daysFromPrevMonth + 1;
        cellDate = new Date(year, month, day);
        isCurrentMonth = true;
      } else {
        // Next month
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

// Helper function to format month/year display
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

// Helper function to get weekday names
export function getWeekdayNames(format: 'long' | 'short' | 'narrow' = 'short'): string[] {
  const weekdays = {
    long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  };
  
  return weekdays[format];
}
