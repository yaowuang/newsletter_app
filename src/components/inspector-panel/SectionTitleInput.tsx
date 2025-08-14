import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import EmojiToolbar from '@/components/inspector-panel/EmojiIconToolbar';

interface SectionTitleInputProps {
  blockId: string;
  value: string;
  onChange: (val: string) => void;
  onCommit: (val: string) => void;
  onUpdateContent: (blockId: string, property: 'content', value: string) => void;
  currentContent: string;
  disabled?: boolean;
  onCaretChange?: (index: number) => void;
}

export const SectionTitleInput: React.FC<SectionTitleInputProps> = ({ 
  blockId, 
  value, 
  onChange, 
  onCommit, 
  onUpdateContent, 
  currentContent,
  disabled,
  onCaretChange
}) => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const [showCalendarPrompt, setShowCalendarPrompt] = React.useState(false);
  const listId = React.useId();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const targetedTitles = React.useRef(new Set(["Upcoming Events","Important Dates","Dates"]));

  // Helper to generate a simple hardcoded Mon-Fri events table
  const generateWeekTable = React.useCallback(() => {
    return `| Date | Event |\n| ---- | ----- |\n| Mon |  |\n| Tue |  |\n| Wed |  |\n| Thu |  |\n| Fri |  |`;
  }, []);

  // Enhanced commit function that handles calendar replacement
  const stripLeadingEmojis = (val: string) => val.replace(/^[\p{Extended_Pictographic}\u200d\ufe0f\s]+/gu, '').trim();
  const commitTitle = (value: string) => {
    onCommit(value);
    const baseValue = stripLeadingEmojis(value);
    const existingContent = currentContent.trim();
    const isPlaceholder = existingContent === '' || existingContent === '- Your content here' || existingContent === 'Your content here';
    if (targetedTitles.current.has(baseValue)) {
      if (isPlaceholder) {
        onUpdateContent(blockId, 'content', generateWeekTable());
      } else if (!existingContent.includes('| Date | Event |')) { // avoid prompting if already a calendar table
        setShowCalendarPrompt(true);
      }
    }
  };

  // Common elementary newsletter section title suggestions
  interface Suggestion { title: string; emoji: string; }
  const titleSuggestions = React.useMemo<Suggestion[]>(() => [
    { title: "Announcements", emoji: "📣" },
    { title: "Art & Music", emoji: "🎨" },
    { title: "Birthday Celebrations", emoji: "🎂" },
    { title: "Class Highlights", emoji: "✨" },
    { title: "Community News", emoji: "📰" },
    { title: "Counselor's Corner", emoji: "💬" },
    { title: "Field Trips", emoji: "🚌" },
    { title: "Homework", emoji: "✏️" },
    { title: "Important Dates", emoji: "📅" },
    { title: "Looking Ahead", emoji: "🔮" },
    { title: "Lunch Menu", emoji: "🍽️" },
    { title: "Math Corner", emoji: "➗" },
    { title: "Quote of the Week", emoji: "❝" },
    { title: "Physical Education", emoji: "🏃" },
    { title: "Principal's Message", emoji: "🧑‍🏫" },
    { title: "PTA News", emoji: "🏫" },
    { title: "Reading Corner", emoji: "📚" },
    { title: "Reminders", emoji: "✅" },
    { title: "Safety Reminders", emoji: "⚠️" },
    { title: "Science Spotlight", emoji: "🔬" },
    { title: "Student of the Week", emoji: "⭐" },
    { title: "Technology Tips", emoji: "💻" },
    { title: "Upcoming Events", emoji: "📆" },
    { title: "Volunteer Opportunities", emoji: "🤝" },
  ], []);

  // Filter suggestions based on input
  const filteredSuggestions = React.useMemo(() => {
    const q = stripLeadingEmojis(value).toLowerCase();
    if (!q) return titleSuggestions; // Show all suggestions when no input
    return titleSuggestions
      .filter(s => s.title.toLowerCase().includes(q) && stripLeadingEmojis(value) !== s.title)
      .slice(0, 8);
  }, [value, titleSuggestions]);

  // When suggestions list changes and is open, ensure an active item (first) for quick Enter commit
  React.useEffect(() => {
    if (open && filteredSuggestions.length > 0) {
      setActive(prev => (prev === -1 || prev >= filteredSuggestions.length) ? 0 : prev);
    } else if (!filteredSuggestions.length) {
      setActive(-1);
    }
  }, [open, filteredSuggestions]);

  const commitAtIndex = (index: number) => {
    if (index >= 0 && index < filteredSuggestions.length) {
      const s = filteredSuggestions[index];
      const withEmoji = `${s.emoji} ${s.title}`;
      commitTitle(withEmoji);
      setOpen(false);
      setActive(-1);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true); return;
    }
    if (open) {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && filteredSuggestions.length === 0) {
        return; // nothing to navigate
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(i => filteredSuggestions.length ? ( (i + 1) % filteredSuggestions.length ) : -1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(i => filteredSuggestions.length ? ( (i - 1 + filteredSuggestions.length) % filteredSuggestions.length ) : -1);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (filteredSuggestions.length) {
          e.preventDefault();
          commitAtIndex(active === -1 ? 0 : active);
        }
      } else if (e.key === 'Escape') {
        setOpen(false); setActive(-1);
      }
    }
  };
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => { setTimeout(() => { setOpen(false); setActive(-1); }, 120); };

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
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
            <Button type="button" onClick={() => { onUpdateContent(blockId, 'content', generateWeekTable()); setShowCalendarPrompt(false); }}>Replace with Calendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        <Input
          id={`section-title-${blockId}`}
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && filteredSuggestions.length > 0}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${listId}-item-${active}` : undefined}
          placeholder="Start typing e.g. Principal's Message"
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); setActive(-1); if (onCaretChange) { const el = e.target as HTMLInputElement; onCaretChange(el.selectionStart ?? e.target.value.length); } }}
          onClick={e => { if (onCaretChange) { const el = e.target as HTMLInputElement; onCaretChange(el.selectionStart ?? 0); } }}
          onKeyUp={e => { if (onCaretChange) { const el = e.currentTarget; onCaretChange(el.selectionStart ?? 0); } }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
          disabled={disabled}
          className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
      {open && filteredSuggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg text-sm focus:outline-none"
        >
      {filteredSuggestions.map((s: Suggestion, i: number) => (
            <li
              id={`${listId}-item-${i}`}
        key={s.title}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); commitAtIndex(i); }}
              className={"px-3 py-2 cursor-pointer select-none " + (i === active ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700")}
            >
        <span className="mr-1" aria-hidden>{s.emoji}</span>{s.title}
            </li>
          ))}
        </ul>
      )}
      </div>
      {/* Emoji toolbar for inserting into the section title */}
      <EmojiToolbar onInsert={(emoji) => {
        const el = inputRef.current;
        const cur = value || '';
        if (!el) {
          const next = cur + emoji;
          onChange(next); onCommit(next); return;
        }
        const start = el.selectionStart ?? cur.length;
        const end = el.selectionEnd ?? start;
        const next = cur.slice(0, start) + emoji + cur.slice(end);
        onChange(next);
        onCommit(next);
        requestAnimationFrame(() => {
          if (inputRef.current) {
            const pos = start + emoji.length;
            inputRef.current.selectionStart = inputRef.current.selectionEnd = pos;
            inputRef.current.focus();
          }
        });
      }} />
    </div>
  );
};

export default SectionTitleInput;
