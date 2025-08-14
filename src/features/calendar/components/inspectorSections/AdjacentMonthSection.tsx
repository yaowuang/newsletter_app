import React from 'react';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';
import ColorInputWithReset from '@/components/ui/ColorInputWithReset';
import { Input } from '@/components/ui/input';
import type { CalendarStyles } from '@/features/calendar/types';

interface AdjacentMonthSectionProps {
  userCalendarStyles: any;
  setCalendarStyle: (key: keyof CalendarStyles, value: string | number | undefined) => void;
  ids: Record<string, string>;
  effective: any;
}

const AdjacentMonthSection: React.FC<AdjacentMonthSectionProps> = ({ userCalendarStyles, setCalendarStyle, ids, effective }) => (
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
);

export default AdjacentMonthSection;
