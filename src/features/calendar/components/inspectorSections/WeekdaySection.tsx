import type React from "react";
import ColorInputWithReset from "@/components/ui/ColorInputWithReset";
import FormGroup from "@/components/ui/FormGroup";
import InspectorSection from "@/components/ui/InspectorSection";
import type { CalendarStylesType } from "@/features/calendar/types";
import { FontSelect } from "@/features/newsletter/components/FontSelect";
import type { ThemeType } from "@/lib/themes";

interface WeekdaySectionProps {
  userCalendarStyles: CalendarStylesType;
  derived: Partial<CalendarStylesType>;
  theme: ThemeType;
  setCalendarStyle: (key: keyof CalendarStylesType, value: string | number | undefined) => void;
  ids: Record<string, string>;
  effective: Partial<CalendarStylesType>;
}

const WeekdaySection: React.FC<WeekdaySectionProps> = ({
  userCalendarStyles,
  derived,
  theme,
  setCalendarStyle,
  ids,
  effective,
}) => (
  <InspectorSection title="Weekday Header Styles">
    <div className="grid grid-cols-2 gap-3">
      <FormGroup label="Font" id={ids.weekdayFont} inline className="min-w-0 col-span-2">
        <FontSelect
          id={ids.weekdayFont}
          value={
            userCalendarStyles.weekdayFontFamily ||
            derived.weekdayFontFamily ||
            theme.styles.section.contentFontFamily ||
            theme.styles.title.fontFamily
          }
          onChange={(val) => setCalendarStyle("weekdayFontFamily", val)}
        />
      </FormGroup>
      <FormGroup label="Text" id={ids.weekdayColor} inline className="min-w-0">
        <ColorInputWithReset
          id={ids.weekdayColor}
          value={userCalendarStyles.weekdayColor || effective.weekdayColor || "#1f2937"}
          onChange={(v) => setCalendarStyle("weekdayColor", v)}
          onReset={() => setCalendarStyle("weekdayColor", undefined)}
        />
      </FormGroup>
      <FormGroup label="Background" id={ids.weekdayBg} inline className="min-w-0 col-span-2">
        <ColorInputWithReset
          id={ids.weekdayBg}
          value={userCalendarStyles.weekdayBackgroundColor || effective.weekdayBackgroundColor || "#f9fafb"}
          onChange={(v) => setCalendarStyle("weekdayBackgroundColor", v)}
          onReset={() => setCalendarStyle("weekdayBackgroundColor", undefined)}
        />
      </FormGroup>
    </div>
  </InspectorSection>
);

export default WeekdaySection;
