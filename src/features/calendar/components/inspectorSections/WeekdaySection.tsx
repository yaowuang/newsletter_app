import React from 'react';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';
import { FontSelect } from '@/features/newsletter/components/FontSelect';
import ColorInputWithReset from '@/components/ui/ColorInputWithReset';
import type { CalendarStyles } from '@/features/calendar/types';

interface WeekdaySectionProps {
  userCalendarStyles: Record<string, unknown>;
  derived: Record<string, unknown>;
  theme: Record<string, unknown>;
  setCalendarStyle: (key: keyof CalendarStyles, value: string | number | undefined) => void;
  ids: Record<string, string>;
  effective: Record<string, unknown>;
}

const WeekdaySection: React.FC<WeekdaySectionProps> = ({ userCalendarStyles, derived, theme, setCalendarStyle, ids, effective }) => (
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
);

export default WeekdaySection;
