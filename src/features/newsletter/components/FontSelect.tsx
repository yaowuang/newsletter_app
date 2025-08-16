import type React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Central font list (union of all previously declared, sorted)
export const FONT_OPTIONS = [
  "Alegreya SC",
  "Bangers",
  "Cinzel",
  "Cinzel Decorative",
  "Comfortaa",
  "Comic Neue",
  "Creepster",
  "Fredoka",
  "Inter",
  "Irish Grover",
  "Kalam",
  "Lato",
  "Lora",
  "Merriweather",
  "Montserrat",
  "Mountains of Christmas",
  "Nunito",
  "Orbitron",
  "Oswald",
  "Pacifico",
  "Playfair Display",
  "Poppins",
  "Raleway",
  "Roboto",
  "Roboto Condensed",
  "Righteous",
  "Rye",
  "Schoolbell",
  "Share Tech Mono",
  "Source Sans 3",
  "Special Elite",
  "Ultra",
];

// Mapping for fonts that are provided via CSS variables
export const FONT_LABEL_TO_VALUE: Record<string, string> = {
  "Share Tech Mono": "var(--font-share-tech-mono)",
  "Mountains of Christmas": "var(--font-mountains-of-christmas)",
  "Source Sans 3": "var(--font-source-sans3)",
  Schoolbell: "var(--font-schoolbell)",
  Righteous: "var(--font-righteous)",
  Comfortaa: "var(--font-comfortaa)",
  Kalam: "var(--font-kalam)",
  // Non-variable fonts below remain as labels but included for completeness if later variable-ized
  // Add variables if design switches to CSS variable usage
};
export const FONT_VALUE_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(FONT_LABEL_TO_VALUE).map(([k, v]) => [v, k]),
);

export const toLabel = (val?: string): string => {
  if (!val) return FONT_OPTIONS[0];
  return FONT_VALUE_TO_LABEL[val] || val;
};
export const fromLabel = (label: string): string => FONT_LABEL_TO_VALUE[label] || label;

interface FontSelectProps {
  id?: string;
  value?: string; // internal value (css var or raw family)
  onChange?: (newValue: string) => void;
  placeholder?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

export const FontSelect: React.FC<FontSelectProps> = ({
  id,
  value,
  onChange,
  placeholder = "Select a font",
  triggerClassName,
  disabled,
}) => {
  const labelValue = toLabel(value);
  return (
    <Select
      value={labelValue}
      onValueChange={(lbl) => {
        if (!disabled) onChange?.(fromLabel(lbl));
      }}
    >
      <SelectTrigger id={id} className={triggerClassName} aria-disabled={disabled} disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {FONT_OPTIONS.map((font) => {
          const cssVal = FONT_LABEL_TO_VALUE[font] || font;
          return (
            <SelectItem key={font} value={font} style={{ fontFamily: cssVal }}>
              {font}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default FontSelect;
