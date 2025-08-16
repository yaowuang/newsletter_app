import type React from "react";
import { useStore } from "@/lib/store/index";
import CalendarCellContent from "./CalendarCellContent";

interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  rowIndex: number;
  colIndex: number;
  cellWidth: number;
  cellHeight: number;
  cellStyles: React.CSSProperties;
  cellContent: string;
  toDateKey: (d: Date) => string;
  onClick: (date: Date) => void;
  onDoubleClick: (date: Date) => void;
}

const CalendarCell: React.FC<CalendarCellProps> = (props) => {
  const {
    date,
    rowIndex,
    colIndex,
    cellWidth,
    cellHeight,
    cellStyles,
    cellContent,
    toDateKey,
    onClick,
    onDoubleClick,
  } = props;
  const editingDateKey = useStore((s) => s.calendarData.editingDateKey);
  const draftContent = useStore((s) => s.calendarData.draftContent) ?? "";
  const setEditingDateKey = useStore((s) => s.setEditingDateKey);
  const setDraftContent = useStore((s) => s.setDraftContent);
  const setCellContent = useStore((s) => s.setCellContent);

  const isEditing = editingDateKey === toDateKey(date);
  const handleBeginEdit = () => {
    setEditingDateKey?.(toDateKey(date));
    setDraftContent?.(cellContent);
  };
  const handleCommitEdit = () => {
    setCellContent(toDateKey(date), draftContent || "");
    setEditingDateKey?.(null);
    setDraftContent?.("");
  };
  const handleCancelEdit = () => {
    setEditingDateKey?.(null);
    setDraftContent?.("");
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: canvaspanel item
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(date);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(date);
        handleBeginEdit();
      }}
      style={{
        position: "absolute",
        left: colIndex * cellWidth,
        top: 60 + 40 + rowIndex * cellHeight,
        width: cellWidth,
        height: cellHeight,
        display: "flex",
        flexDirection: "column",
        padding: "8px",
        fontSize: "14px",
        cursor: "pointer",
        ...cellStyles,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          fontWeight: "normal",
          marginBottom: "4px",
        }}
      >
        {date.getDate()}
      </div>
      <CalendarCellContent
        date={date}
        content={cellContent}
        isEditing={isEditing}
        draftContent={draftContent || ""}
        onChange={setDraftContent ?? (() => {})}
        onAccept={handleCommitEdit}
        onCancel={handleCancelEdit}
        useModalEditor={true}
        fontSize="12px"
      />
    </div>
  );
};

export default CalendarCell;
