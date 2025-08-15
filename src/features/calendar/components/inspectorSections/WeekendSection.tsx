import React from 'react';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';
import ColorInputWithReset from '@/components/ui/ColorInputWithReset';
import type { CalendarStyles } from '@/features/calendar/types';

interface WeekendSectionProps {
  userCalendarStyles: Record<string, unknown>;
  theme: Record<string, unknown>;
  setCalendarStyle: (key: keyof CalendarStyles, value: string | number | undefined) => void;
  ids: Record<string, string>;
  effective: Record<string, unknown>;
}

const WeekendSection: React.FC<WeekendSectionProps> = ({ userCalendarStyles, theme, setCalendarStyle, ids, effective }) => (
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
);

export default WeekendSection;
