import React from 'react';
import { useStore } from '@/lib/store';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';
import FormattingToolbar, { FormattingAction } from '@/features/newsletter/components/FormattingToolbar';
import EmojiToolbar from '@/features/newsletter/components/EmojiIconToolbar';

interface DateInspectorProps {
  dateKey: string;
  date: Date;
  onClose: () => void;
}

export const DateInspector: React.FC<DateInspectorProps> = ({ dateKey, date, onClose }) => {
  const { calendarData, setCellContent } = useStore();
  const { cellContents = {} } = calendarData;
  const cellContent = cellContents[dateKey] || '';
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Prevent auto-focus: blur textarea on mount if not editing (so CalendarGrid can catch keydown)
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
  }, []);

  const insertToken = (token: string) => {
    const current = typeof cellContent === 'string' ? cellContent : '';
    const el = textareaRef.current;
    if (!el) {
      setCellContent(dateKey, current + token);
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? start;
    const next = current.slice(0, start) + token + current.slice(end);
    setCellContent(dateKey, next);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const pos = start + token.length;
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = pos;
        textareaRef.current.focus();
      }
    });
  };

  const applyFormatting = (action: FormattingAction) => {
    const current = typeof cellContent === 'string' ? cellContent : '';
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? start;
    const selected = current.slice(start, end);

    let replacement = '';
    let newStart = start;
    let newEnd = end;
    const wrapOrInsert = (pre: string, post: string, placeholder: string) => selected ? pre + selected + post : pre + placeholder + post;

    switch(action) {
      case 'bold':
        replacement = wrapOrInsert('**', '**', 'bold text');
        newStart = start + 2; newEnd = start + (selected ? selected.length : 9) + 2; break;
      case 'italic':
        replacement = wrapOrInsert('*', '*', 'italic text');
        newStart = start + 1; newEnd = start + (selected ? selected.length : 11) + 1; break;
      case 'ul': {
        const text = selected || 'List item';
        replacement = text.split('\n').map(l => l ? `- ${l}` : '- ').join('\n');
        newStart = start + 2; newEnd = start + replacement.length; break; }
      case 'ol': {
        const text = selected || 'List item';
        replacement = text.split('\n').map((l,i) => `${i+1}. ${l || 'List item'}`).join('\n');
        newStart = start + 3; newEnd = start + replacement.length; break; }
      case 'link': {
        const placeholder = selected || 'link text';
        replacement = `[${placeholder}](https://)`;
        newStart = start + 1; newEnd = start + 1 + placeholder.length; break; }
      case 'table':
        replacement = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Value 1 | Value 2 | Value 3 |\n';
        newStart = start + 2; newEnd = start + replacement.length; break;
      case 'hr':
        replacement = '\n---\n';
        newStart = start + 1; newEnd = newStart + 3; break;
      default: return;
    }

    const next = current.slice(0, start) + replacement + current.slice(end);
    setCellContent(dateKey, next);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newStart;
        textareaRef.current.selectionEnd = Math.min(newEnd, next.length);
      }
    });
  };

  const handleContentChange = (content: string) => setCellContent(dateKey, content);

  const formatDateDisplay = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-lg leading-tight">{formatDateDisplay(date)}</h3>
        <Button onClick={onClose} size="sm" variant="outline">Done</Button>
      </div>
      <InspectorSection title="Content">
        <FormGroup label="" id="cell-content">
          <FormattingToolbar onAction={(a: FormattingAction) => applyFormatting(a)} />
          <Textarea
            id="cell-content"
            ref={textareaRef}
            value={cellContent}
            onChange={(e) => handleContentChange(e.target.value)}
            className="h-32 text-sm"
            placeholder="Add notes, list items, *formatting*, etc..."
          />
          <EmojiToolbar onInsert={insertToken} />
        </FormGroup>
      </InspectorSection>
    </div>
  );
};

export default DateInspector;
