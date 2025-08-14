import React from 'react';
import { Rnd } from 'react-rnd';
import { cn } from '@/lib/utils';
import { UI_CONSTANTS } from '@/lib/ui-constants';
import { horizontalLineLibrary } from '@/lib/horizontalLines';
import HorizontalLine from '@/components/ui/HorizontalLine';
import type { HorizontalLineElement } from '@/lib/types';

interface HorizontalLinesLayerProps {
  horizontalLines: HorizontalLineElement[];
  selectedElement: { id: string; type: 'text' | 'image' | 'horizontalLine' | 'calendarDate' } | null;
  zoom: number;
  onSelectElement: (id: string, type: 'horizontalLine') => void;
  onUpdateHorizontalLine: (id: string, updates: Partial<HorizontalLineElement>) => void;
}

/**
 * Helper function to get the effective color for a horizontal line
 */
function getEffectiveLineColor(line: HorizontalLineElement): string {
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
}

/**
 * Horizontal lines layer component - renders all horizontal lines
 * Follows SRP by focusing only on horizontal line rendering and interactions
 */
export function HorizontalLinesLayer({
  horizontalLines,
  selectedElement,
  zoom,
  onSelectElement,
  onUpdateHorizontalLine,
}: HorizontalLinesLayerProps) {
  return (
    <>
      {horizontalLines.map(line => {
        const widthNumber = typeof line.width === 'number' ? line.width : 400;
        const lineHeight = line.height || (line.style === 'clipart' ? 24 : line.thickness + 8);
        const effectiveColor = getEffectiveLineColor(line);
        const isSelected = selectedElement?.id === line.id && selectedElement?.type === 'horizontalLine';
        
        return (
          <Rnd
            key={line.id}
            size={{ width: widthNumber, height: lineHeight }}
            position={{ x: line.x, y: line.y }}
            scale={zoom}
            bounds="parent"
            enableResizing={{ 
              top: false, 
              bottom: false, 
              left: true, 
              right: true, 
              topLeft: false, 
              topRight: false, 
              bottomLeft: false, 
              bottomRight: false 
            }}
            disableDragging={!!line.locked}
            onDragStop={(e, d) => {
              if (!line.locked) {
                onUpdateHorizontalLine(line.id, { x: d.x, y: d.y });
              }
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              if (!line.locked) {
                onUpdateHorizontalLine(line.id, { 
                  width: parseInt(ref.style.width, 10), 
                  x: position.x 
                });
              }
            }}
            onMouseDown={(e) => { 
              e.stopPropagation(); 
              onSelectElement(line.id, 'horizontalLine'); 
            }}
            onClick={(e: React.MouseEvent) => { 
              e.stopPropagation(); 
            }}
            className={cn('z-20 flex items-center justify-center', {
              [UI_CONSTANTS.selection]: isSelected
            })}
          >
            <div style={{ 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
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
            {isSelected && !line.locked && (
              <div style={{ 
                position: 'absolute', 
                right: -6, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: 12, 
                height: 12, 
                background: '#fff', 
                border: '1px solid #999', 
                borderRadius: 2, 
                pointerEvents: 'none' 
              }} />
            )}
            
            {/* Lock icon - only show when selected and locked */}
            {isSelected && line.locked && (
              <span style={{ 
                position: 'absolute', 
                top: 2, 
                right: 2, 
                background: '#fff', 
                borderRadius: '50%', 
                padding: 2, 
                zIndex: 30, 
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)' 
              }} title="Locked">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
            )}
          </Rnd>
        );
      })}
    </>
  );
}
