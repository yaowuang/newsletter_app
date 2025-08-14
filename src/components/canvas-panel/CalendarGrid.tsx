import React from 'react';
import { PastelRotateText } from '@/components/common/PastelRotateText';
import { RainbowRotateText } from '@/components/common/RainbowRotateText';
import { useStore } from '@/lib/store';
import { generateCalendarGrid, getWeekdayNames, formatCalendarTitle } from '@/lib/calendar';
import { mergeDerivedCalendarStyles } from '@/lib/calendarTheme';
import { basicMarkdownToHtml } from '@/lib/markdown';

interface CalendarGridProps {
  containerWidth: number;
  containerHeight: number;
  onSelectElement: (id: string | null, type?: 'text' | 'image' | 'horizontalLine' | 'calendarDate') => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ containerWidth, containerHeight, onSelectElement }) => {
  const { calendarData, theme } = useStore();
  const { selectedDate, cellContents, calendarStyles: userCalendarStyles = {} } = calendarData;
  const calendarStyles = mergeDerivedCalendarStyles(theme, userCalendarStyles);

  // Generate calendar grid for selected month
  const calendarGrid = generateCalendarGrid(selectedDate);
  const weekdayNames = getWeekdayNames('long');
  const calendarTitle = formatCalendarTitle(selectedDate, 'full', 'full');
  const textEffectId = theme.styles.title.textEffectId;
  const isPastelRotate = textEffectId === 'pastel-rotate';
  const isRainbowRotate = textEffectId === 'rainbow-rotate';
  let renderedCalendarTitle: React.ReactNode = calendarTitle;
  if (isPastelRotate) {
    renderedCalendarTitle = <PastelRotateText text={calendarTitle} />;
  } else if (isRainbowRotate) {
    renderedCalendarTitle = <RainbowRotateText text={calendarTitle} />;
  }

  // Calculate dimensions
  const columns = 7; // week numbers removed
  const titleHeight = 60; // Space for month/year title
  const headerHeight = 40; // Space for weekday names
  const availableCalendarHeight = containerHeight - titleHeight - headerHeight;
  const cellWidth = containerWidth / columns;
  // We always visually show 5 rows. If a 6th week exists, it will be merged (split) into the 5th row.
  const cellHeight = availableCalendarHeight / 5;

  // Utility to build a stable local date key (YYYY-MM-DD) without UTC shift issues
  const toDateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Get cell content for a specific date
  const getCellContent = (date: Date) => {
    const dateKey = toDateKey(date);
    return cellContents?.[dateKey] || '';
  };

  // Handle cell click for date selection
  const handleCellClick = (date: Date) => {
    const dateKey = toDateKey(date);
    onSelectElement(dateKey, 'calendarDate');
  };

  // Apply calendar styles with fallbacks
  const getHeaderStyles = () => ({
    fontFamily: calendarStyles.headerFontFamily || theme.styles.title.fontFamily || 'inherit',
    color: calendarStyles.headerColor || '#1f2937',
    // Force fully transparent header bar (no gradient/background fill)
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    textShadow: theme.styles.title.textShadow,
    filter: theme.styles.title.filter,
    transform: theme.styles.title.transform
  });

  // Build inner text style for gradient / clipped text (so container stays transparent)
  const headerTextStyle: React.CSSProperties = {};
  if (!isPastelRotate && !isRainbowRotate) {
    if (theme.styles.title.backgroundImage) headerTextStyle.backgroundImage = theme.styles.title.backgroundImage;
    if (theme.styles.title.backgroundSize) headerTextStyle.backgroundSize = theme.styles.title.backgroundSize;
    if (theme.styles.title.WebkitBackgroundClip) headerTextStyle.WebkitBackgroundClip = theme.styles.title.WebkitBackgroundClip as unknown as string;
    if (theme.styles.title.backgroundClip) headerTextStyle.backgroundClip = theme.styles.title.backgroundClip;
    if (theme.styles.title.color) headerTextStyle.color = theme.styles.title.color; // may be transparent for gradient text
  }

  const getWeekdayStyles = () => ({
    fontFamily: calendarStyles.weekdayFontFamily || theme.styles.title.fontFamily || theme.styles.section.contentFontFamily || 'inherit',
    color: calendarStyles.weekdayColor || '#1f2937',
    backgroundColor: calendarStyles.weekdayBackgroundColor || '#f9fafb'
  });

  const getCellStyles = (isCurrentMonth: boolean, isToday: boolean, isWeekend: boolean) => {
  let backgroundColor = calendarStyles.cellBackgroundColor || theme.styles.page.backgroundColor || '#ffffff';
  let textColor = calendarStyles.cellTextColor || theme.styles.section.contentColor || '#1f2937';
    let opacity = 1;

    if (!isCurrentMonth) {
  backgroundColor = calendarStyles.nonCurrentMonthCellBackgroundColor || backgroundColor;
  textColor = calendarStyles.nonCurrentMonthCellTextColor || '#9ca3af';
  opacity = calendarStyles.nonCurrentMonthOpacity ?? 0.5;
    } else if (isWeekend) { // weekends always highlighted
  backgroundColor = calendarStyles.weekendCellBackgroundColor || backgroundColor;
  textColor = calendarStyles.weekendCellTextColor || textColor;
    }

    return {
      fontFamily: calendarStyles.cellFontFamily || theme.styles.section.contentFontFamily || 'inherit',
      backgroundColor,
      color: textColor,
  border: `1px solid ${calendarStyles.cellBorderColor || '#e5e7eb'}`,
      opacity
    };
  };

  // Week number styles removed

  // Render a calendar cell (standard full-height row)
  const renderCalendarCell = (date: Date, isCurrentMonth: boolean, isToday: boolean, isWeekend: boolean, rowIndex: number, colIndex: number) => {
    const cellContent = getCellContent(date);
    const cellLeft = colIndex * cellWidth;
    const cellTop = titleHeight + headerHeight + (rowIndex * cellHeight);
    const cellStyles = getCellStyles(isCurrentMonth, isToday, isWeekend);
    
    return (
      <div
        key={`${date.getTime()}-${rowIndex}-${colIndex}`}
        onClick={(e) => { e.stopPropagation(); handleCellClick(date); }}
        style={{
          position: 'absolute',
          left: cellLeft,
          top: cellTop,
          width: cellWidth,
          height: cellHeight,
          display: 'flex',
          flexDirection: 'column',
          padding: '8px',
          fontSize: '14px',
          cursor: 'pointer',
          ...cellStyles
        }}
      >
        {/* Date number - right justified */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          // Removed special bold styling for today's date
          fontWeight: 'normal',
          marginBottom: '4px'
        }}>
          {date.getDate()}
        </div>
        
        {/* Cell content */}
        {cellContent && (
          <div
            className="calendar-cell-content"
            style={{ 
              fontSize: '12px',
              flex: 1,
              overflow: 'hidden',
              wordWrap: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: basicMarkdownToHtml(cellContent) }}
          />
        )}
      </div>
    );
  };

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: containerWidth, 
        height: containerHeight,
        // Make entire calendar wrapper transparent so header area shows underlying page
        backgroundColor: 'transparent',
        fontFamily: theme.styles.section.contentFontFamily || 'inherit'
      }}
    >
      {/* Background layer for weekday headers + grid (excludes title zone) */}
      <div
        style={{
          position: 'absolute',
          top: titleHeight,
          left: 0,
          width: containerWidth,
          height: containerHeight - titleHeight,
          backgroundColor: theme.styles.page.backgroundColor || '#ffffff',
          zIndex: 0
        }}
      />
      {/* Calendar Title */}
    <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: containerWidth,
          height: titleHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          background: 'transparent',
          pointerEvents: 'none',
      zIndex: 2,
          ...getHeaderStyles()
        }}
      >
        {/* Inner span holds gradient / clip so surrounding bar is transparent */}
        <span style={headerTextStyle}>{renderedCalendarTitle}</span>
      </div>

      {/* Weekday headers */}
  {weekdayNames.map((day, index) => (
        <div
          key={day}
          style={{
            position: 'absolute',
            left: index * cellWidth,
            top: titleHeight,
            width: cellWidth,
            height: headerHeight,
            border: `1px solid ${calendarStyles.cellBorderColor || '#e5e7eb'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 1,
            ...getWeekdayStyles()
          }}
        >
          {day}
        </div>
      ))}

      {/* Calendar grid with conditional overflow for current-month days only */}
      {calendarGrid.weeks.slice(0, 4).map((week, weekIndex) => (
        <React.Fragment key={weekIndex}>
          {week.map((cell, dayIndex) =>
            renderCalendarCell(
              cell.date,
              cell.isCurrentMonth,
              cell.isToday,
              cell.isWeekend,
              weekIndex,
              dayIndex
            )
          )}
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
        const visualRowIndex = 4; // always the 5th displayed row
        const rowTop = titleHeight + headerHeight + (visualRowIndex * cellHeight);

        // If no sixth week just render normally
        if (!hasSixth) {
          return baseWeek.map((cell, dayIndex) =>
            renderCalendarCell(
              cell.date,
              cell.isCurrentMonth,
              cell.isToday,
              cell.isWeekend,
              visualRowIndex,
              dayIndex
            )
          );
        }

        // Sixth week exists: decide per column if we need to split (only if overflow cell still in current month)
        return baseWeek.map((topCell, dayIndex) => {
          const bottomCell = overflowWeek[dayIndex];
          const bottomInCurrentMonth = bottomCell && bottomCell.date.getMonth() === selectedMonth && bottomCell.date.getFullYear() === selectedYear;

          if (!bottomInCurrentMonth) {
            // Just render top cell full height (no split needed)
            return renderCalendarCell(
              topCell.date,
              topCell.isCurrentMonth,
              topCell.isToday,
              topCell.isWeekend,
              visualRowIndex,
              dayIndex
            );
          }

          // Split only this column
          const topCellContent = getCellContent(topCell.date);
          const bottomCellContent = bottomCell ? getCellContent(bottomCell.date) : '';
          const topStyles = getCellStyles(topCell.isCurrentMonth, topCell.isToday, topCell.isWeekend);
          const bottomStyles = bottomCell ? getCellStyles(bottomCell.isCurrentMonth, bottomCell.isToday, bottomCell.isWeekend) : topStyles;

          return (
            <div
              key={`split-${dayIndex}`}
              style={{
                position: 'absolute',
                left: dayIndex * cellWidth,
                top: rowTop,
                width: cellWidth,
                height: cellHeight,
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${calendarStyles.cellBorderColor || '#e5e7eb'}`,
                boxSizing: 'border-box'
              }}
            >
              <div
                onClick={(e) => { e.stopPropagation(); handleCellClick(topCell.date); }}
                style={{
                  position: 'relative',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  ...topStyles,
                  borderBottom: `1px solid ${calendarStyles.cellBorderColor || '#e5e7eb'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 'normal', marginBottom: '2px' }}>
                  {topCell.date.getDate()}
                </div>
                {topCellContent && (
                  <div
                    className="calendar-cell-content"
                    style={{ fontSize: '10px', flex: 1, overflow: 'hidden', wordWrap: 'break-word' }}
                    dangerouslySetInnerHTML={{ __html: basicMarkdownToHtml(topCellContent) }}
                  />
                )}
              </div>
              <div
                onClick={(e) => { if (bottomCell) { e.stopPropagation(); handleCellClick(bottomCell.date); } }}
                style={{
                  position: 'relative',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  ...bottomStyles
                }}
              >
                {bottomCell && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 'normal', marginBottom: '2px' }}>
                      {bottomCell.date.getDate()}
                    </div>
                    {bottomCellContent && (
                      <div
                        className="calendar-cell-content"
                        style={{ fontSize: '10px', flex: 1, overflow: 'hidden', wordWrap: 'break-word' }}
                        dangerouslySetInnerHTML={{ __html: basicMarkdownToHtml(bottomCellContent) }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          );
        });
      })()}
    </div>
  );
};


export default CalendarGrid;
