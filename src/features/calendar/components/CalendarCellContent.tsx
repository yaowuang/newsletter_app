import type React from "react";
import { MarkdownModalEditor } from "@/components/common/MarkdownModalEditor";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";

interface CalendarCellContentProps {
  date: Date;
  content: string;
  isEditing: boolean;
  draftContent: string;
  onChange: (v: string) => void;
  onAccept: () => void;
  onCancel: () => void;
  label?: string;
  placeholder?: string;
  useModalEditor?: boolean; // If true, use MarkdownModalEditor, else use textarea
  style?: React.CSSProperties;
  fontSize?: string | number;
  fontFamily?: string;
  color?: string;
}

const CalendarCellContent: React.FC<CalendarCellContentProps> = ({
  date,
  content,
  isEditing,
  draftContent,
  onChange,
  onAccept,
  onCancel,
  label,
  placeholder,
  useModalEditor = true,
  style = {},
  fontSize = "12px",
  fontFamily,
  color,
}) => {
  if (isEditing) {
    if (useModalEditor) {
      return (
        <MarkdownModalEditor
          value={draftContent}
          onChange={onChange}
          onAccept={onAccept}
          onCancel={onCancel}
          label={label || `Edit content for ${date.toISOString().slice(0, 10)}`}
          placeholder={placeholder || "Enter Markdown for this date..."}
        />
      );
    }
    // Inline textarea for split cell
    return (
      <div style={{ position: "relative", flex: 1, width: "100%" }} data-calendar-inline-editor="true">
        <textarea
          value={draftContent}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              onAccept();
            } else if (e.key === "Escape") {
              e.preventDefault();
              onCancel();
            }
          }}
          style={{
            position: "absolute",
            inset: 0,
            resize: "none",
            background: "white",
            border: "1px solid #60a5fa",
            fontSize,
            lineHeight: 1.2,
            padding: "2px 2px",
            outline: "none",
            fontFamily,
            color,
            borderRadius: 2,
          }}
          data-inline-calendar-editor="true"
          aria-label={label || `Edit content for ${date.toISOString().slice(0, 10)}`}
        />
      </div>
    );
  }
  if (content) {
    return (
      <div
        className="calendar-cell-content"
        style={{
          fontSize,
          flex: 1,
          overflow: "hidden",
          wordWrap: "break-word",
          ...style,
        }}
      >
        <MarkdownRenderer markdown={content} />
      </div>
    );
  }
  return null;
};

export default CalendarCellContent;
