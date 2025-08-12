import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface SectionTitleInputProps {
  blockId: string;
  value: string;
  onChange: (val: string) => void;
  onCommit: (val: string) => void;
  onUpdateContent: (blockId: string, property: 'content', value: string) => void;
  currentContent: string;
  disabled?: boolean;
}

export const SectionTitleInput: React.FC<SectionTitleInputProps> = ({ 
  blockId, 
  value, 
  onChange, 
  onCommit, 
  onUpdateContent, 
  currentContent,
  disabled
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
  const commitTitle = (value: string) => {
    onCommit(value);
    const existingContent = currentContent.trim();
    const isPlaceholder = existingContent === '' || existingContent === '- Your content here' || existingContent === 'Your content here';
    if (targetedTitles.current.has(value)) {
      if (isPlaceholder) {
        onUpdateContent(blockId, 'content', generateWeekTable());
      } else if (!existingContent.includes('| Date | Event |')) { // avoid prompting if already a calendar table
        setShowCalendarPrompt(true);
      }
    }
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

  // Filter suggestions based on input
  const filteredSuggestions = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return titleSuggestions
      .filter(s => s.toLowerCase().includes(q) && s !== value)
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
      commitTitle(filteredSuggestions[index]);
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
        onChange={e => { onChange(e.target.value); setOpen(true); /* reset active so effect will set to 0 */ setActive(-1); }}
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
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg text-sm focus:outline-none"
        >
          {filteredSuggestions.map((s: string, i: number) => (
            <li
              id={`${listId}-item-${i}`}
              key={s}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); commitAtIndex(i); }}
              className={"px-3 py-2 cursor-pointer select-none " + (i === active ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700")}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SectionTitleInput;
