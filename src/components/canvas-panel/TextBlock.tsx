import React from 'react';
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
        className="font-bold text-lg cursor-grab active:cursor-grabbing select-none"
        draggable
        data-block-id={block.id}
        data-block-heading="true"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
  onMouseDown={(e) => { e.stopPropagation(); onSelectElement && onSelectElement(block.id,'text','title'); }}
  onClick={(e) => { e.stopPropagation(); /* click retained for a11y, selection already set on mousedown */ }}
      >
        {typeof block.title === 'string' ? block.title : ''}
      </div>
      <div 
        style={contentStyle} 
        className="prose max-w-none"
        data-block-content="true"
        onClick={(e) => { e.stopPropagation(); onSelectElement && onSelectElement(block.id,'text','content'); }}
      >
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
      </div>
    </>
  );
}
