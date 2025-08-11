import React from 'react';
import { Input } from '@/components/ui/input';

interface SectionTitleInputProps {
  blockId: string;
  value: string;
  suggestions: string[];
  onChange: (val: string) => void;
  onCommit: (val: string) => void;
}

export const SectionTitleInput: React.FC<SectionTitleInputProps> = ({ blockId, value, suggestions, onChange, onCommit }) => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const listId = React.useId();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true); return;
    }
    if (open) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => (i + 1) % suggestions.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => (i - 1 + suggestions.length) % suggestions.length); }
      else if (e.key === 'Enter' || e.key === 'Tab') { if (suggestions.length && active >= 0) { e.preventDefault(); onCommit(suggestions[active]); setOpen(false); setActive(-1); } }
      else if (e.key === 'Escape') { setOpen(false); setActive(-1); }
    }
  };
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => { setTimeout(() => { setOpen(false); setActive(-1); }, 120); };

  return (
    <div className="relative">
      <Input
        id={`section-title-${blockId}`}
        ref={inputRef}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-item-${active}` : undefined}
        placeholder="Start typing e.g. Principal's Message"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setActive(-1); }}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
      />
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg text-sm focus:outline-none"
        >
          {suggestions.map((s, i) => (
            <li
              id={`${listId}-item-${i}`}
              key={s}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); onCommit(s); setOpen(false); setActive(-1); }}
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
