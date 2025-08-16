import React from "react";
import FormGroup from "@/components/ui/FormGroup";
import InspectorSection from "@/components/ui/InspectorSection";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmojiToolbar from "@/features/newsletter/components/EmojiIconToolbar";

export type DateMode = "single" | "week" | "month";

interface TitleDateSectionProps {
  title: string;
  date: string;
  dateMode: DateMode;
  onTitleChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onDateModeChange: (m: DateMode) => void;
  computeBusinessWeekRange: (iso: string) => string;
  toDateInputValue: (val: string) => string;
  formatISO: (d: Date) => string;
}

export const TitleDateSection: React.FC<TitleDateSectionProps> = ({
  title,
  date,
  dateMode,
  onTitleChange,
  onDateChange,
  onDateModeChange,
  computeBusinessWeekRange,
  toDateInputValue,
  formatISO,
}) => {
  const titleInputId = React.useId();
  const dateInputId = React.useId();
  const dateInputValue = toDateInputValue(date);

  const handleDateChange = (newIso: string) => {
    if (dateMode === "single") onDateChange(newIso);
    else if (dateMode === "week") onDateChange(computeBusinessWeekRange(newIso));
    else onDateChange(newIso);
  };

  const titleInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <InspectorSection title="Title & Date">
      <FormGroup label="Newsletter Title" id={titleInputId}>
        <div className="flex flex-col gap-1">
          <Input
            ref={titleInputRef}
            id={titleInputId}
            name="newsletterTitle"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          <EmojiToolbar
            onInsert={(emoji) => {
              const el = titleInputRef.current;
              const cur = title || "";
              if (!el) {
                onTitleChange(cur + emoji);
                return;
              }
              const start = el.selectionStart ?? cur.length;
              const end = el.selectionEnd ?? start;
              const next = cur.slice(0, start) + emoji + cur.slice(end);
              onTitleChange(next);
              requestAnimationFrame(() => {
                if (titleInputRef.current) {
                  const pos = start + emoji.length;
                  titleInputRef.current.selectionStart = titleInputRef.current.selectionEnd = pos;
                  titleInputRef.current.focus();
                }
              });
            }}
          />
        </div>
      </FormGroup>
      <FormGroup label="Date Mode" id={dateInputId} inline>
        <Select
          value={dateMode}
          onValueChange={(v: DateMode) => {
            const currentDayISO = toDateInputValue(date) || formatISO(new Date());
            const currentMonth = currentDayISO.slice(0, 7);
            if (v === "month") {
              onDateChange(currentMonth);
            } else if (dateMode === "month" && v === "single") {
              onDateChange(`${currentMonth}-01`);
            } else if (dateMode === "month" && v === "week") {
              onDateChange(computeBusinessWeekRange(`${currentMonth}-01`));
            } else if (v === "week" && dateMode === "single") {
              onDateChange(computeBusinessWeekRange(currentDayISO));
            } else if (v === "single" && dateMode === "week") {
              onDateChange(currentDayISO);
            }
            onDateModeChange(v);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single Date</SelectItem>
            <SelectItem value="week">Business Week</SelectItem>
            <SelectItem value="month">Month Only</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      {dateMode !== "month" && (
        <FormGroup label={dateMode === "week" ? "Week Start" : "Date"} id={`${dateInputId}-date`}>
          <Input
            id={dateInputId}
            name="newsletterDate"
            type="date"
            value={dateMode === "week" ? dateInputValue || "" : dateInputValue}
            onChange={(e) => handleDateChange(e.target.value)}
          />
          {dateMode === "week" && dateInputValue && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Week: {computeBusinessWeekRange(dateInputValue)}
            </p>
          )}
        </FormGroup>
      )}
      {dateMode === "month" && (
        <FormGroup label="Month" id={`${dateInputId}-month`}>
          <Input
            id={dateInputId}
            name="newsletterMonth"
            type="month"
            value={/^[0-9]{4}-[0-9]{2}$/.test(date) ? date : dateInputValue ? dateInputValue.slice(0, 7) : ""}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </FormGroup>
      )}
    </InspectorSection>
  );
};

export default TitleDateSection;
