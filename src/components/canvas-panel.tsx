import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from '@/lib/store';
import type { LayoutSelection, TextBlock, ImageElement, SectionStyles } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { Theme } from '@/lib/themes';
import { horizontalLineLibrary, resolveThemedLine } from '@/lib/horizontalLines';
import HorizontalLine from '@/components/ui/HorizontalLine';
import { CSSProperties, useState } from 'react';
import { useEffect } from 'react';
import { Image as ImageIcon, ZoomIn, ZoomOut } from 'lucide-react';
import { Rnd } from 'react-rnd';
import { Button } from '@/components/ui/button';
import { UI_CONSTANTS } from '@/lib/ui-constants';

interface CanvasPanelProps {
  title: string;
  date: string;
  textBlocks: TextBlock[];
  images: ImageElement[];
  layoutSelection: LayoutSelection;
  onSelectElement: (id: string | null, type?: 'text' | 'image' | 'horizontalLine') => void;
  selectedElement: { id: string; type: 'text' | 'image' | 'horizontalLine' } | null;
  sectionStyles: SectionStyles;
  theme: Theme;
  onUpdateImage: (id: string, newProps: Partial<ImageElement>) => void;
}

const TextBlockComponent = ({ block, style, themeStyle, denseMode }: { block: TextBlock, style: SectionStyles[string], themeStyle: Theme['styles']['section'], denseMode: boolean }) => {
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
                  marginTop: denseMode ? '0.125rem' : '0.25rem',
                  marginBottom: denseMode ? '0.125rem' : '0.25rem',
                  paddingLeft: '1rem', // narrower than default prose (~1.5em)
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
                  paddingLeft: '0.15rem', // slight to align bullet text
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
          }}
        >
          {typeof block.content === 'string' ? block.content : ''}
        </ReactMarkdown>
      </div>
    </>
  );
};

