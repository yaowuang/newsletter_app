import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store/index';
import type { LayoutSelection, TextBlock, ImageElement, SectionStyles } from '@/features/newsletter/types';
import type { Theme } from '@/lib/themes';
import { CSSProperties } from 'react';
import { updateHorizontalLinePositions } from '@/features/newsletter/components/utils/positionUtils';

// Component imports
import { PageBackground } from '@/features/newsletter/components/PageBackground';
import { NewsletterHeader } from '@/features/newsletter/components/NewsletterHeader';
import { SectionsContainer } from '@/features/newsletter/components/SectionsContainer';
import { HorizontalLinesLayer } from '@/features/newsletter/components/HorizontalLinesLayer';
import { ImagesLayer } from '@/features/newsletter/components/ImagesLayer';
import { Watermark } from './Watermark';
import { ZoomControlsComponent } from './ZoomControls';
import CalendarGrid from '@/features/calendar/components/CalendarGrid';

interface CanvasPanelProps {
  title: string;
  date: string;
  textBlocks: TextBlock[];
  images: ImageElement[];
  layoutSelection: LayoutSelection;
  onSelectElement: (id: string | null, type?: 'text' | 'image' | 'horizontalLine' | 'calendarDate', subType?: 'title' | 'content') => void;
  selectedElement: { id: string; type: 'text' | 'image' | 'horizontalLine' | 'calendarDate'; subType?: 'title' | 'content' } | null;
  sectionStyles: SectionStyles;
  theme: Theme;
  onUpdateImage: (id: string, newProps: Partial<ImageElement>) => void;
}

/**
 * Main canvas panel component - orchestrates the newsletter rendering
 * Refactored to follow SOLID principles:
 * - Single Responsibility: Each component has one clear purpose
 * - Open/Closed: Easy to extend with new element types
 * - Liskov Substitution: Components can be swapped with compatible implementations
 * - Interface Segregation: Smaller, focused interfaces
 * - Dependency Inversion: Depends on abstractions (hooks, utilities)
 */
