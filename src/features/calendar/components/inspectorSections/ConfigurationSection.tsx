import type React from "react";
import FormGroup from "@/components/ui/FormGroup";
import InspectorSection from "@/components/ui/InspectorSection";
import { Input } from "@/components/ui/input";
import { formatCalendarTitle } from "@/features/calendar/utils/calendar";

interface ConfigurationSectionProps {
  selectedDate: Date;
  setCalendarDate: (date: Date) => void;
  ids: Record<string, string>;
}

const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({ selectedDate, setCalendarDate, ids }) => {
  const formatDateForInput = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  };
  return (
    <InspectorSection title="Configuration">
      <FormGroup label="Selected Month" id={ids.monthInput}>
        <Input
          id={ids.monthInput}
          type="month"
          value={formatDateForInput(selectedDate)}
          onChange={(e) => {
            const [year, month] = e.target.value.split("-");
            const newDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            setCalendarDate(newDate);
          }}
        />
        <p className="text-xs text-gray-500 mt-1">Viewing {formatCalendarTitle(selectedDate, "full", "full")}</p>
      </FormGroup>
    </InspectorSection>
  );
};

export default ConfigurationSection;
