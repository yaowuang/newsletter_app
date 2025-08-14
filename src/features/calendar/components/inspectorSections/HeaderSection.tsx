import React from 'react';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';
import { FontSelect } from '@/features/newsletter/components/FontSelect';
import { TextEffectPicker } from '@/components/ui/TextEffectPicker';
import ColorInputWithReset from '@/components/ui/ColorInputWithReset';
import type { CalendarStyles } from '@/features/calendar/types';

interface HeaderSectionProps {
  userCalendarStyles: any;
  derived: any;
  theme: any;
  setCalendarStyle: (key: keyof CalendarStyles, value: string | number | undefined) => void;
  setThemeTitleTextEffect?: (id: string | undefined) => void;
  ids: Record<string, string>;
  effective: any;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ userCalendarStyles, derived, theme, setCalendarStyle, setThemeTitleTextEffect, ids, effective }) => (
  <InspectorSection title="Header Styles (Month / Year)">
    <FormGroup label="Text Effect" id="calendar-header-effect" inline>
      <TextEffectPicker
        value={theme.styles.title.textEffectId}
        onChange={(effectId: string | undefined) => {
          if (typeof effectId === 'string') setThemeTitleTextEffect?.(effectId);
        }}
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
);

export default HeaderSection;
