import type React from "react";

interface WeekdayHeaderProps {
  weekdayNames: string[];
  cellWidth: number;
  titleHeight: number;
  headerHeight: number;
  calendarStyles: Record<string, unknown>;
  getWeekdayStyles: () => React.CSSProperties;
}

const WeekdayHeader: React.FC<WeekdayHeaderProps> = ({
  weekdayNames,
  cellWidth,
  titleHeight,
  headerHeight,
  calendarStyles,
  getWeekdayStyles,
}) => (
  <>
    {weekdayNames.map((day: string, index: number) => (
      <div
        key={day}
        style={{
          position: "absolute",
          left: index * cellWidth,
          top: titleHeight,
          width: cellWidth,
          height: headerHeight,
          border: `1px solid ${calendarStyles.cellBorderColor || "#e5e7eb"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
          zIndex: 1,
          ...getWeekdayStyles(),
        }}
      >
        {day}
      </div>
    ))}
  </>
);

export default WeekdayHeader;
