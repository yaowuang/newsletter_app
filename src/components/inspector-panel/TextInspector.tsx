import React from "react";
import { TextBlock, SectionStyle, useStore } from "@/lib/store";
import { Theme } from "@/lib/themes";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FONT_LABEL_TO_VALUE, FONT_VALUE_TO_LABEL } from "../inspector-panel";

interface TextInspectorProps {
  block: TextBlock;
  fonts: string[];
  theme: Theme;
  currentStyle: Partial<SectionStyle>;
  onUpdateTextBlock: (id: string, property: 'title' | 'content', value: string) => void;
  onStyleChange: (blockId: string, newStyles: Partial<SectionStyle>) => void;
}

export const TextInspector: React.FC<TextInspectorProps> = ({
  block,
  fonts,
  theme,
  currentStyle,
  onUpdateTextBlock,
  onStyleChange,
}) => {
  const deleteElement = useStore(s => s.deleteElement);
  const handleStyleChange = (property: keyof SectionStyle, value: string | number) => {
    onStyleChange(block.id, { [property]: value });
  };

  // Helper to generate a simple hardcoded Mon-Fri events table (used when title suggests dates)
  const generateWeekTable = React.useCallback(() => {
    return `| Date | Event |\n| ---- | ----- |\n| Mon |  |\n| Tue |  |\n| Wed |  |\n| Thu |  |\n| Fri |  |`;
  }, []);

  // Convert stored css variable to label for select value
  const toLabel = (val: string | undefined) => {
    if (!val) return fonts[0];
    return FONT_VALUE_TO_LABEL[val] || val;
  };
  const fromLabel = (label: string) => FONT_LABEL_TO_VALUE[label] || label;

  // Emoji & icon helpers
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const emojiList = ['😀','😁','😂','🤣','😊','😍','🤔','😎','😭','😡','👍','👎','🙏','🎉','✨','🔥','💡','✅','❌','⚠️'];
  const iconList = ['⭐','📌','📎','📝','📣','🔔','🧪','🛠️','📊','📅','🚀','💼','💻','🧠','🔒','🧾'];
  const insertToken = (token: string) => {
    const current = typeof block.content === 'string' ? block.content : '';
    const el = textareaRef.current;
    if (!el) {
      onUpdateTextBlock(block.id, 'content', current + token);
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? start;
    const next = current.slice(0, start) + token + current.slice(end);
    onUpdateTextBlock(block.id, 'content', next);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const pos = start + token.length;
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = pos;
        textareaRef.current.focus();
      }
    });
  };

  const applyFormatting = (action: string) => {
    const current = typeof block.content === 'string' ? block.content : '';
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? start;
    const selected = current.slice(start, end);

    let replacement = '';
    let newStart = start;
    let newEnd = end;

    const wrapOrInsert = (pre: string, post: string, placeholder: string) => {
      if (selected) {
        return pre + selected + post;
      }
      return pre + placeholder + post;
    };

    switch(action) {
      case 'bold':
        replacement = wrapOrInsert('**', '**', 'bold text');
        newStart = start + 2;
        newEnd = start + (selected ? selected.length : 9) + 2; // 'bold text'.length = 9
        break;
      case 'italic':
        replacement = wrapOrInsert('*', '*', 'italic text');
        newStart = start + 1;
        newEnd = start + (selected ? selected.length : 11) + 1;
        break;
      case 'ul': {
        const text = selected || 'List item';
        replacement = text.split('\n').map(l => l ? `- ${l}` : '- ').join('\n');
        newStart = start + 2;
        newEnd = start + replacement.length;
        break; }
      case 'ol': {
        const text = selected || 'List item';
        replacement = text.split('\n').map((l,i) => `${i+1}. ${l || 'List item'}`).join('\n');
        newStart = start + 3;
        newEnd = start + replacement.length;
        break; }
      case 'link': {
        const placeholder = selected || 'link text';
        replacement = `[${placeholder}](https://)`;
        newStart = start + 1;
        newEnd = start + 1 + placeholder.length;
        break; }
      case 'table': {
        replacement = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Value 1 | Value 2 | Value 3 |\n';
        newStart = start + 2;
        newEnd = start + replacement.length;
        break; }
      case 'hr': {
        replacement = '\n---\n';
        newStart = start + 1;
        newEnd = newStart + 3;
        break; }
      default:
        return;
    }

    const next = current.slice(0, start) + replacement + current.slice(end);
    onUpdateTextBlock(block.id, 'content', next);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newStart;
        textareaRef.current.selectionEnd = Math.min(newEnd, next.length);
      }
    });
  };

  // Common elementary newsletter section title suggestions
  const titleSuggestions = React.useMemo(() => [
    "Announcements",
    "Art & Music",
    "Birthday Celebrations",
    "Class Highlights",
    "Community News",
    "Counselor's Corner",
    "Field Trips",
    "Homework",
    "Important Dates",
    "Looking Ahead",
    "Lunch Menu",
    "Math Corner",
    "Quote of the Week",
    "Physical Education",
    "Principal's Message",
    "PTA News",
    "Reading Corner",
    "Reminders",
    "Safety Reminders",
    "Science Spotlight",
    "Student of the Week",
    "Technology Tips",
    "Upcoming Events",
    "Volunteer Opportunities",
  ], []);

  // Enhanced autocomplete state for Section Title
  const [titleInput, setTitleInput] = React.useState(block.title || "");
  const [openTitleSuggestions, setOpenTitleSuggestions] = React.useState(false);
  const [activeSuggestion, setActiveSuggestion] = React.useState<number>(-1);
  const suggestionsRef = React.useRef<HTMLUListElement | null>(null);
  const titleInputRef = React.useRef<HTMLInputElement | null>(null);
  const [showCalendarPrompt, setShowCalendarPrompt] = React.useState(false);
  const targetedTitles = React.useRef(new Set(["Upcoming Events","Important Dates","Dates"]));

  // Sync internal state when external block changes
  React.useEffect(() => {
    setTitleInput(block.title || "");
  }, [block.id, block.title]);

  const filteredTitleSuggestions = React.useMemo(() => {
    const q = titleInput.trim().toLowerCase();
    return titleSuggestions
      .filter(s => s.toLowerCase().includes(q) && s !== titleInput)
      .slice(0, 8);
  }, [titleInput, titleSuggestions]);

  const commitTitle = (value: string) => {
    setTitleInput(value);
    onUpdateTextBlock(block.id, 'title', value);
    const existingContentRaw = (typeof block.content === 'string' ? block.content : '');
    const existingContent = existingContentRaw.trim();
    const isPlaceholder = existingContent === '' || existingContent === '- Your content here' || existingContent === 'Your content here';
    if (targetedTitles.current.has(value)) {
      if (isPlaceholder) {
        onUpdateTextBlock(block.id, 'content', generateWeekTable());
      } else if (!existingContent.includes('| Date | Event |')) { // avoid prompting if already a calendar table
        setShowCalendarPrompt(true);
      }
    }
    setOpenTitleSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleTitleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!openTitleSuggestions && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpenTitleSuggestions(true);
      return;
    }
    if (openTitleSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion(i => {
          const next = i + 1;
          return next >= filteredTitleSuggestions.length ? 0 : next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion(i => {
          const next = i - 1;
            return next < 0 ? filteredTitleSuggestions.length - 1 : next;
        });
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (filteredTitleSuggestions.length && activeSuggestion >= 0) {
          e.preventDefault();
          commitTitle(filteredTitleSuggestions[activeSuggestion]);
        }
      } else if (e.key === 'Escape') {
        setOpenTitleSuggestions(false);
        setActiveSuggestion(-1);
      }
    }
  };

  const handleTitleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    // Delay closing so click can register
    setTimeout(() => {
      setOpenTitleSuggestions(false);
      setActiveSuggestion(-1);
    }, 120);
  };
  const titleListId = React.useId();

  // Generated IDs for a11y associations
  const headingColorId = `heading-color-${block.id}`;
  const headingBgId = `heading-bg-${block.id}`;
  const headingFontId = `heading-font-${block.id}`;
  const contentColorId = `content-color-${block.id}`;
  const contentBgId = `content-bg-${block.id}`;
  const contentFontId = `content-font-${block.id}`;
  const borderColorId = `border-color-${block.id}`;
  const borderWidthId = `border-width-${block.id}`;
  const borderRadiusId = `border-radius-${block.id}`;

  return (
    <div className="space-y-6">
      {/* Calendar Replace Prompt */}
      <Dialog open={showCalendarPrompt} onOpenChange={setShowCalendarPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace content with calendar?</DialogTitle>
            <DialogDescription>
              You changed the title to a dates / events section. Do you want to replace the current content with a weekly calendar template?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => setShowCalendarPrompt(false)}>Keep Content</Button>
            <Button type="button" onClick={() => { onUpdateTextBlock(block.id, 'content', generateWeekTable()); setShowCalendarPrompt(false); }}>Replace with Calendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-end -mb-2">
        <Button type="button" size="sm" variant="destructive" onClick={() => deleteElement(block.id, 'text')} aria-label="Delete section">Delete Section</Button>
      </div>
      {/* Title & Content */}
      <div className="rounded-xl bg-white dark:bg-gray-900 shadow p-4 space-y-2 border border-gray-100 dark:border-gray-800">
        <Label className="text-base font-medium" htmlFor={`section-title-${block.id}`}>Section Title</Label>
        <div className="relative">
          <Input
            id={`section-title-${block.id}`}
            name={`sectionTitle-${block.id}`}
            ref={titleInputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={openTitleSuggestions && filteredTitleSuggestions.length > 0}
            aria-controls={titleListId}
            aria-activedescendant={activeSuggestion >= 0 ? `${titleListId}-item-${activeSuggestion}` : undefined}
            placeholder="Start typing e.g. Principal's Message"
            value={titleInput}
            onChange={e => {
              const v = e.target.value;
              setTitleInput(v);
              onUpdateTextBlock(block.id, 'title', v);
              setOpenTitleSuggestions(true);
              setActiveSuggestion(-1);
            }}
            onKeyDown={handleTitleKeyDown}
            onFocus={() => setOpenTitleSuggestions(true)}
            onBlur={handleTitleBlur}
            className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          {openTitleSuggestions && filteredTitleSuggestions.length > 0 && (
            <ul
              id={titleListId}
              ref={suggestionsRef}
              role="listbox"
              className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg text-sm focus:outline-none"
            >
              {filteredTitleSuggestions.map((s, i) => (
                <li
                  id={`${titleListId}-item-${i}`}
                  key={s}
                  role="option"
                  aria-selected={i === activeSuggestion}
                  onMouseEnter={() => setActiveSuggestion(i)}
                  onMouseDown={(e) => { e.preventDefault(); commitTitle(s); }}
                  className={"px-3 py-2 cursor-pointer select-none " + (i === activeSuggestion ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700")}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Label className="text-base font-medium" htmlFor={`section-content-${block.id}`}>Section Content</Label>
        <div className="flex flex-wrap gap-1 mb-1 text-xs">
          <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => applyFormatting('bold')}><strong>B</strong></Button>
            <Button type="button" size="sm" variant="outline" className="h-7 px-2 italic" onClick={() => applyFormatting('italic')}>I</Button>
            <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => applyFormatting('ul')}>• List</Button>
            <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => applyFormatting('ol')}>1. List</Button>
            <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => applyFormatting('link')}>Link</Button>
            <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => applyFormatting('table')}>Table</Button>
            <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => applyFormatting('hr')}>HR</Button>
        </div>
        <Textarea
          id={`section-content-${block.id}`}
          name={`sectionContent-${block.id}`}
          ref={textareaRef}
          value={typeof block.content === 'string' ? block.content : ''}
          onChange={e => onUpdateTextBlock(block.id, 'content', e.target.value)}
          className="h-32 text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        {/* Emoji & Icon helper toolbar */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">Emoji 😊</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-56 w-56 overflow-y-auto grid grid-cols-6 gap-1 p-2">
              {emojiList.map(e => (
                <DropdownMenuItem key={e} className="justify-center px-0" onSelect={(ev) => { ev.preventDefault(); insertToken(e); }}>
                  {e}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">Icons ⭐</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-56 w-56 overflow-y-auto grid grid-cols-6 gap-1 p-2">
              {iconList.map(e => (
                <DropdownMenuItem key={e} className="justify-center px-0" onSelect={(ev) => { ev.preventDefault(); insertToken(e); }}>
                  {e}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Heading Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Heading Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label htmlFor={headingColorId} className="min-w-[120px]">Heading Color</Label>
            <Input id={headingColorId} type="color" value={currentStyle.headingColor || theme.styles.section.headingColor || '#000000'} onChange={e => handleStyleChange('headingColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.headingColor || theme.styles.section.headingColor || '#000000') === (theme.styles.section.borderColor || '#000000')} onClick={() => handleStyleChange('headingColor', theme.styles.section.headingColor || '#000000')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={headingBgId} className="min-w-[120px]">Heading Background</Label>
            <Input id={headingBgId} type="color" value={currentStyle.headingBackgroundColor || theme.styles.section.headingBackgroundColor || '#ffffff'} onChange={e => handleStyleChange('headingBackgroundColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.headingBackgroundColor || theme.styles.section.headingBackgroundColor || '#ffffff') === (theme.styles.section.headingBackgroundColor || '#ffffff')} onClick={() => handleStyleChange('headingBackgroundColor', theme.styles.section.headingBackgroundColor || '#ffffff')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={headingFontId} className="min-w-[120px]">Heading Font</Label>
            <Select onValueChange={value => handleStyleChange('headingFontFamily', fromLabel(value))} value={toLabel(currentStyle.headingFontFamily || theme.styles.section.headingFontFamily || fonts[0])}>
              <SelectTrigger id={headingFontId}><SelectValue placeholder="Select a font" /></SelectTrigger>
              <SelectContent>
                {fonts.slice().sort((a,b)=>a.localeCompare(b)).map(font => {
                  const cssVal = FONT_LABEL_TO_VALUE[font] || font;
                  return (
                    <SelectItem key={font} value={font} style={{ fontFamily: cssVal }}>
                      {font}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={toLabel(currentStyle.headingFontFamily || theme.styles.section.headingFontFamily || fonts[0]) === toLabel(theme.styles.section.headingFontFamily || fonts[0])} onClick={() => handleStyleChange('headingFontFamily', theme.styles.section.headingFontFamily || fonts[0])}>↺</Button>
          </div>
        </div>
      </div>

      {/* Content Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Content Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label htmlFor={contentColorId} className="min-w-[120px]">Content Color</Label>
            <Input id={contentColorId} type="color" value={currentStyle.contentColor || theme.styles.section.contentColor || '#000000'} onChange={e => handleStyleChange('contentColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.contentColor || theme.styles.section.contentColor || '#000000') === (theme.styles.section.borderColor || '#000000')} onClick={() => handleStyleChange('contentColor', theme.styles.section.contentColor || '#000000')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={contentBgId} className="min-w-[120px]">Content Background</Label>
            <Input id={contentBgId} type="color" value={currentStyle.backgroundColor || theme.styles.section.backgroundColor || '#ffffff'} onChange={e => handleStyleChange('backgroundColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.backgroundColor || theme.styles.section.backgroundColor || '#ffffff') === (theme.styles.section.backgroundColor || '#ffffff')} onClick={() => handleStyleChange('backgroundColor', theme.styles.section.backgroundColor || '#ffffff')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={contentFontId} className="min-w-[120px]">Content Font</Label>
            <Select onValueChange={value => handleStyleChange('fontFamily', fromLabel(value))} value={toLabel(currentStyle.fontFamily || theme.styles.section.contentFontFamily || fonts[0])}>
              <SelectTrigger id={contentFontId}><SelectValue placeholder="Select a font" /></SelectTrigger>
              <SelectContent>
                {fonts.slice().sort((a,b)=>a.localeCompare(b)).map(font => {
                  const cssVal = FONT_LABEL_TO_VALUE[font] || font;
                  return (
                    <SelectItem key={font} value={font} style={{ fontFamily: cssVal }}>
                      {font}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={toLabel(currentStyle.fontFamily ?? theme.styles.section.contentFontFamily ?? fonts[0]) === toLabel(theme.styles.section.contentFontFamily ?? fonts[0])} onClick={() => handleStyleChange('fontFamily', theme.styles.section.contentFontFamily ?? fonts[0])}>↺</Button>
          </div>
        </div>
      </div>

      {/* Border Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Border Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label htmlFor={borderColorId} className="min-w-[120px]">Border Color</Label>
            <Input id={borderColorId} type="color" value={currentStyle.borderColor || theme.styles.section.borderColor || '#000000'} onChange={e => handleStyleChange('borderColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.borderColor || theme.styles.section.borderColor || '#000000') === (theme.styles.section.borderColor || '#000000')} onClick={() => handleStyleChange('borderColor', theme.styles.section.borderColor || '#000000')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={borderWidthId} className="min-w-[120px]">Border Width (px)</Label>
            <Input id={borderWidthId} type="number" value={currentStyle.borderWidth ?? 1} onChange={e => handleStyleChange('borderWidth', parseInt(e.target.value))} className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.borderWidth ?? 1) === 1} onClick={() => handleStyleChange('borderWidth', 1)}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={borderRadiusId} className="min-w-[120px]">Border Radius (px)</Label>
            <Input id={borderRadiusId} type="number" value={currentStyle.borderRadius ?? (theme.styles.section.borderRadius ?? 0)} onChange={e => handleStyleChange('borderRadius', parseInt(e.target.value))} className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.borderRadius ?? theme.styles.section.borderRadius ?? 0) === (theme.styles.section.borderRadius ?? 0)} onClick={() => handleStyleChange('borderRadius', theme.styles.section.borderRadius ?? 0)}>↺</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
