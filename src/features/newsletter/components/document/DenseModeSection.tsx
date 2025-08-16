import React from "react";
import FormGroup from "@/components/ui/FormGroup";
import InspectorSection from "@/components/ui/InspectorSection";
import Switch from "@/components/ui/switch";

interface DenseModeSectionProps {
  denseMode: boolean;
  onDenseModeChange: (denseMode: boolean) => void;
}

export const DenseModeSection: React.FC<DenseModeSectionProps> = ({ denseMode, onDenseModeChange }) => {
  const switchId = React.useId();

  return (
    <InspectorSection title="Layout Options">
      <FormGroup label="Dense Mode" id={switchId} inline className="items-start">
        <div className="space-y-1">
          <Switch id={switchId} checked={denseMode} onChange={(e) => onDenseModeChange(e.target.checked)} />
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Reduces line spacing and section gaps to fit more content. Useful for monthly newsletters.
          </p>
        </div>
      </FormGroup>
    </InspectorSection>
  );
};

export default DenseModeSection;
