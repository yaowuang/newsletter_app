import React from "react";
import { Theme } from "@/lib/themes";
import { useStore } from "@/lib/store";
import TitleDateSection, { DateMode } from './document/TitleDateSection';
import TitleStylesSection from './document/TitleStylesSection';
import DateStylesSection from './document/DateStylesSection';
import PageBackgroundSection from './document/PageBackgroundSection';
import DenseModeSection from './document/DenseModeSection';

interface DocumentInspectorProps { title: string; date: string; theme: Theme; onTitleChange: (title: string) => void; onDateChange: (date: string) => void; }

export const DocumentInspector: React.FC<DocumentInspectorProps> = ({ title, date, theme, onTitleChange, onDateChange }) => {
  // store getters
  const denseMode = useStore(s => s.denseMode);
  
  // store setters
  const setDenseMode = useStore(s => s.setDenseMode);
  const setThemeTitleFont = useStore(s => s.setThemeTitleFont);
  const setThemeDateFont = useStore(s => s.setThemeDateFont);
  const setThemeTitleColor = useStore(s => s.setThemeTitleColor);
  const setThemeDateColor = useStore(s => s.setThemeDateColor);
  const setThemeTitleAlignment = useStore(s => s.setThemeTitleAlignment);
  const setThemeDateAlignment = useStore(s => s.setThemeDateAlignment);
  const setThemePageBackgroundColor = useStore(s => s.setThemePageBackgroundColor);
  const setThemePageBackgroundImage = useStore(s => s.setThemePageBackgroundImage);
  const setThemePageBackgroundSize = useStore(s => s.setThemePageBackgroundSize);
  const setThemePageBackgroundPosition = useStore(s => s.setThemePageBackgroundPosition);
  const setThemePageBackgroundRepeat = useStore(s => s.setThemePageBackgroundRepeat);
  const setThemePageBackgroundImageOpacity = useStore(s => s.setThemePageBackgroundImageOpacity);

  // Date helpers
  const toDateInputValue = React.useCallback((val: string): string => {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const rangeMatch = val.match(/(\d{4}-\d{2}-\d{2}).+(\d{4}-\d{2}-\d{2})/);
    if (rangeMatch) return rangeMatch[1];
    const parsed = new Date(val);
    if (isNaN(parsed.getTime())) return '';
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);
  const inferModeFromDate = (d: string): DateMode => {
    if (/^\d{4}-\d{2}$/.test(d)) return 'month';
    if (/\d{4}-\d{2}-\d{2}.*(to|–).*/.test(d)) return 'week';
    return 'single';
  };

  // Track if user explicitly chose a mode (so we don't auto override)
  const [userModeLocked, setUserModeLocked] = React.useState(false);
  const [dateMode, setDateMode] = React.useState<DateMode>(() => inferModeFromDate(date));

  // Auto-adjust mode only if user hasn't explicitly chosen one yet
  React.useEffect(() => {
    if (userModeLocked) return;
    setDateMode(inferModeFromDate(date));
  }, [date, userModeLocked]);

  const formatISO = React.useCallback((d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  }, []);
  const computeBusinessWeekRange = React.useCallback((iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    const base = new Date(y, m - 1, d);
    if (isNaN(base.getTime())) return iso;
    const day = base.getDay();
    const offsetToMonday = (day + 6) % 7;
    const monday = new Date(base);
    monday.setDate(base.getDate() - offsetToMonday);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    return `${formatISO(monday)} to ${formatISO(friday)}`;
  }, [formatISO]);

  // If in week mode but date is a plain single date, convert to a business week range
  React.useEffect(() => {
    if (dateMode === 'week' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      onDateChange(computeBusinessWeekRange(date));
    }
  }, [dateMode, date, computeBusinessWeekRange, onDateChange]);

  const handleDateModeChange = (m: DateMode) => {
    setUserModeLocked(true); // user explicitly set mode
    setDateMode(m);
  };

  return (
    <div className="space-y-6">
      <TitleDateSection
        title={title}
        date={date}
        dateMode={dateMode}
        onTitleChange={onTitleChange}
        onDateChange={onDateChange}
        onDateModeChange={handleDateModeChange}
        computeBusinessWeekRange={computeBusinessWeekRange}
        toDateInputValue={toDateInputValue}
        formatISO={formatISO}
      />
      <DenseModeSection
        denseMode={denseMode}
        onDenseModeChange={setDenseMode}
      />
      <TitleStylesSection
        // fonts now sourced internally via FontSelect
        titleColorId={React.useId()}
        titleFontId={React.useId()}
        titleAlignId={React.useId()}
        value={theme.styles.title}
        setColor={setThemeTitleColor}
        setFont={setThemeTitleFont}
        setAlign={setThemeTitleAlignment}
      />
      <DateStylesSection
        dateColorId={React.useId()}
        dateFontId={React.useId()}
        dateAlignId={React.useId()}
        value={theme.styles.date}
        setColor={setThemeDateColor}
        setFont={setThemeDateFont}
        setAlign={setThemeDateAlignment}
      />
      <PageBackgroundSection
        ids={{
          color: React.useId(),
          size: React.useId(),
          position: React.useId(),
          repeat: React.useId()
        }}
        themeStyles={theme.styles.page}
        setBgColor={setThemePageBackgroundColor}
        setBgImage={setThemePageBackgroundImage}
        setBgSize={setThemePageBackgroundSize}
        setBgPosition={setThemePageBackgroundPosition}
        setBgRepeat={setThemePageBackgroundRepeat}
        setBgOpacity={setThemePageBackgroundImageOpacity}
      />
    </div>
  );
};
