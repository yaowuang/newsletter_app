import type React from "react";
import { Button } from "@/components/ui/button";
import { deriveCalendarStyles, mergeDerivedCalendarStyles } from "@/lib/calendarTheme";
import { useStore } from "@/lib/store";
import AdjacentMonthSection from "./inspectorSections/AdjacentMonthSection";
import CellSection from "./inspectorSections/CellSection";
import ConfigurationSection from "./inspectorSections/ConfigurationSection";
import HeaderSection from "./inspectorSections/HeaderSection";
import WeekdaySection from "./inspectorSections/WeekdaySection";
import WeekendSection from "./inspectorSections/WeekendSection";

export const CalendarInspector: React.FC = () => {
  // a11y ids (pattern similar to TextInspector for consistency)
  const ids = {
    monthInput: "calendar-month",
    headerFont: "calendar-header-font",
    headerColor: "calendar-header-color",
    weekdayFont: "calendar-weekday-font",
    weekdayColor: "calendar-weekday-color",
    weekdayBg: "calendar-weekday-bg",
    cellFont: "calendar-cell-font",
    cellText: "calendar-cell-text-color",
    cellBg: "calendar-cell-bg-color",
    cellBorder: "calendar-cell-border-color",
    weekendText: "calendar-weekend-text-color",
    weekendBg: "calendar-weekend-bg-color",
    nonCurrentText: "calendar-noncurrent-text-color",
    nonCurrentBg: "calendar-noncurrent-bg-color",
    nonCurrentOpacity: "calendar-noncurrent-opacity",
  } as const;
  const {
    calendarData,
    setCalendarDate,
    // Removed week number + weekend toggles (always on weekends highlight, never show week numbers)
    setCalendarStyle,
    resetCalendarStylesToDefaults,
    layout,
    theme,
    setThemeTitleTextEffect,
  } = useStore();
  const { selectedDate, calendarStyles: userCalendarStyles = {} } = calendarData;
  const derived = deriveCalendarStyles(theme);
  const effective = mergeDerivedCalendarStyles(theme, userCalendarStyles);

  // Only show calendar inspector when calendar layout is active
  if (layout.base.type !== "calendar") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">Calendar</h3>
        <div className="flex gap-2">
          <Button onClick={resetCalendarStylesToDefaults} size="sm" variant="outline">
            Reset Styles
          </Button>
        </div>
      </div>
      <ConfigurationSection selectedDate={selectedDate} setCalendarDate={setCalendarDate} ids={ids} />
      <HeaderSection
        userCalendarStyles={userCalendarStyles}
        derived={derived}
        effective={effective}
        theme={theme}
        setCalendarStyle={setCalendarStyle}
        setThemeTitleTextEffect={setThemeTitleTextEffect}
        ids={ids}
      />
      <WeekdaySection
        userCalendarStyles={userCalendarStyles}
        derived={derived}
        effective={effective}
        theme={theme}
        setCalendarStyle={setCalendarStyle}
        ids={ids}
      />
      <CellSection
        userCalendarStyles={userCalendarStyles}
        derived={derived}
        effective={effective}
        theme={theme}
        setCalendarStyle={setCalendarStyle}
        ids={ids}
      />
      <WeekendSection
        userCalendarStyles={userCalendarStyles}
        effective={effective}
        theme={theme}
        setCalendarStyle={setCalendarStyle}
        ids={ids}
      />
      <AdjacentMonthSection
        userCalendarStyles={userCalendarStyles}
        effective={effective}
        theme={theme}
        setCalendarStyle={setCalendarStyle}
        ids={ids}
      />
      <div className="p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-800">Tip: Click a calendar cell to edit its content in the Date Inspector.</p>
      </div>
    </div>
  );
};

export default CalendarInspector;
