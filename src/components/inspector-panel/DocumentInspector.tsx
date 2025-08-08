import React from "react";
import { Theme } from "@/lib/themes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";

// Complete set of fonts used across themes (plus a few common UI fonts)
const fonts = [
  "Inter",
  "Roboto",
  "Montserrat",
  "Poppins",
  "Nunito",
  "Lato",
  "Raleway",
  "Oswald",
  "Merriweather",
  "Playfair Display",
  "Alegreya SC",
  "Lora",
  "Pacifico",
  "Ultra",
  "Roboto Condensed",
  "Fredoka",
  "Comic Neue",
  "Mountains of Christmas",
  "Creepster",
  "Share Tech Mono",
  "Bangers",
  "Orbitron",
  "Rye",
  "Special Elite",
  "Cinzel",
  "Cinzel Decorative",
  "Source Sans 3",
  "Irish Grover"
];

// Mapping between human-readable labels and CSS variable values
const LABEL_TO_VAR: Record<string,string> = {
  "Share Tech Mono": "var(--font-share-tech-mono)",
  "Mountains of Christmas": "var(--font-mountains-of-christmas)",
  "Source Sans 3": "var(--font-source-sans3)"
};

const VAR_TO_LABEL: Record<string,string> = Object.fromEntries(
  Object.entries(LABEL_TO_VAR).map(([k,v]) => [v,k])
);

const toSelectValue = (ff: string | undefined) => {
  if (!ff) return fonts[0];
  if (VAR_TO_LABEL[ff]) return VAR_TO_LABEL[ff];
  return ff;
};
const fromSelectValue = (label: string) => {
  return LABEL_TO_VAR[label] || label;
};

interface DocumentInspectorProps { title: string; date: string; theme: Theme; onTitleChange: (title: string) => void; onDateChange: (date: string) => void; }

export const DocumentInspector: React.FC<DocumentInspectorProps> = ({ title, date, theme, onTitleChange, onDateChange }) => {
  const setThemeTitleFont = useStore(s => s.setThemeTitleFont);
  const setThemeDateFont = useStore(s => s.setThemeDateFont);
  const setThemeTitleColor = useStore(s => s.setThemeTitleColor);
  const setThemeDateColor = useStore(s => s.setThemeDateColor);
  return (
    <div className="space-y-6">
      {/* Title & Date Content */}
      <div className="rounded-xl bg-white dark:bg-gray-900 shadow p-4 space-y-4 border border-gray-100 dark:border-gray-800">
        <div className="space-y-2">
          <Label className="text-base font-medium">Newsletter Title</Label>
          <Input type="text" value={title} onChange={e => onTitleChange(e.target.value)} className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="space-y-2">
          <Label className="text-base font-medium">Date</Label>
          <Input type="text" value={date} onChange={e => onDateChange(e.target.value)} className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Title Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Title Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Title Color</Label>
            <Input type="color" value={theme.styles.title.color} onChange={e => setThemeTitleColor?.(e.target.value)} className="w-10 h-10 p-0 border-none" />
          </div>
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Title Font</Label>
            <Select value={toSelectValue(theme.styles.title.fontFamily)} onValueChange={value => setThemeTitleFont?.(fromSelectValue(value))}>
              <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
              <SelectContent>
                {fonts.map(font => {
                  const cssVal = LABEL_TO_VAR[font] || font; 
                  return (
                    <SelectItem key={font} value={font} style={{ fontFamily: cssVal }}>{font}</SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Date Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Date Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Date Color</Label>
            <Input type="color" value={theme.styles.date.color} onChange={e => setThemeDateColor?.(e.target.value)} className="w-10 h-10 p-0 border-none" />
          </div>
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Date Font</Label>
            <Select value={toSelectValue(theme.styles.date.fontFamily)} onValueChange={value => setThemeDateFont?.(fromSelectValue(value))}>
              <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
              <SelectContent>
                {fonts.map(font => {
                  const cssVal = LABEL_TO_VAR[font] || font; 
                  return (
                    <SelectItem key={font} value={font} style={{ fontFamily: cssVal }}>{font}</SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
