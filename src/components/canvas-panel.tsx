import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LayoutSelection } from '@/lib/store';
import { cn } from '@/lib/utils';
import { TextBlock, ImageElement, SectionStyles } from '@/lib/store';
import { Theme } from '@/lib/themes';
import { CSSProperties, useState } from 'react';
import { useEffect } from 'react';
import { Image as ImageIcon, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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
  const tableAltBg = style.backgroundColor || themeStyle.backgroundColor ? undefined : undefined; // placeholder if we add zebra later

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
            table: ({node, ...props}) => (
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
            thead: ({node, ...props}) => (
              <thead {...props} style={{ backgroundColor: tableHeaderBg, color: tableHeaderColor }} />
            ),
            th: ({node, ...props}) => (
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
            td: ({node, ...props}) => (
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
  const { swapTextBlocks } = require('@/lib/store').useStore.getState();

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
    const handler = (e: any) => {
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
    position: 'relative',
    width: '100%',
    height: '100%',
  };
  const titleStyle: CSSProperties = { gridArea: 'title', fontFamily: theme.styles.title.fontFamily, color: theme.styles.title.color };
  const dateStyle: CSSProperties = { gridArea: 'date', fontFamily: theme.styles.date.fontFamily, color: theme.styles.date.color };

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
        <h1 style={titleStyle} className="text-4xl font-bold text-center">{title}</h1>
        <p style={dateStyle} className="text-center text-muted-foreground">{date}</p>
        
        {textBlocks.map((block, index) => {
          const gridArea = `sec${index + 1}`;
          if (!gridArea) return null;
          const userStyle = sectionStyles[block.id] || {};
          const themeStyle = theme.styles.section;
          const sectionContainerStyle: CSSProperties = {
            gridArea,
            borderWidth: userStyle.borderWidth ? `${userStyle.borderWidth}px` : '1px',
            borderRadius: userStyle.borderRadius ? `${userStyle.borderRadius}px` : '0px',
            borderColor: userStyle.borderColor || (selectedElement?.id === block.id ? 'blue' : themeStyle.borderColor),
            borderStyle: 'solid',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: userStyle.backgroundColor || themeStyle.backgroundColor,
          };
          return (
            <div key={block.id} style={sectionContainerStyle} onClick={(e) => { e.stopPropagation(); onSelectElement(block.id, 'text'); }} className={cn("cursor-pointer", { "border-2 border-blue-500": selectedElement?.id === block.id })}>
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
        </div>
        </div>
      </div>
    </div>
  );
}