import React, { useState, useCallback, useEffect } from 'react';
import { useStore } from '@/lib/store';
import type { LayoutSelection, TextBlock, ImageElement, SectionStyles } from '@/lib/types';
import type { Theme } from '@/lib/themes';
import { CSSProperties } from 'react';
import { updateHorizontalLinePositions } from './utils/positionUtils';

// Component imports
import { ZoomControlsComponent } from './ZoomControls';
import { PageBackground } from './PageBackground';
import { NewsletterHeader } from './NewsletterHeader';
import { SectionsContainer } from './SectionsContainer';
import { HorizontalLinesLayer } from './HorizontalLinesLayer';
import { ImagesLayer } from './ImagesLayer';
import { Watermark } from './Watermark';

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
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 2));
  }, []);
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  }, []);
  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

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

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement?.id) {
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

  const canvasStyle = {
    minWidth: '8.5in',
    minHeight: '11in',
    transform: `scale(${zoom})`,
    marginBottom: zoom < 1 ? 0 : `${(zoom - 1) * 11 * 96}px`, // 96px per inch
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
      <div className="h-full overflow-auto p-8" onClick={handleCanvasClick}>
        <div 
          className="mx-auto w-[8.5in] h-[11in] shadow-lg bg-white origin-top" 
          style={canvasStyle}
        >
          <div 
            id="newsletter-canvas" 
            className="w-full h-full p-8" 
            style={pageStyle}
          >
            {/* Background Layer */}
            <PageBackground theme={theme} />

            {/* Header Layer */}
            <NewsletterHeader
              title={title}
              date={date}
              theme={theme}
              denseMode={denseMode}
            />

            {/* Horizontal Lines Layer */}
            <HorizontalLinesLayer
              horizontalLines={horizontalLines}
              selectedElement={selectedElement}
              zoom={zoom}
              onSelectElement={onSelectElement}
              onUpdateHorizontalLine={updateHorizontalLine}
            />

            {/* Text Sections Layer */}
            <SectionsContainer
              textBlocks={textBlocks}
              sectionStyles={sectionStyles}
              theme={theme}
              denseMode={denseMode}
              selectedElement={selectedElement}
              onSelectElement={onSelectElement}
              layoutSelection={layoutSelection}
            />

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