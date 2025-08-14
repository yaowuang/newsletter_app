import React, { useRef, useEffect, useState, CSSProperties } from 'react';
import { MarkdownModalEditor } from '@/components/common/MarkdownModalEditor';
import { useStore } from '@/lib/store/index';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import type { TextBlock, SectionStyles } from '@/features/newsletter/types';
import type { Theme } from '@/lib/themes';
import { useInlineEdit } from '@/hooks/useInlineEdit';

interface TextBlockProps {
  block: TextBlock;
  style: SectionStyles[string];
  themeStyle: Theme['styles']['section'];
  denseMode: boolean;
  onSelectElement?: (id: string, type: 'text', subType?: 'title' | 'content') => void;
}

// TextBlock: Renders a single text block with markdown support. SRP: only text block rendering.
export function TextBlock({ block, style, themeStyle, denseMode, onSelectElement }: TextBlockProps) {
  // Zustand store hooks
  const editingCaret = useStore(s => s.editingCaret);
  const updateTextBlock = useStore(s => s.updateTextBlock);
  const selectedElement = useStore(s => s.selectedElement);

  // Inline edit state (DRY via useInlineEdit)
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    isEditing: isEditingTitle,
    draftValue: draftTitle,
    beginEdit: beginEditTitle,
    commitEdit: commitEditTitle,
    cancelEdit: cancelEditTitle,
    handleChange: handleTitleChange,
    setDraftValue: setDraftTitle,
    setIsEditing: setIsEditingTitle,
    setOriginalValue: setOriginalTitle,
  } = useInlineEdit({
    initialValue: block.title || '',
    onCommit: (v) => {
      updateTextBlock(block.id, 'title', v);
      if (onSelectElement) onSelectElement(block.id, 'text');
      requestAnimationFrame(() => {
        const canvas = document.getElementById('newsletter-canvas');
        if (canvas) canvas.focus();
      });
    },
    onCancel: () => {
      if (onSelectElement) onSelectElement(block.id, 'text');
      requestAnimationFrame(() => {
        const canvas = document.getElementById('newsletter-canvas');
        if (canvas) canvas.focus();
      });
    },
  autoFocusRef: titleInputRef as React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
  });
  const {
    isEditing: isEditingContent,
    draftValue: draftContent,
    beginEdit: beginEditContent,
    commitEdit: commitEditContent,
    cancelEdit: cancelEditContent,
    handleChange: handleContentChange,
    setDraftValue: setDraftContent,
    setIsEditing: setIsEditingContent,
    setOriginalValue: setOriginalContent,
  } = useInlineEdit({
    initialValue: block.content || '',
    onCommit: (v) => {
      updateTextBlock(block.id, 'content', v);
      if (onSelectElement) onSelectElement(block.id, 'text');
      requestAnimationFrame(() => {
        const canvas = document.getElementById('newsletter-canvas');
        if (canvas) canvas.focus();
      });
    },
    onCancel: () => {
      if (onSelectElement) onSelectElement(block.id, 'text');
      requestAnimationFrame(() => {
        const canvas = document.getElementById('newsletter-canvas');
        if (canvas) canvas.focus();
      });
    },
  autoFocusRef: contentTextareaRef as React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
  });

  // Is this block selected?
  const isThisBlockSelected = selectedElement?.id === block.id && selectedElement?.type === 'text';

  // Keyboard: start inline editing if selected (preserve original logic)
  useEffect(() => {
    if (!isThisBlockSelected || block.locked || isEditingTitle || isEditingContent) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const isPrintable = e.key.length === 1;
      const isBackspace = e.key === 'Backspace';
      const isEnter = e.key === 'Enter';
      if (!isPrintable && !isBackspace && !isEnter) return;
      let targetField: 'title' | 'content';
      if (selectedElement?.subType === 'title') targetField = 'title';
      else if (selectedElement?.subType === 'content') targetField = 'content';
      else targetField = (!block.title || block.title.trim() === '') ? 'title' : 'content';
      e.preventDefault();
      const currentValue = targetField === 'title' ? (block.title || '') : (block.content || '');
      if (targetField === 'title') {
        setOriginalTitle(currentValue);
        let newValue = currentValue;
        if (isBackspace) newValue = currentValue.slice(0, -1);
        else if (isPrintable) newValue = currentValue + e.key;
        setDraftTitle(newValue);
        setIsEditingTitle(true);
      } else {
        setOriginalContent(currentValue);
        let newValue = currentValue;
        if (isBackspace) newValue = currentValue.slice(0, -1);
        else if (isEnter) newValue = currentValue + '\n';
        else if (isPrintable) newValue = currentValue + e.key;
        setDraftContent(newValue);
        setIsEditingContent(true);
      }
      requestAnimationFrame(() => {
        const inputRef = targetField === 'title' ? titleInputRef : contentTextareaRef;
        if (inputRef.current) {
          inputRef.current.focus();
          const length = (inputRef.current as any).value.length;
          inputRef.current.selectionStart = length;
          inputRef.current.selectionEnd = length;
        }
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isThisBlockSelected, block.locked, isEditingTitle, isEditingContent, selectedElement?.subType, block.title, block.content, setOriginalTitle, setDraftTitle, setIsEditingTitle, setOriginalContent, setDraftContent, setIsEditingContent]);

  // Styles
  const headingStyle: CSSProperties = {
    color: style.headingColor || themeStyle.headingColor,
    backgroundColor: style.headingBackgroundColor || themeStyle.headingBackgroundColor,
    fontFamily: style.headingFontFamily || themeStyle.headingFontFamily,
    padding: denseMode ? '0.25rem 0.75rem' : '0.5rem 1rem',
    borderBottom: '1px solid',
    borderBottomColor: style.borderColor || themeStyle.borderColor,
  };
  const contentStyle: CSSProperties = {
    color: style.contentColor || themeStyle.contentColor,
    backgroundColor: style.backgroundColor || themeStyle.backgroundColor,
    fontFamily: style.fontFamily || style.contentFontFamily || themeStyle.contentFontFamily,
    padding: denseMode ? '0.25rem 0.75rem' : '0.5rem 1rem',
    flexGrow: 1,
    overflowY: 'auto',
    lineHeight: denseMode ? '1.3' : '1.5',
  };
  const borderColor = style.borderColor || themeStyle.borderColor || '#ccc';
  const tableHeaderBg = style.headingBackgroundColor || themeStyle.headingBackgroundColor || '#f5f5f5';
  const tableHeaderColor = style.headingColor || themeStyle.headingColor || 'inherit';
  const tableCellBg = style.backgroundColor || themeStyle.backgroundColor || 'transparent';
  const linkColor = style.headingBackgroundColor || themeStyle.headingBackgroundColor;

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    (e.currentTarget as HTMLElement).classList.add('ring-2', 'ring-blue-400');
  };
  const handleDragLeave = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove('ring-2', 'ring-blue-400');
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove('ring-2', 'ring-blue-400');
    const sourceId = e.dataTransfer.getData('text/plain');
    const targetId = block.id;
    if (sourceId && targetId && sourceId !== targetId) {
      const swapEvent = new CustomEvent('swap-text-blocks', { detail: { sourceId, targetId } });
      window.dispatchEvent(swapEvent);
    }
  };

  return (
    <>
      <div
        style={{ ...headingStyle, position: 'relative' }}
        className={
          'font-bold text-lg select-none ' + ((isEditingTitle || isEditingContent) ? '' : 'cursor-grab active:cursor-grabbing')
        }
        draggable={!(isEditingTitle || isEditingContent)}
        data-block-id={block.id}
        data-block-heading="true"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseDown={e => {
          e.stopPropagation();
          if (onSelectElement) onSelectElement(block.id, 'text', 'title');
        }}
        onDoubleClick={e => {
          e.stopPropagation();
          beginEditTitle();
        }}
        onClick={e => e.stopPropagation()}
      >
        {block.locked && isThisBlockSelected && (
          <span style={{
            position: 'absolute',
            top: 8,
            right: 12,
            background: '#fff',
            borderRadius: '50%',
            padding: 2,
            zIndex: 30,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }} title="Locked" aria-label="Locked">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
        )}
        {isEditingTitle ? (
          <div className="relative w-full">
            <input
              ref={titleInputRef}
              value={draftTitle}
              onChange={e => handleTitleChange(e.target.value)}
              onBlur={commitEditTitle}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitEditTitle();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelEditTitle();
                }
              }}
              data-inline-edit-block={block.id}
              className="w-full bg-white/80 dark:bg-zinc-800/80 outline-none border-2 border-blue-400/70 focus:border-blue-500 rounded-sm px-2 py-1 text-inherit font-inherit shadow-sm"
              aria-label="Edit section title"
              autoComplete="off"
              placeholder="Enter section title..."
            />
            <div className="absolute top-0 right-2 text-xs text-gray-500/70 font-mono pointer-events-none leading-tight">
              Enter: Save • Esc: Cancel
            </div>
          </div>
        ) : typeof block.title === 'string' ? block.title : ''}
      </div>
      <div
        style={contentStyle}
        className={
          'max-w-none cursor-text prose'
        }
        data-block-content="true"
        onClick={e => {
          e.stopPropagation();
          if (isEditingContent || isEditingTitle) return;
          if (onSelectElement) onSelectElement(block.id, 'text', 'content');
        }}
        onDoubleClick={e => {
          e.stopPropagation();
          if (!(isEditingContent || isEditingTitle)) {
            beginEditContent();
            requestAnimationFrame(() => {
              if (onSelectElement) onSelectElement(block.id, 'text', 'content');
            });
          }
        }}
      >
        {editingCaret && editingCaret.blockId === block.id && !isEditingContent && !isEditingTitle &&
          (editingCaret.field === 'title' || editingCaret.field === 'content') && (
            <CaretOverlay block={block} field={editingCaret.field} index={editingCaret.index} />
          )}
        {isEditingContent && (
          <MarkdownModalEditor
            value={draftContent}
            onChange={handleContentChange}
            onAccept={commitEditContent}
            onCancel={cancelEditContent}
            label="Edit section content (Markdown)"
            placeholder="Enter Markdown content..."
          />
        )}
        <div className={isEditingContent ? 'prose' : ''}>
          <MarkdownRenderer
            markdown={isEditingContent ? draftContent : (typeof block.content === 'string' ? block.content : '')}
            denseMode={denseMode}
            borderColor={borderColor}
            tableHeaderBg={tableHeaderBg}
            tableHeaderColor={tableHeaderColor}
            tableCellBg={tableCellBg}
            linkColor={linkColor}
            headingFontFamily={headingStyle.fontFamily}
          />
        </div>
      </div>
    </>
  );
}

