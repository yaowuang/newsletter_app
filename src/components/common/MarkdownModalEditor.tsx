import React from 'react';
import { createPortal } from 'react-dom';
import FormattingToolbar, { FormattingAction } from '@/components/common/FormattingToolbar';
import EmojiToolbar from '@/components/common/EmojiIconToolbar';

interface MarkdownModalEditorProps {
  value: string;
  onChange: (v: string) => void;
  onAccept: () => void;
  onCancel: () => void;
  label?: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MarkdownModalEditor: React.FC<MarkdownModalEditorProps> = ({
  value,
  onChange,
  onAccept,
  onCancel,
  label = 'Edit Markdown',
  placeholder = 'Enter Markdown content...',
  className = '',
  style = {},
}) => {
  // Ref for focusing
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = len;
    }
  }, []);

  // Insert token at cursor position
  const insertToken = (token: string) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(value + token);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? start;
    const next = value.slice(0, start) + token + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const pos = start + token.length;
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = pos;
        textareaRef.current.focus();
      }
    });
  };

  // Formatting actions
  const applyFormatting = (action: FormattingAction) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? start;
    const selected = value.slice(start, end);

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

    const next = value.slice(0, start) + replacement + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newStart;
        textareaRef.current.selectionEnd = Math.min(newEnd, next.length);
      }
    });
  };

  if (typeof window === 'undefined' || typeof document === 'undefined') return null;

  return createPortal(
  <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-12 pr-12">
      {/* Removed backdrop-blur-sm to eliminate blur. Positioned modal top-right with pt-12 pr-12, items-start justify-end. */}
      <div
        ref={modalRef}
        className={
          'relative z-[10000] bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-blue-600/90 flex flex-col min-w-[380px] min-h-[320px] max-w-[96vw] max-h-[92vh] p-0 ' +
          className
        }
        style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.22)', ...style }}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-blue-200/70 bg-blue-50/60 dark:bg-neutral-800/60 rounded-t-xl">
          <span className="text-lg font-semibold text-blue-900 dark:text-blue-100 select-none">{label}</span>
          <div className="flex gap-2">
            <button
              onClick={e => {
                e.preventDefault();
                onAccept();
              }}
              className="flex items-center justify-center w-9 h-9 bg-green-600 hover:bg-green-700 text-white rounded-full shadow focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Save changes"
              title="Save (Cmd+Enter)"
              tabIndex={0}
            >
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
              </svg>
            </button>
            <button
              onClick={e => {
                e.preventDefault();
                onCancel();
              }}
              className="flex items-center justify-center w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full shadow focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Cancel changes"
              title="Cancel (Esc)"
              tabIndex={0}
            >
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>
        </div>
        {/* Toolbars */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-blue-100/60 bg-white/80 dark:bg-neutral-900/60 relative">
          <FormattingToolbar onAction={applyFormatting} />
          <div className="ml-auto relative z-[10100]">
            {/*
              To ensure the emoji dropdown appears above the modal and is not blurry,
              the dropdown/popover in EmojiToolbar should use a high z-index (e.g. z-[10110])
              and avoid any backdrop-blur or background: inherit. If not possible via props,
              override its menu container with a global CSS rule like:
              .emoji-dropdown-menu { z-index: 10110 !important; position: absolute !important; filter: none !important; background: white !important; }
            */}
            <EmojiToolbar onInsert={insertToken} />
          </div>
        </div>
        {/* Editor */}
        <div className="flex-1 flex flex-col px-6 py-4 bg-white dark:bg-neutral-900">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                onAccept();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
              }
            }}
            className="resize-none w-full h-[240px] min-h-[120px] max-h-[48vh] px-4 py-3 text-[16px] font-mono text-blue-900 dark:text-blue-100 bg-white dark:bg-neutral-900 border border-blue-200/60 dark:border-blue-800/60 rounded-lg leading-relaxed shadow-inner whitespace-pre-wrap focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder:text-blue-400/70 dark:placeholder:text-blue-300/50"
            style={{
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
              lineHeight: '1.6',
              letterSpacing: '0.01em',
              boxSizing: 'border-box',
            }}
            aria-label={label}
            spellCheck={false}
            placeholder={placeholder}
            data-inline-markdown-modal-editor="true"
          />
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-2 bg-blue-50/60 dark:bg-neutral-800/60 rounded-b-xl border-t border-blue-100/60">
          <span className="text-xs text-blue-600 dark:text-blue-200 font-mono select-none">Markdown</span>
          <span className="text-xs text-gray-600 dark:text-gray-300 font-mono select-none">Cmd+Enter: Save • Esc: Cancel</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
