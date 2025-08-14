import React from 'react';
import { useStore } from '@/lib/store/index';
import { Button } from '@/components/ui/button';
import { deriveCalendarStyles, mergeDerivedCalendarStyles } from '@/features/calendar/utils/calendarTheme';
import ConfigurationSection from './inspectorSections/ConfigurationSection';
import HeaderSection from './inspectorSections/HeaderSection';
import WeekdaySection from './inspectorSections/WeekdaySection';
import CellSection from './inspectorSections/CellSection';
import WeekendSection from './inspectorSections/WeekendSection';
import AdjacentMonthSection from './inspectorSections/AdjacentMonthSection';

import type { CalendarStyles } from '@/features/calendar/types';

export const CalendarInspector: React.FC = () => {
  const {
    calendarData,
    setCalendarDate,
    setCalendarStyle,
    resetCalendarStylesToDefaults,
    layout,
    theme,
    setThemeTitleTextEffect,
  } = useStore();

  const { selectedDate, calendarStyles: userCalendarStyles = {} } = calendarData;
  const derived = deriveCalendarStyles(theme);
  const effective = mergeDerivedCalendarStyles(theme, userCalendarStyles);

  if (layout.base.type !== 'calendar') {
    return null;
  }

  const ids = {
    monthInput: 'calendar-month',
    headerFont: 'calendar-header-font',
    headerColor: 'calendar-header-color',
    weekdayFont: 'calendar-weekday-font',
    weekdayColor: 'calendar-weekday-color',
    weekdayBg: 'calendar-weekday-bg',
    cellFont: 'calendar-cell-font',
    cellText: 'calendar-cell-text-color',
    cellBg: 'calendar-cell-bg-color',
    cellBorder: 'calendar-cell-border-color',
    weekendText: 'calendar-weekend-text-color',
    weekendBg: 'calendar-weekend-bg-color',
    nonCurrentText: 'calendar-noncurrent-text-color',
    nonCurrentBg: 'calendar-noncurrent-bg-color',
    nonCurrentOpacity: 'calendar-noncurrent-opacity',
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">Calendar</h3>
        <div className="flex gap-2">
          <Button
            onClick={resetCalendarStylesToDefaults}
            size="sm"
            variant="outline"
          >
            Reset Styles
          </Button>
        </div>
      </div>

      <ConfigurationSection selectedDate={selectedDate} setCalendarDate={setCalendarDate} ids={ids} />
      <HeaderSection userCalendarStyles={userCalendarStyles} derived={derived} theme={theme} setCalendarStyle={setCalendarStyle} setThemeTitleTextEffect={setThemeTitleTextEffect} ids={ids} effective={effective} />
      <WeekdaySection userCalendarStyles={userCalendarStyles} derived={derived} theme={theme} setCalendarStyle={setCalendarStyle} ids={ids} effective={effective} />
      <CellSection userCalendarStyles={userCalendarStyles} derived={derived} theme={theme} setCalendarStyle={setCalendarStyle} ids={ids} effective={effective} />
      <WeekendSection userCalendarStyles={userCalendarStyles} theme={theme} setCalendarStyle={setCalendarStyle} ids={ids} effective={effective} />
      <AdjacentMonthSection userCalendarStyles={userCalendarStyles} setCalendarStyle={setCalendarStyle} ids={ids} effective={effective} />

      <div className="p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-800">
          Tip: Click a calendar cell to edit its content in the Date Inspector.
        </p>
      </div>
    </div>
  );
};

export default CalendarInspector;