// CaretOverlay: lightweight caret overlay for live preview.
const CaretOverlay: React.FC<{ block: TextBlock; field: 'title' | 'content'; index: number }> = ({ block, field, index }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; height: number }>({ left: 0, top: 0, height: 16 });
  useEffect(() => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    if (field === 'title') {
      const headingEl = el.parentElement?.querySelector('[data-block-heading="true"]') as HTMLElement | null;
      if (headingEl) {
        const text = block.title || '';
        const sub = text.slice(0, Math.min(index, text.length));
        const meas = measureText(sub, headingEl);
        setPos({ left: headingEl.offsetLeft + meas, top: headingEl.offsetTop + headingEl.clientHeight - 18, height: 16 });
        return;
      }
    }
    const text = block.content || '';
    const plain = stripMarkdown(text);
    const safeIdx = Math.min(index, plain.length);
    const sub = plain.slice(0, safeIdx);
    const meas = measureText(sub, el);
    const avgChar = meas / (safeIdx || 1);
    const charsPerLine = Math.max(10, Math.floor(el.clientWidth / Math.max(6, avgChar)));
    const line = Math.floor(safeIdx / charsPerLine);
    const lineCharStart = line * charsPerLine;
    const inLineSub = plain.slice(lineCharStart, safeIdx);
    const inLineWidth = measureText(inLineSub, el);
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
    setPos({ left: el.offsetLeft + 16 + inLineWidth, top: el.offsetTop + 8 + line * lineHeight, height: lineHeight });
  }, [block.title, block.content, field, index]);
  return (
    <div ref={containerRef} style={{ position: 'absolute', pointerEvents: 'none', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: pos.left,
          top: pos.top,
          width: 1,
          height: pos.height,
          background: 'black',
          animation: 'blink 1s step-start infinite',
        }}
      />
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
};

// Helpers
function stripMarkdown(src: string): string {
  return src
    .replace(/`[^`]*`/g, '')
    .replace(/\*\*|__|[*_~`>#-]/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\|/g, '');
}
let _measureCanvas: HTMLCanvasElement | null = null;
function measureText(text: string, refEl: HTMLElement): number {
  if (!_measureCanvas) _measureCanvas = document.createElement('canvas');
  const ctx = _measureCanvas.getContext('2d');
  if (!ctx) return 0;
  const style = getComputedStyle(refEl);
  ctx.font = `${style.fontWeight || 400} ${style.fontSize || '14px'} ${style.fontFamily || 'sans-serif'}`;
  return ctx.measureText(text).width;
}
