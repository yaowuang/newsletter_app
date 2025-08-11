import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type DateMode = 'single' | 'week' | 'month';

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
  formatISO
}) => {
  const titleInputId = React.useId();
  const dateInputId = React.useId();
  const dateInputValue = toDateInputValue(date);

  const handleDateChange = (newIso: string) => {
    if (dateMode === 'single') onDateChange(newIso);
    else if (dateMode === 'week') onDateChange(computeBusinessWeekRange(newIso));
    else onDateChange(newIso);
  };

  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 shadow p-4 space-y-4 border border-gray-100 dark:border-gray-800">
      <div className="space-y-2">
        <Label className="text-base font-medium" htmlFor={titleInputId}>Newsletter Title</Label>
        <Input id={titleInputId} name="newsletterTitle" type="text" value={title} onChange={e => onTitleChange(e.target.value)} className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium" htmlFor={dateInputId}>Date</Label>
          <Select value={dateMode} onValueChange={(v: DateMode) => {
            const currentDayISO = toDateInputValue(date) || formatISO(new Date());
            const currentMonth = currentDayISO.slice(0,7);
            if (v === 'month') {
              onDateChange(currentMonth);
            } else if (dateMode === 'month' && v === 'single') {
              onDateChange(`${currentMonth}-01`);
            } else if (dateMode === 'month' && v === 'week') {
              onDateChange(computeBusinessWeekRange(`${currentMonth}-01`));
            } else if (v === 'week' && dateMode === 'single') {
              onDateChange(computeBusinessWeekRange(currentDayISO));
            } else if (v === 'single' && dateMode === 'week') {
              onDateChange(currentDayISO);
            }
            onDateModeChange(v);
          }}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Date</SelectItem>
              <SelectItem value="week">Business Week</SelectItem>
              <SelectItem value="month">Month Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {dateMode !== 'month' && (
          <Input id={dateInputId} name="newsletterDate" type="date" value={dateMode === 'week' ? (dateInputValue || '') : (dateInputValue)} onChange={e => handleDateChange(e.target.value)} className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500" />
        )}
        {dateMode === 'month' && (
          <Input id={dateInputId} name="newsletterMonth" type="month" value={/^[0-9]{4}-[0-9]{2}$/.test(date) ? date : (dateInputValue ? dateInputValue.slice(0,7) : '')} onChange={e => handleDateChange(e.target.value)} className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500" />
        )}
        {dateMode === 'week' && dateInputValue && (
          <p className="text-xs text-gray-500 dark:text-gray-400">Week: {computeBusinessWeekRange(dateInputValue)}</p>
        )}
      </div>
    </div>
  );
};

export default TitleDateSection;
