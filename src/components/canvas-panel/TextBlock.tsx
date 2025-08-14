import React from 'react';
import { MarkdownModalEditor } from '@/components/common/MarkdownModalEditor';
import { useStore } from '@/lib/store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CSSProperties } from 'react';
import type { TextBlock, SectionStyles } from '@/lib/types';
import type { Theme } from '@/lib/themes';

interface TextBlockProps {
  block: TextBlock;
  style: SectionStyles[string];
  themeStyle: Theme['styles']['section'];
  denseMode: boolean;
  onSelectElement?: (id: string, type: 'text', subType?: 'title' | 'content') => void;
}

/**
 * Text block component - renders a single text block with markdown support
 * Follows SRP by focusing only on text block rendering
 */
export function TextBlock({ block, style, themeStyle, denseMode, onSelectElement }: TextBlockProps) {
  const editingCaret = useStore(s => s.editingCaret);
  const updateTextBlock = useStore(s => s.updateTextBlock);
  const selectedElement = useStore(s => s.selectedElement);

  // Inline edit mode state
  const [editingField, setEditingField] = React.useState<null | 'title' | 'content'>(null);
  const [draftValue, setDraftValue] = React.useState('');
  const titleInputRef = React.useRef<HTMLInputElement | null>(null);
  const contentTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Check if this block is currently selected
  const isThisBlockSelected = selectedElement?.id === block.id && selectedElement?.type === 'text';

  // Handle keyboard input to start inline editing when this block is selected
  React.useEffect(() => {
    if (!isThisBlockSelected || block.locked || editingField) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null;
      
      // Don't handle if user is already typing in an input field
      if (activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.isContentEditable
      )) {
        return;
      }

      // Don't handle shortcuts or special keys
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      
      const isPrintable = e.key.length === 1;
      const isBackspace = e.key === 'Backspace';
      const isEnter = e.key === 'Enter';
      
      if (!isPrintable && !isBackspace && !isEnter) return;

      // Determine which field to edit based on selection subType or content state
      let targetField: 'title' | 'content';
      if (selectedElement?.subType === 'title') {
        targetField = 'title';
      } else if (selectedElement?.subType === 'content') {
        targetField = 'content';
      } else {
        // Default: if title is empty, edit title; otherwise edit content
        targetField = (!block.title || block.title.trim() === '') ? 'title' : 'content';
      }

      // Start editing and handle the initial keystroke
      e.preventDefault();
      const currentValue = targetField === 'title' ? (block.title || '') : (block.content || '');
      setOriginalValue(currentValue); // Store original value for cancel functionality
      let newValue = currentValue;
      
      if (isBackspace) {
        newValue = currentValue.slice(0, -1);
      } else if (isEnter && targetField === 'content') {
        newValue = currentValue + '\n';
      } else if (isPrintable) {
        newValue = currentValue + e.key;
      }

      // Begin editing with the updated value
      setEditingField(targetField);
      setDraftValue(newValue);
      
      // Focus the appropriate input after it mounts
      requestAnimationFrame(() => {
        const inputRef = targetField === 'title' ? titleInputRef : contentTextareaRef;
        if (inputRef.current) {
          inputRef.current.focus();
          // Place cursor at the end
          const length = newValue.length;
          inputRef.current.selectionStart = length;
          inputRef.current.selectionEnd = length;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isThisBlockSelected, block.locked, editingField, selectedElement?.subType, block.title, block.content]);

  // Store original values to enable proper cancel functionality
  const [originalValue, setOriginalValue] = React.useState('');

  const beginEdit = (field: 'title' | 'content') => {
    if (block.locked) return;
    const currentValue = field === 'title' ? (block.title || '') : (block.content || '');
    setOriginalValue(currentValue);
    setEditingField(field);
    setDraftValue(currentValue);
    // Delay focus to next paint
    requestAnimationFrame(() => {
      if (field === 'title' && titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.selectionStart = titleInputRef.current.selectionEnd = titleInputRef.current.value.length;
      } else if (field === 'content' && contentTextareaRef.current) {
        contentTextareaRef.current.focus();
        contentTextareaRef.current.selectionStart = contentTextareaRef.current.selectionEnd = contentTextareaRef.current.value.length;
      }
    });
  };

  const commitEdit = () => {
    if (!editingField) return;
    // Final commit - the store was already updated in real-time, so just exit editing mode
    setEditingField(null);
    // Clear selection to prevent inspector auto-focus
    if (onSelectElement) {
      onSelectElement(block.id, 'text'); // Select without subType to avoid auto-focus
    }
    // Focus the canvas container to prevent inspector from taking focus
    requestAnimationFrame(() => {
      const canvasElement = document.getElementById('newsletter-canvas');
      if (canvasElement) {
        canvasElement.focus();
      }
    });
  };
  
  const cancelEdit = () => {
    if (!editingField) return;
    // Revert to original value
    if (editingField === 'title') {
      updateTextBlock(block.id, 'title', originalValue);
    } else {
      updateTextBlock(block.id, 'content', originalValue);
    }
    setEditingField(null);
    // Clear selection to prevent inspector auto-focus
    if (onSelectElement) {
      onSelectElement(block.id, 'text'); // Select without subType to avoid auto-focus
    }
    // Focus the canvas container to prevent inspector from taking focus
    requestAnimationFrame(() => {
      const canvasElement = document.getElementById('newsletter-canvas');
      if (canvasElement) {
        canvasElement.focus();
      }
    });
  };

  // Update store in real-time as user types to keep inspector in sync
  const handleInputChange = (newValue: string) => {
    setDraftValue(newValue);
    if (editingField === 'title') {
      updateTextBlock(block.id, 'title', newValue);
    } else {
      updateTextBlock(block.id, 'content', newValue);
    }
  };
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
      const swapEvent = new CustomEvent('swap-text-blocks', { 
        detail: { sourceId, targetId } 
      });
      window.dispatchEvent(swapEvent);
    }
  };

  return (
    <>
      <div
        style={headingStyle}
        className={"font-bold text-lg select-none " + (editingField ? '' : 'cursor-grab active:cursor-grabbing')}
        draggable={!editingField}
        data-block-id={block.id}
        data-block-heading="true"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
  onMouseDown={(e) => { e.stopPropagation(); if (onSelectElement) { onSelectElement(block.id,'text','title'); } }}
        onDoubleClick={(e) => { e.stopPropagation(); beginEdit('title'); }}
        onClick={(e) => { e.stopPropagation(); }}
      >
  {editingField === 'title' ? (
          <div className="relative w-full">
            <input
              ref={titleInputRef}
              value={draftValue}
              onChange={e => handleInputChange(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                else if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
              }}
              data-inline-edit-block={block.id}
              className="w-full bg-white/80 dark:bg-zinc-800/80 outline-none border-2 border-blue-400/70 focus:border-blue-500 rounded-sm px-2 py-1 text-inherit font-inherit shadow-sm"
              aria-label="Edit section title"
              autoComplete="off"
              placeholder="Enter section title..."
            />
            {/* Keyboard hint */}
            <div className="absolute top-0 right-2 text-xs text-gray-500/70 font-mono pointer-events-none leading-tight">
              Enter: Save • Esc: Cancel
            </div>
          </div>
        ) : (
          typeof block.title === 'string' ? block.title : ''
        )}
      </div>
      <div
        style={contentStyle}
        className={"max-w-none cursor-text " + (editingField ? 'prose-disable' : 'prose')}
        data-block-content="true"
        onClick={e => {
          e.stopPropagation();
          if (editingField) return;
          // Always select this block's content on click
          if (onSelectElement) { onSelectElement(block.id, 'text', 'content'); }
        }}
        onDoubleClick={e => {
          e.stopPropagation();
          // Always start editing on double-click
          if (!editingField) {
            beginEdit('content');
            // After textarea mounts, set selection so store reflects editing block
            requestAnimationFrame(() => {
              if (onSelectElement) { onSelectElement(block.id, 'text', 'content'); }
            });
          }
        }}
      >
        {/* Synthetic caret for live preview */}
        {editingCaret && editingCaret.blockId === block.id && !editingField && (
          <CaretOverlay block={block} field={editingCaret.field} index={editingCaret.index} />
        )}
    {editingField === 'content' ? (
      <MarkdownModalEditor
        value={draftValue}
        onChange={handleInputChange}
        onAccept={commitEdit}
        onCancel={cancelEdit}
        label="Edit section content (Markdown)"
        placeholder="Enter Markdown content..."
      />
    ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ ...props}) => (
              <div className="overflow-x-auto">
                <table
                  {...props}
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.875rem',
                    backgroundColor: tableCellBg,
                  }}
                />
              </div>
            ),
            thead: ({ ...props}) => (
              <thead {...props} style={{ backgroundColor: tableHeaderBg, color: tableHeaderColor }} />
            ),
            th: ({ ...props}) => (
              <th
                {...props}
                style={{
                  border: `1px solid ${borderColor}`,
                  padding: '4px 6px',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontFamily: headingStyle.fontFamily,
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                }}
              />
            ),
            td: ({ ...props}) => (
              <td
                {...props}
                style={{
                  border: `1px solid ${borderColor}`,
                  padding: '4px 6px',
                  fontSize: '0.75rem',
                  lineHeight: 1.25,
                  backgroundColor: tableCellBg,
                }}
              />
            ),
            a: ({ ...props}) => (
              <a
                {...props}
                style={{
                  color: linkColor,
                  textDecoration: 'underline',
                }}
              />
            ),
            ul: ({ ...props}) => (
              <ul
                {...props}
                style={{
                  marginTop: denseMode ? '0.125rem' : '0.25rem',
                  marginBottom: denseMode ? '0.125rem' : '0.25rem',
                  paddingLeft: '1rem',
                  listStyleType: 'disc',
                }}
              />
            ),
            ol: ({ ...props}) => (
              <ol
                {...props}
                style={{
                  marginTop: denseMode ? '0.125rem' : '0.25rem',
                  marginBottom: denseMode ? '0.125rem' : '0.25rem',
                  paddingLeft: '1rem',
                  listStyleType: 'decimal',
                }}
              />
            ),
            li: ({ ...props}) => (
              <li
                {...props}
                style={{
                  marginTop: denseMode ? '0.05rem' : '0.125rem',
                  marginBottom: denseMode ? '0.05rem' : '0.125rem',
                  paddingLeft: '0.15rem',
                }}
              />
            ),
            p: ({ ...props}) => (
              <p
                {...props}
                style={{
                  marginTop: denseMode ? '0.25rem' : '0.5rem',
                  marginBottom: denseMode ? '0.25rem' : '0.5rem',
                }}
              />
            ),
            hr: ({ ...props}) => (
              <hr
                {...props}
                style={{
                  borderTop: `1px solid ${borderColor}`,
                  margin: denseMode ? '0.5rem 0' : '1rem 0',
                  width: '100%',
                }}
              />
            ),
          }}
        >
          {typeof block.content === 'string' ? block.content : ''}
        </ReactMarkdown>
        )}
      </div>
    </>
  );
}

// Lightweight caret overlay (approximate). For content, we place caret at start of block plus measured width of substring.
// This avoids parsing markdown; we strip markdown syntax for width approximation.
const CaretOverlay: React.FC<{ block: TextBlock; field: 'title' | 'content'; index: number }> = ({ block, field, index }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ left: number; top: number; height: number }>({ left: 0, top: 0, height: 16 });

  React.useEffect(() => {
    const el = containerRef.current?.parentElement; // content container
    if (!el) return;
    // For title caret we anchor in heading (previous sibling)
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
    // Content caret approximation
    const text = block.content || '';
    const plain = stripMarkdown(text);
    const safeIdx = Math.min(index, plain.length);
    const sub = plain.slice(0, safeIdx);
    const meas = measureText(sub, el);
    // Rough line wrapping: assume font-size ~12-14px, width el.clientWidth; compute lines
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
          animation: 'blink 1s step-start infinite'
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