export function CanvasPanel({ title, date, textBlocks, images, layoutSelection, onSelectElement, selectedElement, sectionStyles, theme, onUpdateImage }: CanvasPanelProps) {
  const horizontalLines = useStore(state => state.horizontalLines);
  const updateHorizontalLine = useStore(state => state.updateHorizontalLine);
  const denseMode = useStore(state => state.denseMode);
  const [zoom, setZoom] = useState(1);
  const { base, variant } = layoutSelection;
  const { swapTextBlocks } = useStore.getState();

  // Helper function to get the effective color for a horizontal line
  const getEffectiveLineColor = (line: import('@/lib/types').HorizontalLineElement) => {
    // Find the library item for this line
    const libItem = horizontalLineLibrary.find(item => {
      if (line.style === 'clipart' && line.clipartSrc) {
        return item.preview === line.clipartSrc;
      }
      if (line.style === 'dashed') return item.id === 'classic-dashed';
      if (line.style === 'dotted') return item.id === 'classic-dotted';
      if (line.style === 'shadow') return item.id === 'shadow';
      if (line.style === 'solid') return item.id === 'classic-solid';
      return false;
    });
    
    // If color is not customizable and has a default color, use that
    if (libItem?.colorCustomizable === false && libItem.defaultColor) {
      return libItem.defaultColor;
    }
    
    // Otherwise use the line's color
    return line.color;
  };

  // Apply layout variant suggested alignment overrides (non-destructive):
  const effectiveTitleAlign = variant.titleAlign || theme.styles.title.textAlign || 'left';
  const effectiveDateAlign = variant.dateAlign || theme.styles.date.textAlign || 'left';

  // Future: auto-generate decorative horizontal lines from variant.decorations
  // For now we only compute them (id + position) so editor could later materialize.
  const autoDecorationDescriptors = (variant.decorations || []).map((d: NonNullable<typeof variant.decorations>[number]) => {
    const lineStyle = d.lineId === 'themed' ? resolveThemedLine(theme.name) : horizontalLineLibrary.find(l => l.id === d.lineId);
    return { ...d, resolved: lineStyle?.id };
  });

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
        // Do not delete page-level title/date, but allow deletions of supported element types
        if (selectedElement.type === 'text' || selectedElement.type === 'image' || selectedElement.type === 'horizontalLine') {
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
  // Apply variant alignment override (variant wins over theme)
  const titleStyle: CSSProperties = { gridArea: 'title', fontFamily: theme.styles.title.fontFamily, color: theme.styles.title.color, textAlign: variant.titleAlign || theme.styles.title.textAlign || 'center' };
  const dateStyle: CSSProperties = { gridArea: 'date', fontFamily: theme.styles.date.fontFamily, color: theme.styles.date.color, textAlign: variant.dateAlign || theme.styles.date.textAlign || 'center' };

  // Refine auto-generated decorative line placement after first render using DOM measurements
  useEffect(() => {
    const state = useStore.getState();
    const lines = state.horizontalLines.filter(l => l.autoGenerated);
    if (!lines.length) return;
    const container = document.getElementById('newsletter-canvas');
    if (!container) return;
    const titleEl = container.querySelector('h1[style]');
    const dateEl = container.querySelector('p[style]');
    const sectionEls = Array.from(container.querySelectorAll('[data-block-id]')).map(el => el as HTMLElement);
    const contRect = container.getBoundingClientRect();
    const updates: { id: string; y: number; x?: number; width?: number }[] = [];
    const titleAlign = variant.titleAlign || theme.styles.title.textAlign || 'left';
    const dateAlign = variant.dateAlign || theme.styles.date.textAlign || 'left';
    const paddingBelow = 8;
    const computeAlignedXWidth = (rect: DOMRect, align: string) => {
      // Base desired width relative to rect width
      const maxWidth = rect.width * (align === 'center' ? 0.7 : 0.6);
      const clampedWidth = Math.min(Math.max(180, maxWidth), rect.width); // width range
      let x = rect.left - contRect.left; // left aligned baseline
      if (align === 'center') {
        x = rect.left - contRect.left + (rect.width - clampedWidth) / 2;
      } else if (align === 'right') {
        x = rect.left - contRect.left + rect.width - clampedWidth;
      }
      return { x, width: clampedWidth };
    };
    lines.forEach(line => {
      if (!line.decorationKey) return;
      const parts = line.decorationKey.split(':');
      const position = parts[2]; // layoutId:variant:position:sectionIndex
      const sectionIndexStr = parts[3];
      if (position === 'afterTitle' && titleEl) {
        const rect = titleEl.getBoundingClientRect();
        const y = rect.bottom - contRect.top + paddingBelow;
        const { x, width } = computeAlignedXWidth(rect, titleAlign);
        if (Math.abs(y - line.y) > 2 || Math.abs(x - line.x) > 2 || (typeof line.width === 'number' && Math.abs(width - line.width) > 4)) {
          updates.push({ id: line.id, y, x, width });
        }
      } else if (position === 'afterDate' && dateEl) {
        const rect = dateEl.getBoundingClientRect();
        const y = rect.bottom - contRect.top + paddingBelow;
        const { x, width } = computeAlignedXWidth(rect, dateAlign);
        if (Math.abs(y - line.y) > 2 || Math.abs(x - line.x) > 2 || (typeof line.width === 'number' && Math.abs(width - line.width) > 4)) {
          updates.push({ id: line.id, y, x, width });
        }
      } else if (position === 'beforeSections' && sectionEls[0]) {
        const rect = sectionEls[0].getBoundingClientRect();
        const y = rect.top - contRect.top - 16;
        if (Math.abs(y - line.y) > 2) updates.push({ id: line.id, y });
      } else if (position === 'afterSections' && sectionEls.length) {
        const last = sectionEls[sectionEls.length - 1];
        const rect = last.getBoundingClientRect();
        const y = rect.bottom - contRect.top + 16;
        if (Math.abs(y - line.y) > 2) updates.push({ id: line.id, y });
      } else if (position === 'afterSection' && sectionIndexStr) {
        const idx = parseInt(sectionIndexStr, 10);
        if (!isNaN(idx) && sectionEls[idx]) {
          const rect = sectionEls[idx].getBoundingClientRect();
          const y = rect.bottom - contRect.top + paddingBelow;
          if (Math.abs(y - line.y) > 2) updates.push({ id: line.id, y });
        }
      }
    });
    if (updates.length) {
      updates.forEach(u => state.updateHorizontalLine(u.id, { y: u.y, ...(u.x != null ? { x: u.x } : {}), ...(u.width != null ? { width: u.width } : {}) }));
    }
  }, [variant.name, variant.titleAlign, variant.dateAlign, theme.styles.title.textAlign, theme.styles.date.textAlign, textBlocks.map(b => b.id + (b.title || '') + (b.content || '')).join('|')]);

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

        {/* Absolutely positioned horizontal lines (not part of grid flow) */}
        {horizontalLines.map(line => {
          const widthNumber = typeof line.width === 'number' ? line.width : 400;
          const lineHeight = line.height || (line.style === 'clipart' ? 24 : line.thickness + 8);
          const effectiveColor = getEffectiveLineColor(line);
          
          return (
            <Rnd
              key={line.id}
              size={{ width: widthNumber, height: lineHeight }}
              position={{ x: line.x, y: line.y }}
              scale={zoom}
              bounds="parent"
              enableResizing={{ top:false, bottom:false, left:true, right:true, topLeft:false, topRight:false, bottomLeft:false, bottomRight:false }}
              disableDragging={!!line.locked}
              onDragStop={(e, d) => { if (!line.locked) updateHorizontalLine(line.id, { x: d.x, y: d.y }); }}
              onResizeStop={(e, direction, ref, delta, position) => {
                if (!line.locked) updateHorizontalLine(line.id, { width: parseInt(ref.style.width, 10), x: position.x });
              }}
              onMouseDown={(e) => { e.stopPropagation(); onSelectElement(line.id, 'horizontalLine'); }}
              // Prevent click bubbling to canvas container which clears selection
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); }}
              className={cn('z-20 flex items-center justify-center', { [UI_CONSTANTS.selection]: selectedElement?.id === line.id && selectedElement?.type === 'horizontalLine' })}
            >
              <div style={{ width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HorizontalLine
                  color={effectiveColor}
                  thickness={line.thickness}
                  style={line.style}
                  width={'100%'}
                  height={line.height}
                  clipartSrc={line.clipartSrc}
                />
              </div>
              {/* Resize handle indicator (right) - only show when selected */}
              {selectedElement?.id === line.id && selectedElement?.type === 'horizontalLine' && !line.locked && (
                <div style={{ position:'absolute', right:-6, top:'50%', transform:'translateY(-50%)', width:12, height:12, background:'#fff', border:'1px solid #999', borderRadius:2, pointerEvents:'none' }} />
              )}
              {selectedElement?.id === line.id && selectedElement?.type === 'horizontalLine' && line.locked && (
                <span style={{ position: 'absolute', top: 2, right: 2, background: '#fff', borderRadius: '50%', padding: 2, zIndex: 30, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} title="Locked">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
              )}
            </Rnd>
          );
        })}
        
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
            <div key={block.id} style={sectionContainerStyle} onClick={(e) => { e.stopPropagation(); onSelectElement(block.id, 'text'); }} className={cn("cursor-pointer relative z-10", { [UI_CONSTANTS.selection]: selectedElement?.id === block.id })}>
              <TextBlockComponent block={block} style={userStyle} themeStyle={themeStyle} denseMode={denseMode} />
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
            disableDragging={!!image.locked}
            enableResizing={!image.locked}
            onMouseDown={(e) => { e.stopPropagation(); onSelectElement(image.id, 'image'); }}
            onDragStart={(e) => { e.stopPropagation(); /* avoid state changes here to prevent jump */ }}
            onDragStop={(e, d) => { if (!image.locked) onUpdateImage(image.id, { x: d.x, y: d.y }); }}
            onResizeStop={(e, direction, ref, delta, position) => {
              if (!image.locked) onUpdateImage(image.id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...position });
            }}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); }}
            className={cn("overflow-hidden relative", { [UI_CONSTANTS.selection]: selectedElement?.id === image.id })}>
            <div style={{position:'relative', width:'100%', height:'100%'}}>
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
              {/* Lock icon overlay - only show when selected */}
              {selectedElement?.id === image.id && selectedElement?.type === 'image' && image.locked && (
                <span style={{ position: 'absolute', top: 4, right: 4, background: '#fff', borderRadius: '50%', padding: 2, zIndex: 30, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} title="Locked">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
              )}
            </div>
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