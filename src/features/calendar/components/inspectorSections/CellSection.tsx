import type React from "react";
import ColorInputWithReset from "@/components/ui/ColorInputWithReset";
import FormGroup from "@/components/ui/FormGroup";
import InspectorSection from "@/components/ui/InspectorSection";
import type { CalendarStylesType } from "@/features/calendar/types";
import { FontSelect } from "@/features/newsletter/components/FontSelect";
import type { ThemeType } from "@/lib/themes";

interface CellSectionProps {
  userCalendarStyles: CalendarStylesType;
  derived: Partial<CalendarStylesType>;
  theme: ThemeType;
  setCalendarStyle: (key: keyof CalendarStylesType, value: string | number | undefined) => void;
  ids: Record<string, string>;
  effective: Partial<CalendarStylesType>;
}

const CellSection: React.FC<CellSectionProps> = ({
  userCalendarStyles,
  derived,
  theme,
  setCalendarStyle,
  ids,
  effective,
}) => (
  <InspectorSection title="Cell Styles">
    <div className="grid grid-cols-2 gap-3">
      <FormGroup label="Font" id={ids.cellFont} inline className="min-w-0 col-span-2">
        <FontSelect
          id={ids.cellFont}
          value={userCalendarStyles.cellFontFamily || derived.cellFontFamily || theme.styles.section.contentFontFamily}
          onChange={(val) => setCalendarStyle("cellFontFamily", val)}
        />
      </FormGroup>
      <FormGroup label="Text" id={ids.cellText} inline className="min-w-0">
        <ColorInputWithReset
          id={ids.cellText}
          value={userCalendarStyles.cellTextColor || effective.cellTextColor || "#1f2937"}
          onChange={(v) => setCalendarStyle("cellTextColor", v)}
          onReset={() => setCalendarStyle("cellTextColor", undefined)}
        />
      </FormGroup>
      <FormGroup label="Background" id={ids.cellBg} inline className="min-w-0">
        <ColorInputWithReset
          id={ids.cellBg}
          value={userCalendarStyles.cellBackgroundColor || effective.cellBackgroundColor || "#ffffff"}
          onChange={(v) => setCalendarStyle("cellBackgroundColor", v)}
          onReset={() => setCalendarStyle("cellBackgroundColor", undefined)}
        />
      </FormGroup>
      <FormGroup label="Border" id={ids.cellBorder} inline className="min-w-0 col-span-2">
        <ColorInputWithReset
          id={ids.cellBorder}
          value={userCalendarStyles.cellBorderColor || effective.cellBorderColor || "#e5e7eb"}
          onChange={(v) => setCalendarStyle("cellBorderColor", v)}
          onReset={() => setCalendarStyle("cellBorderColor", undefined)}
        />
      </FormGroup>
    </div>
  </InspectorSection>
);

export default CellSection;