export function CanvasPanel({
  title,
  date,
  textBlocks,
  images,
  layoutSelection,
  onSelectElement,
  selectedElement,
  sectionStyles,
  theme,
  onUpdateImage,
}: CanvasPanelProps) {
  // Debug hook to help troubleshoot layout issues
  
  // Store dependencies
  const horizontalLines = useStore(state => state.horizontalLines);
  const updateHorizontalLine = useStore(state => state.updateHorizontalLine);
  const denseMode = useStore(state => state.denseMode);
  const { swapTextBlocks } = useStore.getState();

  // Zoom functionality
  const [zoom, setZoom] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 2));
  }, []);
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  }, []);
  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  // Auto-adjust zoom & centering when switching to / from calendar layout
  useEffect(() => {
    const isCalendar = layoutSelection.base.type === 'calendar';
    if (isCalendar) {
      // Set to 75% zoom specifically for calendar for better overview
      setZoom(prev => (prev !== 0.75 ? 0.75 : prev));
      // Center after next paint to ensure dimensions available
      requestAnimationFrame(() => {
        const sc = scrollContainerRef.current;
        const canvasEl = sc?.querySelector('#newsletter-canvas')?.parentElement as HTMLDivElement | null;
        if (sc && canvasEl) {
          const targetScrollLeft = Math.max(0, (canvasEl.scrollWidth - sc.clientWidth) / 2);
          const targetScrollTop = Math.max(0, (canvasEl.scrollHeight - sc.clientHeight) / 2);
          sc.scrollTo({ left: targetScrollLeft, top: targetScrollTop, behavior: 'smooth' });
        }
      });
    }
  }, [layoutSelection]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null;
      
      // Don't handle shortcuts when user is typing in input fields
      if (activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.isContentEditable
      )) {
        return;
      }

  if ((e.key === 'Delete') && selectedElement?.id) {
        // Only delete supported element types
        if (['text', 'image', 'horizontalLine'].includes(selectedElement.type)) {
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('delete-element', { detail: selectedElement }));
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement]);

  // Text block swapping
  useEffect(() => {
    const handleSwapEvent = (event: CustomEvent) => {
      const { sourceId, targetId } = event.detail || {};
      if (sourceId && targetId) {
        swapTextBlocks(sourceId, targetId);
      }
    };

    window.addEventListener('swap-text-blocks', handleSwapEvent as EventListener);
    return () => window.removeEventListener('swap-text-blocks', handleSwapEvent as EventListener);
  }, [swapTextBlocks]);

  // Update horizontal line positions based on layout (not DOM measurements)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateHorizontalLinePositions(
        horizontalLines,
        layoutSelection,
        updateHorizontalLine
      );
    }, 50); // Small delay to ensure state is updated

    return () => clearTimeout(timer);
  }, [layoutSelection, horizontalLines, updateHorizontalLine]);

  // Layout and styling
  const { base, variant } = layoutSelection;
  const isCalendarLayout = base.type === 'calendar';
  const isLandscape = variant.orientation === 'landscape' || base.orientation === 'landscape';

  const pageStyle: CSSProperties = {
    display: 'grid',
    gridTemplateAreas: base.gridTemplateAreas,
    gridTemplateColumns: variant.gridTemplateColumns,
    gridTemplateRows: variant.gridTemplateRows,
    rowGap: denseMode ? '12px' : '24px',
    columnGap: denseMode ? '12px' : '24px',
    backgroundColor: theme.styles.page.backgroundColor,
    position: 'relative',
    width: '100%',
    height: '100%',
  };

  // Adjust canvas dimensions for landscape orientation
  const canvasWidth = isLandscape ? '11in' : '8.5in';
  const canvasHeight = isLandscape ? '8.5in' : '11in';
  const canvasWidthPx = isLandscape ? 11 * 96 : 8.5 * 96;
  const canvasHeightPx = isLandscape ? 8.5 * 96 : 11 * 96;

  const canvasStyle = {
    minWidth: canvasWidth,
    minHeight: canvasHeight,
    transform: `scale(${zoom})`,
    marginBottom: zoom < 1 ? 0 : `${(zoom - 1) * canvasHeightPx}px`,
  };

  const handleCanvasClick = () => onSelectElement(null);

  return (
    <div className="relative h-full bg-gray-100 dark:bg-gray-800">
      {/* Zoom Controls */}
      <ZoomControlsComponent 
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />

      {/* Scrollable Canvas Container */}
  <div ref={scrollContainerRef} className="h-full overflow-auto p-8" onClick={handleCanvasClick}>
        <div 
          className="mx-auto shadow-lg bg-white origin-top" 
          style={{
            width: canvasWidth,
            height: canvasHeight,
            ...canvasStyle
          }}
        >
          <div 
            id="newsletter-canvas" 
            className="w-full h-full p-8 outline-none" 
            style={pageStyle}
            tabIndex={-1}
          >
            {/* Background Layer */}
            <PageBackground theme={theme} />

            {/* Header Layer - Only show for newsletter layouts */}
            {!isCalendarLayout && (
              <NewsletterHeader
                title={title}
                date={date}
                theme={theme}
                denseMode={denseMode}
              />
            )}

            {/* Calendar Layer - Only for calendar layouts */}
            {isCalendarLayout && (
              <div style={{ gridArea: 'calendar', position: 'relative' }}>
                <CalendarGrid
                  containerWidth={canvasWidthPx - 64} // Subtract padding
                  containerHeight={canvasHeightPx - 64} // No header space needed
                  onSelectElement={onSelectElement}
                />
              </div>
            )}

            {/* Horizontal Lines Layer */}
            <HorizontalLinesLayer
              horizontalLines={horizontalLines}
              selectedElement={selectedElement}
              zoom={zoom}
              onSelectElement={onSelectElement}
              onUpdateHorizontalLine={updateHorizontalLine}
            />

            {/* Text Sections Layer - Only for newsletter layouts */}
            {!isCalendarLayout && (
              <SectionsContainer
                textBlocks={textBlocks}
                sectionStyles={sectionStyles}
                theme={theme}
                denseMode={denseMode}
                selectedElement={selectedElement}
                onSelectElement={onSelectElement}
                layoutSelection={layoutSelection}
              />
            )}

            {/* Images Layer */}
            <ImagesLayer
              images={images}
              selectedElement={selectedElement}
              zoom={zoom}
              onSelectElement={onSelectElement}
              onUpdateImage={onUpdateImage}
            />

            {/* Watermark */}
            <Watermark theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanvasPanel;