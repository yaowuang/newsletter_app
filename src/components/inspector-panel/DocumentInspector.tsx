import React from "react";
import { Theme } from "@/lib/themes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import ImageSourceDialog from '@/components/common/ImageSourceDialog';

// Complete set of fonts used across themes (plus a few common UI fonts) - alphabetized
const fonts = [
  "Alegreya SC",
  "Bangers",
  "Cinzel",
  "Cinzel Decorative",
  "Comic Neue",
  "Creepster",
  "Fredoka",
  "Inter",
  "Irish Grover",
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
  "Rye",
  "Share Tech Mono",
  "Source Sans 3",
  "Special Elite",
  "Ultra"
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
  const setThemeTitleAlignment = useStore(s => s.setThemeTitleAlignment);
  const setThemeDateAlignment = useStore(s => s.setThemeDateAlignment);
  const setThemePageBackgroundColor = useStore(s => s.setThemePageBackgroundColor);
  const setThemePageBackgroundImage = useStore(s => s.setThemePageBackgroundImage);
  const setThemePageBackgroundSize = useStore(s => s.setThemePageBackgroundSize);
  const setThemePageBackgroundPosition = useStore(s => s.setThemePageBackgroundPosition);
  const setThemePageBackgroundRepeat = useStore(s => s.setThemePageBackgroundRepeat);
  const setThemePageBackgroundImageOpacity = useStore(s => s.setThemePageBackgroundImageOpacity);
  // ids for form fields
  const titleInputId = React.useId();
  const dateInputId = React.useId();
  // ids for style controls (a11y associations)
  const titleColorId = React.useId();
  const titleFontId = React.useId();
  const titleAlignId = React.useId();
  const dateColorId = React.useId();
  const dateFontId = React.useId();
  const dateAlignId = React.useId();
  const pageBgColorId = React.useId();
  // removed pageBgImageId since manual text input removed
  const pageBgSizeId = React.useId();
  const pageBgPositionId = React.useId();
  const pageBgRepeatId = React.useId();
  // Helper arrays
  const sizeOptions = ['cover', 'contain'];
  const positionOptions = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'];
  const repeatOptions = ['no-repeat', 'repeat', 'repeat-x', 'repeat-y', 'space', 'round'];
  const DEFAULT_SENTINEL = 'DEFAULT';
  const currentSize = String(theme.styles.page.backgroundSize || '');
  const currentPosition = String(theme.styles.page.backgroundPosition || '');
  const currentRepeat = String(theme.styles.page.backgroundRepeat || '');
  // track explicit custom editing state so empty string doesn't collapse to default
  const [editingCustomSize, setEditingCustomSize] = React.useState(false);
  const [editingCustomPosition, setEditingCustomPosition] = React.useState(false);
  const [editingCustomRepeat, setEditingCustomRepeat] = React.useState(false);
  const isCustomSize = (!!currentSize || editingCustomSize) && !sizeOptions.includes(currentSize) && currentSize !== DEFAULT_SENTINEL;
  const isCustomPosition = (!!currentPosition || editingCustomPosition) && !positionOptions.includes(currentPosition) && currentPosition !== DEFAULT_SENTINEL;
  const isCustomRepeat = (!!currentRepeat || editingCustomRepeat) && !repeatOptions.includes(currentRepeat) && currentRepeat !== DEFAULT_SENTINEL;

  // reset editing flags when theme value changes externally
  React.useEffect(() => {
    if (!currentSize || sizeOptions.includes(currentSize)) setEditingCustomSize(false);
  }, [currentSize]);
  React.useEffect(() => {
    if (!currentPosition || positionOptions.includes(currentPosition)) setEditingCustomPosition(false);
  }, [currentPosition]);
  React.useEffect(() => {
    if (!currentRepeat || repeatOptions.includes(currentRepeat)) setEditingCustomRepeat(false);
  }, [currentRepeat]);

  // Helper: attempt to convert arbitrary date string to yyyy-MM-dd for date input
  const toDateInputValue = React.useCallback((val: string): string => {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    // if range "start to end" return start
    const rangeMatch = val.match(/(\d{4}-\d{2}-\d{2}).+(\d{4}-\d{2}-\d{2})/);
    if (rangeMatch) return rangeMatch[1];
    const parsed = new Date(val);
    if (isNaN(parsed.getTime())) return '';
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  // Date mode: single day, business week (Mon-Fri), or month only
  const inferModeFromDate = (d: string): 'single' | 'week' | 'month' => {
    if (/^\d{4}-\d{2}$/.test(d)) return 'month';
    if (/\d{4}-\d{2}-\d{2}.*(to|–).*/.test(d)) return 'week';
    return 'single';
  };
  const initialInferred = inferModeFromDate(date);
  const [dateMode, setDateMode] = React.useState<'single' | 'week' | 'month'>(initialInferred === 'single' ? 'week' : initialInferred);

  // When external date prop changes (e.g., undo), re-infer (respect explicit month/week; keep default preference for week over single)
  React.useEffect(() => {
    const inf = inferModeFromDate(date);
    setDateMode(prev => {
      if (inf === 'single' && (prev === 'week' || prev === 'month')) return prev; // keep user-selected mode
      if (inf === 'single') return 'week'; // default preference
      return inf;
    });
  }, [date]);

  // Auto-convert single ISO date to week range when in week mode
  React.useEffect(() => {
    if (dateMode === 'week' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      onDateChange(computeBusinessWeekRange(date));
    }
  }, [dateMode, date]);

  const formatISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  };
  const computeBusinessWeekRange = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    const base = new Date(y, m - 1, d);
    if (isNaN(base.getTime())) return iso;
    const day = base.getDay(); // 0 Sun .. 6 Sat
    const offsetToMonday = (day + 6) % 7; // Sunday->6, Monday->0
    const monday = new Date(base);
    monday.setDate(base.getDate() - offsetToMonday);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    return `${formatISO(monday)} to ${formatISO(friday)}`;
  };

  const handleDateChange = (newIso: string) => {
    if (dateMode === 'single') {
      onDateChange(newIso);
    } else if (dateMode === 'week') {
      onDateChange(computeBusinessWeekRange(newIso));
    } else { // month
      // newIso here expected YYYY-MM
      onDateChange(newIso);
    }
  };

  const dateInputValue = toDateInputValue(date);
  return (
    <div className="space-y-6">
      {/* Title & Date Content */}
      <div className="rounded-xl bg-white dark:bg-gray-900 shadow p-4 space-y-4 border border-gray-100 dark:border-gray-800">
        <div className="space-y-2">
          <Label className="text-base font-medium" htmlFor={titleInputId}>Newsletter Title</Label>
          <Input id={titleInputId} name="newsletterTitle" type="text" value={title} onChange={e => onTitleChange(e.target.value)} className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium" htmlFor={dateInputId}>Date</Label>
            <Select value={dateMode} onValueChange={(v: 'single' | 'week' | 'month') => {
              // derive a base YYYY-MM or YYYY-MM-DD from current values
              const currentDayISO = toDateInputValue(date) || formatISO(new Date());
              const currentMonth = currentDayISO.slice(0,7); // YYYY-MM
              if (v === 'month') {
                // switch to month mode storing YYYY-MM
                onDateChange(currentMonth);
              } else if (dateMode === 'month' && v === 'single') {
                // expand month to first day
                onDateChange(`${currentMonth}-01`);
              } else if (dateMode === 'month' && v === 'week') {
                // use first day of month to compute week
                onDateChange(computeBusinessWeekRange(`${currentMonth}-01`));
              } else if (v === 'week' && dateMode === 'single') {
                // convert existing single day to week range
                onDateChange(computeBusinessWeekRange(currentDayISO));
              } else if (v === 'single' && dateMode === 'week') {
                // collapse week to first date
                onDateChange(currentDayISO);
              }
              setDateMode(v);
            }}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Date</SelectItem>
                <SelectItem value="week">Business Week</SelectItem>
                <SelectItem value="month">Month Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {dateMode !== 'month' && (
            <Input id={dateInputId} name="newsletterDate" type="date" value={dateMode === 'week' ? (dateInputValue || '') : (dateInputValue)} onChange={e => handleDateChange(e.target.value)} className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500" />
          )}
          {dateMode === 'month' && (
            <Input id={dateInputId} name="newsletterMonth" type="month" value={/^\d{4}-\d{2}$/.test(date) ? date : (dateInputValue ? dateInputValue.slice(0,7) : '')} onChange={e => handleDateChange(e.target.value)} className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500" />
          )}
          {dateMode === 'week' && dateInputValue && (
            <p className="text-xs text-gray-500 dark:text-gray-400">Week: {computeBusinessWeekRange(dateInputValue)}</p>
          )}
        </div>
      </div>
      {/* Title Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Title Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label htmlFor={titleColorId} className="min-w-[120px]">Title Color</Label>
            <Input id={titleColorId} type="color" value={theme.styles.title.color} onChange={e => setThemeTitleColor?.(e.target.value)} className="w-10 h-10 p-0 border-none" />
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={titleFontId} className="min-w-[120px]">Title Font</Label>
            <Select value={toSelectValue(theme.styles.title.fontFamily)} onValueChange={value => setThemeTitleFont?.(fromSelectValue(value))}>
              <SelectTrigger id={titleFontId}><SelectValue placeholder="Select a font" /></SelectTrigger>
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
          <div className="flex items-center gap-3">
            <Label htmlFor={titleAlignId} className="min-w-[120px]">Title Align</Label>
            <Select value={theme.styles.title.textAlign || 'center'} onValueChange={v => setThemeTitleAlignment?.(v as 'left' | 'center' | 'right')}>
              <SelectTrigger id={titleAlignId}><SelectValue placeholder="Alignment" /></SelectTrigger>
              <SelectContent>
                {['left','center','right'].map(a => <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase()+a.slice(1)}</SelectItem>)}
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
            <Label htmlFor={dateColorId} className="min-w-[120px]">Date Color</Label>
            <Input id={dateColorId} type="color" value={theme.styles.date.color} onChange={e => setThemeDateColor?.(e.target.value)} className="w-10 h-10 p-0 border-none" />
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={dateFontId} className="min-w-[120px]">Date Font</Label>
            <Select value={toSelectValue(theme.styles.date.fontFamily)} onValueChange={value => setThemeDateFont?.(fromSelectValue(value))}>
              <SelectTrigger id={dateFontId}><SelectValue placeholder="Select a font" /></SelectTrigger>
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
          <div className="flex items-center gap-3">
            <Label htmlFor={dateAlignId} className="min-w-[120px]">Date Align</Label>
            <Select value={theme.styles.date.textAlign || 'center'} onValueChange={v => setThemeDateAlignment?.(v as 'left' | 'center' | 'right')}>
              <SelectTrigger id={dateAlignId}><SelectValue placeholder="Alignment" /></SelectTrigger>
              <SelectContent>
                {['left','center','right'].map(a => <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase()+a.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Page Background Styles (moved to bottom) */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-4 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold">Page Background</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label htmlFor={pageBgColorId} className="min-w-[120px]">Color</Label>
            <Input id={pageBgColorId} type="color" value={theme.styles.page.backgroundColor} onChange={e => setThemePageBackgroundColor?.(e.target.value)} className="w-10 h-10 p-0 border-none" />
          </div>
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Image</Label>
            <ImageSourceDialog buttonText={theme.styles.page.backgroundImage ? 'Change' : 'Select'} title='Background Image' onSelect={(src) => setThemePageBackgroundImage?.(src.startsWith('http') || src.startsWith('data:') ? `url(${src})` : src.startsWith('url(') ? src : `url(${src})`)} />
            {theme.styles.page.backgroundImage && (
              <button type="button" onClick={() => setThemePageBackgroundImage?.(null)} className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">Clear</button>
            )}
          </div>
          {theme.styles.page.backgroundImage && (
            <div className="flex items-center gap-3">
              <Label className="min-w-[120px]">Opacity</Label>
              <input type="range" min={0} max={1} step={0.05} value={theme.styles.page.backgroundImageOpacity ?? 1} onChange={e => setThemePageBackgroundImageOpacity?.(parseFloat(e.target.value))} className="flex-1" />
              <span className="text-xs w-10 text-right">{Math.round((theme.styles.page.backgroundImageOpacity ?? 1)*100)}%</span>
            </div>
          )}
          {/* Always show advanced controls (optional) */}
          <div className="flex items-center gap-3">
            <Label htmlFor={pageBgSizeId} className="min-w-[120px]">Size</Label>
            <Select value={(editingCustomSize || isCustomSize) ? 'CUSTOM' : (currentSize ? currentSize : DEFAULT_SENTINEL)} onValueChange={v => {
              if (v === 'CUSTOM') {
                setEditingCustomSize(true);
                if (!isCustomSize) setThemePageBackgroundSize?.(currentSize || '');
              } else if (v === DEFAULT_SENTINEL) {
                setEditingCustomSize(false);
                setThemePageBackgroundSize?.(null);
              } else {
                setEditingCustomSize(false);
                setThemePageBackgroundSize?.(v || null);
              }
            }}>
              <SelectTrigger id={pageBgSizeId}><SelectValue placeholder="auto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={DEFAULT_SENTINEL}>auto</SelectItem>
                {sizeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(editingCustomSize || isCustomSize) && (
            <Input type="text" value={currentSize} placeholder="e.g. 160px 160px / cover" onChange={e => setThemePageBackgroundSize?.(e.target.value)} />
          )}
          <div className="flex items-center gap-3">
            <Label htmlFor={pageBgPositionId} className="min-w-[120px]">Position</Label>
            <Select value={(editingCustomPosition || isCustomPosition) ? 'CUSTOM' : (currentPosition ? currentPosition : DEFAULT_SENTINEL)} onValueChange={v => {
              if (v === 'CUSTOM') {
                setEditingCustomPosition(true);
                if (!isCustomPosition) setThemePageBackgroundPosition?.(currentPosition || '');
              } else if (v === DEFAULT_SENTINEL) {
                setEditingCustomPosition(false);
                setThemePageBackgroundPosition?.(null);
              } else {
                setEditingCustomPosition(false);
                setThemePageBackgroundPosition?.(v || null);
              }
            }}>
              <SelectTrigger id={pageBgPositionId}><SelectValue placeholder="initial" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={DEFAULT_SENTINEL}>initial</SelectItem>
                {positionOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(editingCustomPosition || isCustomPosition) && (
            <Input type="text" value={currentPosition} placeholder="e.g. 0 0, 80px 80px" onChange={e => setThemePageBackgroundPosition?.(e.target.value)} />
          )}
          <div className="flex items-center gap-3">
            <Label htmlFor={pageBgRepeatId} className="min-w-[120px]">Repeat</Label>
            <Select value={(editingCustomRepeat || isCustomRepeat) ? 'CUSTOM' : (currentRepeat ? currentRepeat : DEFAULT_SENTINEL)} onValueChange={v => {
              if (v === 'CUSTOM') {
                setEditingCustomRepeat(true);
                if (!isCustomRepeat) setThemePageBackgroundRepeat?.(currentRepeat || '');
              } else if (v === DEFAULT_SENTINEL) {
                setEditingCustomRepeat(false);
                setThemePageBackgroundRepeat?.(null);
              } else {
                setEditingCustomRepeat(false);
                setThemePageBackgroundRepeat?.(v || null);
              }
            }}>
              <SelectTrigger id={pageBgRepeatId}><SelectValue placeholder="default" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={DEFAULT_SENTINEL}>default</SelectItem>
                {repeatOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(editingCustomRepeat || isCustomRepeat) && (
            <Input type="text" value={currentRepeat} placeholder="e.g. repeat, no-repeat" onChange={e => setThemePageBackgroundRepeat?.(e.target.value)} />
          )}
        </div>
      </div>
    </div>
  );
};
