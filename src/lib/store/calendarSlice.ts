
import { StateCreator } from 'zustand';
import { CalendarData, CalendarEvent, CalendarStyles } from '@/features/calendar/types';

// Initialize calendar data with current month
export const initializeCalendarData = (): CalendarData => {
	const today = new Date();
	const year = today.getFullYear();

	// Helper for nth weekday of month (e.g., 3rd Monday Jan)
	const nthWeekday = (y: number, month: number, weekday: number, n: number) => {
		const first = new Date(y, month, 1);
		const firstWeekday = first.getDay();
		const offset = ( (7 + weekday - firstWeekday) % 7 ) + (n - 1) * 7;
		return new Date(y, month, 1 + offset);
	};
	// Helper for last weekday of month (e.g., last Monday May)
	const lastWeekday = (y: number, month: number, weekday: number) => {
		const last = new Date(y, month + 1, 0); // last day
		const lastWeekdayVal = last.getDay();
		const offset = (7 + lastWeekdayVal - weekday) % 7;
		return new Date(y, month + 1, 0 - offset);
	};

	const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

	// Compute federal holidays (US) for given year
	const holidays: Record<string,string> = {};
	// Fixed-date holidays
	holidays[`${year}-01-01`] = 'New Year\'s Day';
	holidays[`${year}-07-04`] = 'Independence Day';
	holidays[`${year}-06-19`] = 'Juneteenth';
	holidays[`${year}-12-25`] = 'Christmas Day';
	// Movable holidays
	holidays[dateKey(nthWeekday(year, 0, 1, 3))] = 'MLK Jr. Day'; // Third Monday January
	holidays[dateKey(nthWeekday(year, 1, 1, 3))] = 'Presidents\' Day'; // Third Monday February
	holidays[dateKey(lastWeekday(year, 4, 1))] = 'Memorial Day'; // Last Monday May
	holidays[dateKey(nthWeekday(year, 8, 1, 1))] = 'Labor Day'; // First Monday September
	holidays[dateKey(nthWeekday(year, 10, 4, 4))] = 'Thanksgiving'; // Fourth Thursday November (weekday 4)

	// Prefill cell contents with holiday names (markdown friendly, short)
	const cellContents: Record<string,string> = {};
	Object.entries(holidays).forEach(([k,v]) => { cellContents[k] = v; });

	return {
		selectedDate: today,
		customEvents: [],
		cellContents,
		calendarStyles: {
			// Keep most values undefined so they inherit from the active theme until user overrides
			headerFontFamily: undefined,
			headerColor: undefined,
			headerBackgroundColor: undefined,
			weekdayFontFamily: undefined,
			weekdayColor: undefined,
			weekdayBackgroundColor: undefined,
			cellFontFamily: undefined,
			cellTextColor: undefined,
			cellBackgroundColor: undefined,
			cellBorderColor: undefined,
			weekendCellTextColor: undefined,
			weekendCellBackgroundColor: undefined,
			// Non-current month styles now also derive from theme unless user overrides
			nonCurrentMonthCellTextColor: undefined,
			nonCurrentMonthCellBackgroundColor: undefined,
			nonCurrentMonthOpacity: 0.5,
			weekNumberTextColor: undefined,
			weekNumberBackgroundColor: undefined
		},
		editingDateKey: null,
		draftContent: '',
	};
};

// You will need to provide initializeCalendarData when composing the store
export interface CalendarSlice {
	calendarData: CalendarData;
	setCalendarDate: (date: Date) => void;
	setEditingDateKey: (key: string | null) => void;
	setDraftContent: (content: string) => void;
	setCellContent: (dateKey: string, content: string) => void;
	addCalendarEvent: (event: CalendarEvent) => void;
	updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
	deleteCalendarEvent: (id: string) => void;
	setCalendarStyle: (styleKey: keyof CalendarStyles, value: string | number | undefined) => void;
	setCalendarStyles: (styles: Partial<CalendarStyles>) => void;
	resetCalendarStylesToDefaults: () => void;
}

export const createCalendarSlice: StateCreator<CalendarSlice, [], [], CalendarSlice> = (set) => ({
  calendarData: initializeCalendarData(),
  setCalendarDate: (date: Date) => set(state => ({
    calendarData: { ...state.calendarData, selectedDate: date }
  })),
  setEditingDateKey: (key: string | null) => set(state => ({
    calendarData: { ...state.calendarData, editingDateKey: key }
  })),
  setDraftContent: (content: string) => set(state => ({
    calendarData: { ...state.calendarData, draftContent: content }
  })),
  setCellContent: (dateKey: string, content: string) => set(state => ({
    calendarData: {
      ...state.calendarData,
      cellContents: {
        ...state.calendarData.cellContents,
        [dateKey]: content
      }
    }
  })),
  addCalendarEvent: (event) => set(state => ({
    calendarData: {
      ...state.calendarData,
      customEvents: [...(state.calendarData.customEvents || []), event]
    }
  })),
  updateCalendarEvent: (id, updates) => set(state => ({
    calendarData: {
      ...state.calendarData,
      customEvents: (state.calendarData.customEvents || []).map((event) =>
        event.id === id ? { ...event, ...updates } : event
      )
    }
  })),
  deleteCalendarEvent: (id) => set(state => ({
    calendarData: {
      ...state.calendarData,
      customEvents: (state.calendarData.customEvents || []).filter((event) => event.id !== id)
    }
  })),
  setCalendarStyle: (styleKey, value) => set(state => ({
    calendarData: {
      ...state.calendarData,
      calendarStyles: {
        ...state.calendarData.calendarStyles,
        [styleKey]: value
      }
    }
  })),
  setCalendarStyles: (styles) => set(state => ({
    calendarData: {
      ...state.calendarData,
      calendarStyles: {
        ...state.calendarData.calendarStyles,
        ...styles
      }
    }
  })),
  resetCalendarStylesToDefaults: () => set(state => ({
    calendarData: {
      ...state.calendarData,
      calendarStyles: initializeCalendarData().calendarStyles
    }
  })),
});;
