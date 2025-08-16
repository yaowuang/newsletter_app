import type React from "react";
import { useId } from "react";
import ColorInputWithReset from "@/components/ui/ColorInputWithReset";
import FormGroup from "@/components/ui/FormGroup";
import InspectorSection from "@/components/ui/InspectorSection";
import { TextEffectPicker } from "@/components/ui/TextEffectPicker";
import type { CalendarStylesType } from "@/features/calendar/types";
import { FontSelect } from "@/features/newsletter/components/FontSelect";
import type { ThemeType } from "@/lib/themes";

interface HeaderSectionProps {
  userCalendarStyles: CalendarStylesType;
  derived: Partial<CalendarStylesType>;
  theme: ThemeType;
  setCalendarStyle: (key: keyof CalendarStylesType, value: string | number | undefined) => void;
  setThemeTitleTextEffect?: (id: string | undefined) => void;
  ids: Record<string, string>;
  effective: Partial<CalendarStylesType>;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  userCalendarStyles,
  derived,
  theme,
  setCalendarStyle,
  setThemeTitleTextEffect,
  ids,
  effective,
}) => (
  <InspectorSection title="Header Styles (Month / Year)">
    <FormGroup label="Text Effect" id={useId()} inline>
      <TextEffectPicker
        value={theme.styles.title.textEffectId}
        onChange={(effectId: string | undefined) => {
          if (typeof effectId === "string") setThemeTitleTextEffect?.(effectId);
        }}
        className="flex-1"
      />
    </FormGroup>
    <FormGroup label="Font" id={ids.headerFont} inline>
      <FontSelect
        id={ids.headerFont}
        value={userCalendarStyles.headerFontFamily || derived.headerFontFamily || theme.styles.title.fontFamily}
        onChange={(val) => setCalendarStyle("headerFontFamily", val)}
      />
    </FormGroup>
    <FormGroup label="Color" id={ids.headerColor} inline>
      <ColorInputWithReset
        id={ids.headerColor}
        value={userCalendarStyles.headerColor || effective.headerColor || "#1f2937"}
        onChange={(v) => setCalendarStyle("headerColor", v)}
        onReset={() => setCalendarStyle("headerColor", undefined)}
      />
    </FormGroup>
  </InspectorSection>
);

export default HeaderSection;
