import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { horizontalLineLibrary } from '@/lib/horizontalLines';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';
import LockButton from '@/components/ui/LockButton';
import ColorInputWithReset from '@/components/ui/ColorInputWithReset';
import type { HorizontalLineElement } from '@/features/newsletter/types';

interface HorizontalLineInspectorProps {
  elementId: string;
}

export const HorizontalLineInspector: React.FC<HorizontalLineInspectorProps> = ({ elementId }) => {
  const library = horizontalLineLibrary;
  const line = useStore(state => state.horizontalLines.find((l: HorizontalLineElement) => l.id === elementId));
  const updateHorizontalLine = useStore(state => state.updateHorizontalLine);
  const deleteElement = useStore(state => state.deleteElement);
  const setElementLocked = useStore(state => state.setElementLocked);
  const theme = useStore(state => state.theme);
  
  // State for loading SVG content for previews
  const [svgContents, setSvgContents] = useState<Record<string, string>>({});
  
  // Load SVG content for file-based SVGs
  useEffect(() => {
    const svgLibraryItems = library.filter(l => l.type === 'svg' && l.preview.startsWith('/'));
    
    svgLibraryItems.forEach(item => {
      if (!svgContents[item.id]) {
        // Add cache busting parameter to force fresh fetch of updated SVG
        const cacheBustUrl = item.preview + (item.preview.includes('?') ? '&' : '?') + '_cb=' + Date.now();
        fetch(cacheBustUrl)
          .then(response => response.text())
          .then(svgText => {
            setSvgContents(prev => ({
              ...prev,
              [item.id]: svgText // Store original SVG content without color replacement here
            }));
          })
          .catch(error => console.error('Error loading SVG:', error));
      }
    });
  }, [library, svgContents]);
  
  if (!line) return <div className="text-sm text-muted-foreground">Line not found.</div>;

  const locked = !!line.locked;

  // derive selected style id
  let selectedId = 'classic-solid';
  if (line.style === 'clipart' && line.clipartSrc) {
    const found = library.find(l => l.preview === line.clipartSrc);
    selectedId = found ? found.id : selectedId;
  } else if (line.style === 'dashed') selectedId = 'classic-dashed';
  else if (line.style === 'dotted') selectedId = 'classic-dotted';
  else if (line.style === 'shadow') selectedId = 'shadow';

  const applyLibraryLine = (libLine: typeof library[number]) => {
    if (locked) return;
    if (libLine.type === 'svg') {
      // Always use the library item's default color when applying, or fallback
      const colorToUse = libLine.defaultColor || '#888';
      updateHorizontalLine(elementId, { 
        style: 'clipart', 
        clipartSrc: libLine.preview,
        color: colorToUse
      });
    } else {
      let style: 'solid' | 'dashed' | 'dotted' | 'clipart' | 'shadow' = 'solid';
      if (libLine.id.includes('dashed')) style = 'dashed';
      else if (libLine.id.includes('dotted')) style = 'dotted';
      else if (libLine.id === 'shadow') style = 'shadow';
      
      // For non-SVG lines, use library default color if available, otherwise theme border color, otherwise current line color
      const colorToUse = libLine.defaultColor || theme.styles.section.borderColor || line.color;
        
      updateHorizontalLine(elementId, { 
        style, 
        clipartSrc: undefined,
        color: colorToUse
      });
    }
  };

  // Get the current library item to check if color is customizable
  const currentLibItem = library.find(l => 
    (line.style === 'clipart' && line.clipartSrc && l.preview === line.clipartSrc) ||
    (line.style === 'dashed' && l.id === 'classic-dashed') ||
    (line.style === 'dotted' && l.id === 'classic-dotted') ||
    (line.style === 'shadow' && l.id === 'shadow') ||
    (line.style === 'solid' && l.id === 'classic-solid')
  );

  const isColorCustomizable = currentLibItem?.colorCustomizable !== false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">Horizontal Line</h3>
        <div className="flex gap-2">
          <LockButton locked={locked} onToggle={() => setElementLocked(elementId, 'horizontalLine', !locked)} />
          <Button size="sm" variant="destructive" onClick={() => deleteElement(elementId, 'horizontalLine')} disabled={locked}>Delete</Button>
        </div>
      </div>

      <InspectorSection title="Style">
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-auto pr-1" role="listbox" aria-label="Line styles">
          {library.map(l => (
            <Button
              key={l.id}
              variant={selectedId === l.id ? 'default' : 'outline'}
              onClick={() => applyLibraryLine(l)}
              className="flex flex-col items-center p-2 h-auto"
              disabled={locked}
              aria-selected={selectedId === l.id}
            >
              <span className="mb-1 text-[10px] font-medium line-clamp-1 w-full text-center">{l.name}</span>
              {l.type === 'svg' ? (
                l.preview.startsWith('/') ? (
                  // Handle file-based SVG
                  svgContents[l.id] ? (
                    (() => {
                      // Always use the library item's default color for preview, regardless of current line color
                      const previewColor = l.defaultColor || '#888';
                      // Only apply color transformations if the SVG is color customizable
                      const applyColorTransform = l.colorCustomizable !== false;
                      const transformedSvg = applyColorTransform 
                        ? svgContents[l.id]
                            .replace(/fill="currentColor"/g, `fill="${previewColor}"`)
                            .replace(/fill="[^"]*"/g, `fill="${previewColor}"`)
                            .replace(/stroke="currentColor"/g, `stroke="${previewColor}"`)
                            .replace(/stroke="[^"]*"/g, `stroke="${previewColor}"`)
                        : svgContents[l.id]
                            .replace(/fill="currentColor"/g, `fill="${previewColor}"`)
                            .replace(/stroke="currentColor"/g, `stroke="${previewColor}"`);
                      
                      return l.repeat ? (
                        <div
                          style={{
                            width: '100%',
                            height: 16,
                            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                              transformedSvg
                            ).replace(/'/g, '%27').replace(/"/g, '%22')}")`,
                            backgroundRepeat: 'repeat-x',
                            backgroundSize: 'auto 100%',
                          }}
                        />
                      ) : (
                        <span 
                          dangerouslySetInnerHTML={{ 
                            __html: transformedSvg
                          }} 
                          style={{ 
                            width: '100%', 
                          }} 
                        />
                      );
                    })()
                  ) : (
                    // Loading state
                    <div style={{ width: '100%', height: 16, backgroundColor: '#f0f0f0' }} />
                  )
                ) : (
                  // Handle inline SVG
                  (() => {
                    // Always use the library item's default color for preview, regardless of current line color
                    const previewColor = l.defaultColor || '#888';
                    // Only apply color transformations if the SVG is color customizable
                    const applyColorTransform = l.colorCustomizable !== false;
                    const transformedSvg = applyColorTransform 
                      ? l.preview.trim()
                          .replace(/fill="currentColor"/g, `fill="${previewColor}"`)
                          .replace(/fill="[^"]*"/g, `fill="${previewColor}"`)
                          .replace(/stroke="currentColor"/g, `stroke="${previewColor}"`)
                          .replace(/stroke="[^"]*"/g, `stroke="${previewColor}"`)
                      : l.preview.trim()
                          .replace(/fill="currentColor"/g, `fill="${previewColor}"`)
                          .replace(/stroke="currentColor"/g, `stroke="${previewColor}"`);
                    
                    return l.repeat ? (
                      <div
                        style={{
                          width: '100%',
                          height: 16,
                          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                            transformedSvg
                          ).replace(/'/g, '%27').replace(/"/g, '%22')}")`,
                          backgroundRepeat: 'repeat-x',
                          backgroundSize: 'auto 100%',
                        }}
                      />
                    ) : (
                      <span 
                        dangerouslySetInnerHTML={{ 
                          __html: transformedSvg
                        }} 
                        style={{ 
                          width: '100%', 
                        }} 
                      />
                    );
                  })()
                )
              ) : (
                <div className="w-full h-4 flex items-center justify-center">
                  <div
                    style={{
                      width: '100%',
                      height: 0,
                      borderTop: l.id === 'classic-dashed' 
                        ? `2px dashed ${l.defaultColor || theme.styles.section.borderColor || '#888'}` 
                        : l.id === 'classic-dotted' 
                        ? `2px dotted ${l.defaultColor || theme.styles.section.borderColor || '#888'}` 
                        : l.id === 'shadow'
                        ? `2px solid ${l.defaultColor || theme.styles.section.borderColor || '#888'}`
                        : `2px solid ${l.defaultColor || theme.styles.section.borderColor || '#888'}`,
                      boxShadow: l.id === 'shadow' ? `0 2px 4px rgba(0, 0, 0, 0.3)` : undefined,
                    }}
                  />
                </div>
              )}
            </Button>
          ))}
        </div>
      </InspectorSection>

      {isColorCustomizable && (
        <InspectorSection title="Color">
          <FormGroup label="Line Color" id={`line-color-${line.id}`} inline>
            <ColorInputWithReset
              id={`line-color-${line.id}`}
              value={line.color}
              disabled={locked}
              onChange={v => updateHorizontalLine(elementId, { color: v })}
              onReset={() => updateHorizontalLine(elementId, { color: currentLibItem?.defaultColor || theme.styles.section.borderColor || '#888' })}
            />
          </FormGroup>
        </InspectorSection>
      )}

      {line.style !== 'clipart' && (
        <InspectorSection title="Thickness">
          <FormGroup label={`Thickness (${line.thickness}px)`} id={`line-thickness-${line.id}`} inline>
            <input
              id={`line-thickness-${line.id}`}
              type="range"
              min={1}
              max={12}
              value={line.thickness}
              onChange={e => updateHorizontalLine(elementId, { thickness: parseInt(e.target.value, 10) })}
              disabled={locked}
              className="w-full"
            />
          </FormGroup>
        </InspectorSection>
      )}

      {line.style === 'clipart' && (
        <InspectorSection title="Height">
          <FormGroup label={`Height (${line.height || 24}px)`} id={`line-height-${line.id}`} inline>
            <input
              id={`line-height-${line.id}`}
              type="range"
              min={12}
              max={100}
              value={line.height || 24}
              onChange={e => updateHorizontalLine(elementId, { height: parseInt(e.target.value, 10) })}
              disabled={locked}
              className="w-full"
            />
          </FormGroup>
        </InspectorSection>
      )}

      <InspectorSection title="Width">
        <FormGroup label="Width (px)" id={`line-width-${line.id}`} inline>
          <Input id={`line-width-${line.id}`} type="number" value={typeof line.width === 'number' ? line.width : ''} onChange={e => updateHorizontalLine(elementId, { width: parseInt(e.target.value, 10) || line.width })} disabled={locked} className="w-28" />
        </FormGroup>
      </InspectorSection>
    </div>
  );
};
