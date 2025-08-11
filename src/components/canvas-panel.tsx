import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LayoutSelection, useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { TextBlock, ImageElement, SectionStyles } from '@/lib/store';
import { Theme } from '@/lib/themes';
import { CSSProperties, useState } from 'react';
import { useEffect } from 'react';
import { Image as ImageIcon, ZoomIn, ZoomOut } from 'lucide-react';
import { Rnd } from 'react-rnd';
import { Button } from '@/components/ui/button';

interface CanvasPanelProps {
  title: string;
  date: string;
  textBlocks: TextBlock[];
  images: ImageElement[];
  layoutSelection: LayoutSelection;
  onSelectElement: (id: string | null, type?: 'text' | 'image') => void;
  selectedElement: { id: string; type: 'text' | 'image' } | null;
  sectionStyles: SectionStyles;
  theme: Theme;
  onUpdateImage: (id: string, newProps: Partial<ImageElement>) => void;
}

const TextBlockComponent = ({ block, style, themeStyle }: { block: TextBlock, style: SectionStyles[string], themeStyle: Theme['styles']['section'] }) => {
  const headingStyle: CSSProperties = {
    color: style.headingColor || themeStyle.headingColor,
    backgroundColor: style.headingBackgroundColor || themeStyle.headingBackgroundColor,
    fontFamily: style.headingFontFamily || themeStyle.headingFontFamily,
    padding: '0.5rem 1rem',
    borderBottom: '1px solid',
    borderBottomColor: style.borderColor || themeStyle.borderColor,
  };
  const contentStyle: CSSProperties = {
    color: style.contentColor || themeStyle.contentColor,
    backgroundColor: style.backgroundColor || themeStyle.backgroundColor,
    fontFamily: style.fontFamily || style.contentFontFamily || themeStyle.contentFontFamily,
    padding: '0.5rem 1rem',
    flexGrow: 1,
    overflowY: 'auto',
  };
  const borderColor = style.borderColor || themeStyle.borderColor || '#ccc';
  const tableHeaderBg = style.headingBackgroundColor || themeStyle.headingBackgroundColor || '#f5f5f5';
  const tableHeaderColor = style.headingColor || themeStyle.headingColor || 'inherit';
  const tableCellBg = style.backgroundColor || themeStyle.backgroundColor || 'transparent';
  const linkColor = style.headingBackgroundColor || themeStyle.headingBackgroundColor; // new: link color based on section title background

  return (
    <>
      <div
        style={headingStyle}
        className="font-bold text-lg cursor-grab active:cursor-grabbing select-none"
        draggable
        data-block-id={block.id}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', block.id);
          // indicate swap operation
          e.dataTransfer.effectAllowed = 'move';
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          (e.currentTarget as HTMLElement).classList.add('ring-2','ring-blue-400');
        }}
        onDragLeave={(e) => {
          (e.currentTarget as HTMLElement).classList.remove('ring-2','ring-blue-400');
        }}
        onDrop={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).classList.remove('ring-2','ring-blue-400');
          const sourceId = e.dataTransfer.getData('text/plain');
          const targetId = block.id;
          if (sourceId && targetId && sourceId !== targetId) {
            const swapEvent = new CustomEvent('swap-text-blocks', { detail: { sourceId, targetId } });
            window.dispatchEvent(swapEvent);
          }
        }}
      >{typeof block.title === 'string' ? block.title : ''}</div>
      <div style={contentStyle} className="prose max-w-none">
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
            // Narrow list styles
            ul: ({ ...props}) => (
              <ul
                {...props}
                style={{
                  marginTop: '0.25rem',
                  marginBottom: '0.25rem',
                  paddingLeft: '1rem', // narrower than default prose (~1.5em)
                  listStyleType: 'disc',
                }}
              />
            ),
            ol: ({ ...props}) => (
              <ol
                {...props}
                style={{
                  marginTop: '0.25rem',
                  marginBottom: '0.25rem',
                  paddingLeft: '1rem',
                  listStyleType: 'decimal',
                }}
              />
            ),
            li: ({ ...props}) => (
              <li
                {...props}
                style={{
                  marginTop: '0.125rem',
                  marginBottom: '0.125rem',
                  paddingLeft: '0.15rem', // slight to align bullet text
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
};

export function CanvasPanel({ title, date, textBlocks, images, layoutSelection, onSelectElement, selectedElement, sectionStyles, theme, onUpdateImage }: CanvasPanelProps) {
  const [zoom, setZoom] = useState(1);
  const { base, variant } = layoutSelection;
  const { swapTextBlocks } = useStore.getState();

  // Helper to format date or ISO range into human-readable format
  const formatDisplayDate = (raw: string): string => {
    if (!raw) return '';
    // Month-only (YYYY-MM)
    if (/^\d{4}-\d{2}$/.test(raw)) {
      const [y,m] = raw.split('-').map(Number);
      const d = new Date(y, m-1, 1);
      return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);
    }
    // If already looks like a long month name, assume formatted
    if (/January|February|March|April|May|June|July|August|September|October|November|December/.test(raw)) return raw;
    const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const isoSingle = /^\d{4}-\d{2}-\d{2}$/;
    const isoRange = /^(\d{4}-\d{2}-\d{2})\s*(?:to|–|-)\s*(\d{4}-\d{2}-\d{2})$/; // supports separators
    if (isoSingle.test(raw)) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return fmt.format(d);
      return raw;
    }
    const rangeMatch = raw.match(isoRange);
    if (rangeMatch) {
      const start = new Date(rangeMatch[1]);
      const end = new Date(rangeMatch[2]);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        return `${fmt.format(start)} - ${fmt.format(end)}`;
      }
      return raw;
    }
    return raw; // fallback
  };
  const displayDate = formatDisplayDate(date);

  // Delete selected element on Delete or Backspace key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement && selectedElement.id) {
        // Do not delete page elements (title/date)
        if (selectedElement.type === 'text' || selectedElement.type === 'image') {
          // You may want to call a prop like onDeleteElement here
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('delete-element', { detail: selectedElement }));
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement]);
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { sourceId, targetId } = e.detail || {};
      if (sourceId && targetId) {
        swapTextBlocks(sourceId, targetId);
      }
    };
    window.addEventListener('swap-text-blocks', handler as EventListener);
    return () => window.removeEventListener('swap-text-blocks', handler as EventListener);
  }, [swapTextBlocks]);
  const pageStyle: CSSProperties = {
    display: 'grid',
    gridTemplateAreas: base.gridTemplateAreas,
    gridTemplateColumns: variant.gridTemplateColumns,
    gridTemplateRows: variant.gridTemplateRows,
    gap: '24px',
    backgroundColor: theme.styles.page.backgroundColor,
    // remove direct backgroundImage so we can control its opacity separately
    position: 'relative',
    width: '100%',
    height: '100%',
  };
  const titleStyle: CSSProperties = { gridArea: 'title', fontFamily: theme.styles.title.fontFamily, color: theme.styles.title.color, textAlign: theme.styles.title.textAlign || 'center' };
  const dateStyle: CSSProperties = { gridArea: 'date', fontFamily: theme.styles.date.fontFamily, color: theme.styles.date.color, textAlign: theme.styles.date.textAlign || 'center' };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="relative h-full bg-gray-100 dark:bg-gray-800">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 0.25}
          className="bg-white/80 backdrop-blur-sm"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetZoom}
          className="bg-white/80 backdrop-blur-sm min-w-[60px]"
        >
          {Math.round(zoom * 100)}%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 2}
          className="bg-white/80 backdrop-blur-sm"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Canvas Container */}
      <div className="h-full overflow-auto p-8" onClick={() => onSelectElement(null)}>
        <div 
          className="mx-auto w-[8.5in] h-[11in] shadow-lg bg-white origin-top" 
          style={{ 
            minWidth: '8.5in', 
            minHeight: '11in',
            transform: `scale(${zoom})`,
            marginBottom: zoom < 1 ? 0 : `${(zoom - 1) * 11 * 96}px`, // 96px per inch
          }}
        >
        <div id="newsletter-canvas" className="w-full h-full p-8" style={pageStyle}>
        {theme.styles.page.backgroundImage && (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: theme.styles.page.backgroundImage,
              backgroundSize: theme.styles.page.backgroundSize || 'cover',
              backgroundPosition: theme.styles.page.backgroundPosition || 'center',
              backgroundRepeat: theme.styles.page.backgroundRepeat || 'no-repeat',
              opacity: theme.styles.page.backgroundImageOpacity ?? 1,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}
        <h1 style={titleStyle} className="text-4xl font-bold relative z-10" >{title}</h1>
        <p style={dateStyle} className="text-muted-foreground relative z-10" >{displayDate}</p>
        
        {textBlocks.map((block, index) => {
          const gridArea = `sec${index + 1}`;
          if (!gridArea) return null;
          const userStyle = sectionStyles[block.id] || {};
          const themeStyle = theme.styles.section;
          const sectionContainerStyle: CSSProperties = {
            gridArea,
            borderWidth: userStyle.borderWidth ? `${userStyle.borderWidth}px` : '1px',
            borderRadius: userStyle.borderRadius != null ? `${userStyle.borderRadius}px` : (themeStyle.borderRadius != null ? `${themeStyle.borderRadius}px` : '0px'),
            borderColor: userStyle.borderColor || (selectedElement?.id === block.id ? 'blue' : themeStyle.borderColor),
            borderStyle: 'solid',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: userStyle.backgroundColor || themeStyle.backgroundColor,
          };
          return (
            <div key={block.id} style={sectionContainerStyle} onClick={(e) => { e.stopPropagation(); onSelectElement(block.id, 'text'); }} className={cn("cursor-pointer relative z-10", { "border-2 border-blue-500": selectedElement?.id === block.id })}>
              <TextBlockComponent block={block} style={userStyle} themeStyle={themeStyle} />
            </div>
          );
        })}

        {images.map(image => (
          <Rnd
            key={image.id}
            size={{ width: image.width, height: image.height }}
            position={{ x: image.x, y: image.y }}
            scale={zoom}
            style={{ zIndex: 10 }}
            onMouseDown={(e) => { e.stopPropagation(); onSelectElement(image.id, 'image'); }}
            onDragStart={(e) => { e.stopPropagation(); /* avoid state changes here to prevent jump */ }}
            onDragStop={(e, d) => { onUpdateImage(image.id, { x: d.x, y: d.y }); }}
            onResizeStop={(e, direction, ref, delta, position) => {
              onUpdateImage(image.id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...position });
            }}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); }}
            className={cn("overflow-hidden", { "border-2 border-blue-500": selectedElement?.id === image.id })}>
            {image.src ? (
              <img
                src={image.src}
                alt=""
                className="w-full h-full select-none pointer-events-none"
                style={{ objectFit: 'fill' }}
                draggable={false}
                onDragStart={(e) => { e.preventDefault(); }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-200 select-none">
                <ImageIcon className="h-8 w-8 text-gray-500" />
                <p className="text-xs text-gray-600">Upload Image</p>
              </div>
            )}
          </Rnd>
        ))}
        {/* Watermark */}
        <div
          className="pointer-events-none select-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-wide text-gray-400 opacity-60 z-10"
          style={{ letterSpacing: '0.1em', fontFamily: theme.styles.title.fontFamily }}
        >
          CREATED WITH ELEMENTARYSCHOOLNEWSLETTERS.COM
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}