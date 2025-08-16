import React from "react";
import { useStore } from "@/lib/store/index";
import type { CalendarCell as CalendarCellType } from "../utils/calendar";
import { formatCalendarTitle, generateCalendarGrid, getWeekdayNames } from "../utils/calendar";
import { mergeDerivedCalendarStyles } from "../utils/calendarTheme";

interface CalendarGridProps {
  containerWidth: number;
  containerHeight: number;
  onSelectElement: (id: string | null, type?: "text" | "image" | "horizontalLine" | "calendarDate") => void;
}

import CalendarCell from "./CalendarCell";
import CalendarTitle from "./CalendarTitle";
import SplitCalendarCell from "./SplitCalendarCell";
import WeekdayHeader from "./WeekdayHeader";

export const CalendarGrid: React.FC<CalendarGridProps> = ({ containerWidth, containerHeight, onSelectElement }) => {
  const { calendarData, theme, setEditingDateKey, setDraftContent } = useStore();
  const { selectedDate, cellContents, calendarStyles: userCalendarStyles = {} } = calendarData;
  const calendarStyles = mergeDerivedCalendarStyles(theme, userCalendarStyles);

  // Generate calendar grid for selected month
  const calendarGrid = generateCalendarGrid(selectedDate);
  const weekdayNames = getWeekdayNames("long");
  const calendarTitle = formatCalendarTitle(selectedDate, "full", "full");
  const textEffectId = theme.styles.title.textEffectId;
  const isPastelRotate = textEffectId === "pastel-rotate";
  const isRainbowRotate = textEffectId === "rainbow-rotate";

  // Calculate dimension
  const columns = 7;
  const titleHeight = 60;
  const headerHeight = 40;
  const availableCalendarHeight = containerHeight - titleHeight - headerHeight;
  const cellWidth = containerWidth / columns;
  const cellHeight = availableCalendarHeight / 5;

  const toDateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const getCellContent = (date: Date) => {
    const dateKey = toDateKey(date);
    return cellContents?.[dateKey] || "";
  };

  const handleCellClick = (date: Date) => {
    const dateKey = toDateKey(date);
    onSelectElement(dateKey, "calendarDate");
  };

  const handleCellDoubleClick = (date: Date) => {
    if (!date) return;
    const key = toDateKey(date);
    setEditingDateKey?.(key);
    setDraftContent?.(getCellContent(date));
    onSelectElement(key, "calendarDate");
  };

  const getHeaderStyles = () => ({
    fontFamily: calendarStyles.headerFontFamily || theme.styles.title.fontFamily || "inherit",
    color: calendarStyles.headerColor || "#1f2937",
    backgroundColor: "transparent",
    backgroundImage: "none",
    textShadow: theme.styles.title.textShadow,
    filter: theme.styles.title.filter,
    transform: theme.styles.title.transform,
  });

  const headerTextStyle: React.CSSProperties = {};
  if (!isPastelRotate && !isRainbowRotate) {
    if (theme.styles.title.backgroundImage) headerTextStyle.backgroundImage = theme.styles.title.backgroundImage;
    if (theme.styles.title.backgroundSize) headerTextStyle.backgroundSize = theme.styles.title.backgroundSize;
    if (theme.styles.title.WebkitBackgroundClip)
      headerTextStyle.WebkitBackgroundClip = theme.styles.title.WebkitBackgroundClip as unknown as string;
    if (theme.styles.title.backgroundClip) headerTextStyle.backgroundClip = theme.styles.title.backgroundClip;
    if (theme.styles.title.color) headerTextStyle.color = theme.styles.title.color;
  }

  const getWeekdayStyles = () => ({
    fontFamily:
      calendarStyles.weekdayFontFamily ||
      theme.styles.title.fontFamily ||
      theme.styles.section.contentFontFamily ||
      "inherit",
    color: calendarStyles.weekdayColor || "#1f2937",
    backgroundColor: calendarStyles.weekdayBackgroundColor || "#f9fafb",
  });

  const getCellStyles = (isCurrentMonth: boolean, isWeekend: boolean) => {
    let backgroundColor = calendarStyles.cellBackgroundColor || theme.styles.page.backgroundColor || "#ffffff";
    let textColor = calendarStyles.cellTextColor || theme.styles.section.contentColor || "#1f2937";
    let opacity = 1;
    if (!isCurrentMonth) {
      backgroundColor = calendarStyles.nonCurrentMonthCellBackgroundColor || backgroundColor;
      textColor = calendarStyles.nonCurrentMonthCellTextColor || "#9ca3af";
      opacity = calendarStyles.nonCurrentMonthOpacity ?? 0.5;
    } else if (isWeekend) {
      backgroundColor = calendarStyles.weekendCellBackgroundColor || backgroundColor;
      textColor = calendarStyles.weekendCellTextColor || textColor;
    }
    return {
      fontFamily: calendarStyles.cellFontFamily || theme.styles.section.contentFontFamily || "inherit",
      backgroundColor,
      color: textColor,
      border: `1px solid ${calendarStyles.cellBorderColor || "#e5e7eb"}`,
      opacity,
    };
  };

  return (
    <div
      style={{
        position: "relative",
        width: containerWidth,
        height: containerHeight,
        backgroundColor: "transparent",
        fontFamily: theme.styles.section.contentFontFamily || "inherit",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: titleHeight,
          left: 0,
          width: containerWidth,
          height: containerHeight - titleHeight,
          backgroundColor: theme.styles.page.backgroundColor || "#ffffff",
          zIndex: 0,
        }}
      />
      <CalendarTitle
        width={containerWidth}
        height={titleHeight}
        title={calendarTitle}
        textEffectId={textEffectId || ""}
        headerStyles={getHeaderStyles()}
        headerTextStyle={headerTextStyle}
      />
      <WeekdayHeader
        weekdayNames={weekdayNames}
        cellWidth={cellWidth}
        titleHeight={titleHeight}
        headerHeight={headerHeight}
        calendarStyles={calendarStyles as Record<string, unknown>}
        getWeekdayStyles={getWeekdayStyles}
      />
      {calendarGrid.weeks.slice(0, 4).map((week: CalendarCellType[], weekIndex: number) => (
        <React.Fragment
          key={week.length > 0 ? week.map((cell) => cell.date.getTime()).join("-") : `empty-week-${weekIndex}`}
        >
          {week.map((cell: CalendarCellType, dayIndex: number) => (
            <CalendarCell
              key={`${cell.date.getTime()}-${weekIndex}-${dayIndex}`}
              date={cell.date}
              isCurrentMonth={cell.isCurrentMonth}
              isToday={cell.isToday}
              isWeekend={cell.isWeekend}
              rowIndex={weekIndex}
              colIndex={dayIndex}
              cellWidth={cellWidth}
              cellHeight={cellHeight}
              cellStyles={getCellStyles(cell.isCurrentMonth, cell.isWeekend)}
              cellContent={getCellContent(cell.date)}
              toDateKey={toDateKey}
              onClick={handleCellClick}
              onDoubleClick={handleCellDoubleClick}
            />
          ))}
        </React.Fragment>
      ))}
      {(() => {
        const weeks = calendarGrid.weeks;
        if (weeks.length === 0) return null;
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        const hasSixth = weeks.length === 6;
        const baseWeek = hasSixth ? weeks[4] : weeks[weeks.length - 1];
        const overflowWeek = hasSixth ? weeks[5] : [];
        const visualRowIndex = 4;
        const rowTop = titleHeight + headerHeight + visualRowIndex * cellHeight;
        if (!hasSixth) {
          return baseWeek.map((cell: CalendarCellType, dayIndex: number) => (
            <CalendarCell
              key={`${cell.date.getTime()}-${visualRowIndex}-${dayIndex}`}
              date={cell.date}
              isCurrentMonth={cell.isCurrentMonth}
              isToday={cell.isToday}
              isWeekend={cell.isWeekend}
              rowIndex={visualRowIndex}
              colIndex={dayIndex}
              cellWidth={cellWidth}
              cellHeight={cellHeight}
              cellStyles={getCellStyles(cell.isCurrentMonth, cell.isWeekend)}
              cellContent={getCellContent(cell.date)}
              toDateKey={toDateKey}
              onClick={handleCellClick}
              onDoubleClick={handleCellDoubleClick}
            />
          ));
        }
        return baseWeek.map((topCell: CalendarCellType, dayIndex: number) => {
          const bottomCell = overflowWeek[dayIndex];
          const bottomInCurrentMonth =
            bottomCell &&
            bottomCell.date.getMonth() === selectedMonth &&
            bottomCell.date.getFullYear() === selectedYear;
          if (!bottomInCurrentMonth) {
            return (
              <CalendarCell
                key={`${topCell.date.getTime()}-${visualRowIndex}-${dayIndex}`}
                date={topCell.date}
                isCurrentMonth={topCell.isCurrentMonth}
                isToday={topCell.isToday}
                isWeekend={topCell.isWeekend}
                rowIndex={visualRowIndex}
                colIndex={dayIndex}
                cellWidth={cellWidth}
                cellHeight={cellHeight}
                cellStyles={getCellStyles(topCell.isCurrentMonth, topCell.isWeekend)}
                cellContent={getCellContent(topCell.date)}
                toDateKey={toDateKey}
                onClick={handleCellClick}
                onDoubleClick={handleCellDoubleClick}
              />
            );
          }
          return (
            <SplitCalendarCell
              key={`split-${topCell.date.getTime()}-${bottomCell ? bottomCell.date.getTime() : "none"}`}
              dayIndex={dayIndex}
              rowTop={rowTop}
              cellWidth={cellWidth}
              cellHeight={cellHeight}
              calendarStyles={calendarStyles}
              topCell={topCell}
              bottomCell={bottomCell}
              topCellContent={getCellContent(topCell.date)}
              bottomCellContent={bottomCell ? getCellContent(bottomCell.date) : ""}
              topStyles={getCellStyles(topCell.isCurrentMonth, topCell.isWeekend)}
              bottomStyles={bottomCell ? getCellStyles(bottomCell.isCurrentMonth, bottomCell.isWeekend) : {}}
              toDateKey={toDateKey}
              onClick={handleCellClick}
            />
          );
        });
      })()}
    </div>
  );
};

export default CalendarGrid;
