import React from 'react';
import { useStore } from '@/lib/store';
import { formatCalendarTitle } from '@/lib/calendar';
import { Button } from '@/components/ui/button';
import { FontSelect } from '@/components/inspector-panel/FontSelect';
import { TextEffectPicker } from '@/components/ui/TextEffectPicker';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';
import ColorInputWithReset from '@/components/ui/ColorInputWithReset';
import { Input } from '@/components/ui/input';
import { deriveCalendarStyles, mergeDerivedCalendarStyles } from '@/lib/calendarTheme';

export const CalendarInspector: React.FC = () => {
  const { 
    calendarData, 
    setCalendarDate, 
    // Removed week number + weekend toggles (always on weekends highlight, never show week numbers)
    setCalendarStyle,
    resetCalendarStylesToDefaults,
  layout,
  theme,
  setThemeTitleTextEffect
  } = useStore();

  const { selectedDate, calendarStyles: userCalendarStyles = {} } = calendarData;
  const derived = deriveCalendarStyles(theme);
  const effective = mergeDerivedCalendarStyles(theme, userCalendarStyles);

  // Only show calendar inspector when calendar layout is active
  if (layout.base.type !== 'calendar') {
    return null;
  }

  const formatDateForInput = (date: Date) => {
    // Local date key (YYYY-MM) for month input; avoid UTC shift
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // a11y ids (pattern similar to TextInspector for consistency)
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
    nonCurrentOpacity: 'calendar-noncurrent-opacity'
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

      <InspectorSection title="Configuration">
        <FormGroup label="Selected Month" id={ids.monthInput}>
          <Input
            id={ids.monthInput}
            type="month"
            value={formatDateForInput(selectedDate).substring(0, 7)}
            onChange={(e) => {
              const [year, month] = e.target.value.split('-');
              const newDate = new Date(parseInt(year), parseInt(month) - 1, 1);
              setCalendarDate(newDate);
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            Viewing {formatCalendarTitle(selectedDate, 'full', 'full')}
          </p>
        </FormGroup>
      </InspectorSection>

      <InspectorSection title="Header Styles (Month / Year)">
        <FormGroup label="Text Effect" id="calendar-header-effect" inline>
          <TextEffectPicker
            value={theme.styles.title.textEffectId}
            onChange={(effectId) => setThemeTitleTextEffect?.(effectId)}
            className="flex-1"
          />
        </FormGroup>
        <FormGroup label="Font" id={ids.headerFont} inline>
          <FontSelect
            id={ids.headerFont}
            value={userCalendarStyles.headerFontFamily || derived.headerFontFamily || theme.styles.title.fontFamily}
            onChange={(val) => setCalendarStyle('headerFontFamily', val)}
          />
        </FormGroup>
        <FormGroup label="Color" id={ids.headerColor} inline>
          <ColorInputWithReset
            id={ids.headerColor}
            value={userCalendarStyles.headerColor || effective.headerColor || '#1f2937'}
            onChange={(v) => setCalendarStyle('headerColor', v)}
            onReset={() => setCalendarStyle('headerColor', undefined)}
          />
        </FormGroup>
      </InspectorSection>

      <InspectorSection title="Weekday Header Styles">
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Font" id={ids.weekdayFont} inline className="min-w-0 col-span-2">
            <FontSelect
              id={ids.weekdayFont}
              value={userCalendarStyles.weekdayFontFamily || derived.weekdayFontFamily || theme.styles.section.contentFontFamily || theme.styles.title.fontFamily}
              onChange={(val) => setCalendarStyle('weekdayFontFamily', val)}
            />
          </FormGroup>
          <FormGroup label="Text" id={ids.weekdayColor} inline className="min-w-0">
            <ColorInputWithReset
              id={ids.weekdayColor}
              value={userCalendarStyles.weekdayColor || effective.weekdayColor || '#1f2937'}
              onChange={(v) => setCalendarStyle('weekdayColor', v)}
              onReset={() => setCalendarStyle('weekdayColor', undefined)}
            />
          </FormGroup>
          <FormGroup label="Background" id={ids.weekdayBg} inline className="min-w-0 col-span-2">
            <ColorInputWithReset
              id={ids.weekdayBg}
              value={userCalendarStyles.weekdayBackgroundColor || effective.weekdayBackgroundColor || '#f9fafb'}
              onChange={(v) => setCalendarStyle('weekdayBackgroundColor', v)}
              onReset={() => setCalendarStyle('weekdayBackgroundColor', undefined)}
            />
          </FormGroup>
        </div>
      </InspectorSection>

      <InspectorSection title="Cell Styles">
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Font" id={ids.cellFont} inline className="min-w-0 col-span-2">
            <FontSelect
              id={ids.cellFont}
              value={userCalendarStyles.cellFontFamily || derived.cellFontFamily || theme.styles.section.contentFontFamily}
              onChange={(val) => setCalendarStyle('cellFontFamily', val)}
            />
          </FormGroup>
          <FormGroup label="Text" id={ids.cellText} inline className="min-w-0">
            <ColorInputWithReset
              id={ids.cellText}
              value={userCalendarStyles.cellTextColor || effective.cellTextColor || '#1f2937'}
              onChange={(v) => setCalendarStyle('cellTextColor', v)}
              onReset={() => setCalendarStyle('cellTextColor', undefined)}
            />
          </FormGroup>
          <FormGroup label="Background" id={ids.cellBg} inline className="min-w-0">
            <ColorInputWithReset
              id={ids.cellBg}
              value={userCalendarStyles.cellBackgroundColor || effective.cellBackgroundColor || '#ffffff'}
              onChange={(v) => setCalendarStyle('cellBackgroundColor', v)}
              onReset={() => setCalendarStyle('cellBackgroundColor', undefined)}
            />
          </FormGroup>
          <FormGroup label="Border" id={ids.cellBorder} inline className="min-w-0 col-span-2">
            <ColorInputWithReset
              id={ids.cellBorder}
              value={userCalendarStyles.cellBorderColor || effective.cellBorderColor || '#e5e7eb'}
              onChange={(v) => setCalendarStyle('cellBorderColor', v)}
              onReset={() => setCalendarStyle('cellBorderColor', undefined)}
            />
          </FormGroup>
        </div>
      </InspectorSection>


      <InspectorSection title="Weekend Styles">
        <p className="text-xs text-gray-500 mb-3">Weekends are automatically highlighted.</p>
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Text" id={ids.weekendText} inline className="min-w-0">
            <ColorInputWithReset
              id={ids.weekendText}
              value={userCalendarStyles.weekendCellTextColor || effective.weekendCellTextColor || effective.cellTextColor || '#1f2937'}
              onChange={(v) => setCalendarStyle('weekendCellTextColor', v)}
              onReset={() => setCalendarStyle('weekendCellTextColor', undefined)}
            />
          </FormGroup>
          <FormGroup label="Background" id={ids.weekendBg} inline className="min-w-0">
            <ColorInputWithReset
              id={ids.weekendBg}
              value={userCalendarStyles.weekendCellBackgroundColor || effective.weekendCellBackgroundColor || `${theme.styles.title.color || '#3B82F6'}20`}
              onChange={(v) => setCalendarStyle('weekendCellBackgroundColor', v)}
              onReset={() => setCalendarStyle('weekendCellBackgroundColor', undefined)}
            />
          </FormGroup>
        </div>
      </InspectorSection>

      <InspectorSection title="Adjacent Month Cell Styles">
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Text" id={ids.nonCurrentText} inline className="min-w-0">
            <ColorInputWithReset
              id={ids.nonCurrentText}
              value={userCalendarStyles.nonCurrentMonthCellTextColor || effective.nonCurrentMonthCellTextColor || '#9ca3af'}
              onChange={(v) => setCalendarStyle('nonCurrentMonthCellTextColor', v)}
              onReset={() => setCalendarStyle('nonCurrentMonthCellTextColor', undefined)}
            />
          </FormGroup>
          <FormGroup label="Background" id={ids.nonCurrentBg} inline className="min-w-0">
            <ColorInputWithReset
              id={ids.nonCurrentBg}
              value={userCalendarStyles.nonCurrentMonthCellBackgroundColor || effective.nonCurrentMonthCellBackgroundColor || '#f3f4f6'}
              onChange={(v) => setCalendarStyle('nonCurrentMonthCellBackgroundColor', v)}
              onReset={() => setCalendarStyle('nonCurrentMonthCellBackgroundColor', undefined)}
            />
          </FormGroup>
          <FormGroup label="Opacity" id={ids.nonCurrentOpacity} inline className="min-w-0 col-span-2">
            <div className="w-full">
              <Input
                id={ids.nonCurrentOpacity}
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={userCalendarStyles.nonCurrentMonthOpacity ?? effective.nonCurrentMonthOpacity ?? 0.5}
                onChange={(e) => setCalendarStyle('nonCurrentMonthOpacity', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-[10px] text-center text-gray-500 mt-1">
                {Math.round(((userCalendarStyles.nonCurrentMonthOpacity ?? effective.nonCurrentMonthOpacity ?? 0.5) * 100))}%
              </div>
            </div>
          </FormGroup>
        </div>
      </InspectorSection>

      <div className="p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-800">
          Tip: Click a calendar cell to edit its content in the Date Inspector.
        </p>
      </div>
    </div>
  );
};

export default CalendarInspector;
