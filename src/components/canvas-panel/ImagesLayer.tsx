import React from 'react';
import { Rnd } from 'react-rnd';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UI_CONSTANTS } from '@/lib/ui-constants';
import type { ImageElement } from '@/lib/types';

interface ImagesLayerProps {
  images: ImageElement[];
  selectedElement: { id: string; type: 'text' | 'image' | 'horizontalLine' | 'calendarDate' } | null;
  zoom: number;
  onSelectElement: (id: string, type: 'image') => void;
  onUpdateImage: (id: string, newProps: Partial<ImageElement>) => void;
}

/**
 * Images layer component - renders all images
 * Follows SRP by focusing only on image rendering and interactions
 */
export function ImagesLayer({
  images,
  selectedElement,
  zoom,
  onSelectElement,
  onUpdateImage,
}: ImagesLayerProps) {
  return (
    <>
      {images.map(image => {
        const isSelected = selectedElement?.id === image.id && selectedElement?.type === 'image';
        
        return (
          <Rnd
            key={image.id}
            size={{ width: image.width, height: image.height }}
            position={{ x: image.x, y: image.y }}
            scale={zoom}
            style={{ zIndex: 10 }}
            disableDragging={!!image.locked}
            enableResizing={!image.locked}
            onMouseDown={(e) => { 
              e.stopPropagation(); 
              onSelectElement(image.id, 'image'); 
            }}
            onDragStart={(e) => { 
              e.stopPropagation(); 
            }}
            onDragStop={(e, d) => { 
              if (!image.locked) {
                onUpdateImage(image.id, { x: d.x, y: d.y }); 
              }
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              if (!image.locked) {
                onUpdateImage(image.id, { 
                  width: parseInt(ref.style.width), 
                  height: parseInt(ref.style.height), 
                  ...position 
                });
              }
            }}
            onClick={(e: React.MouseEvent) => { 
              e.stopPropagation(); 
            }}
            className={cn("overflow-hidden relative", {
              [UI_CONSTANTS.selection]: isSelected
            })}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
              {isSelected && image.locked && (
                <span style={{ 
                  position: 'absolute', 
                  top: 4, 
                  right: 4, 
                  background: '#fff', 
                  borderRadius: '50%', 
                  padding: 2, 
                  zIndex: 30, 
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)' 
                }} title="Locked">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
              )}
            </div>
          </Rnd>
        );
      })}
    </>
  );
}
