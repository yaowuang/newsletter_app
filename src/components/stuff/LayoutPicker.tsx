import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { allLayouts, Layout, LayoutVariant } from '@/lib/layouts';
import type { LayoutSelection } from '@/lib/types';
import { LayoutPickerProps } from './interfaces/picker-interfaces';
import { cn } from '@/lib/utils';

// Refactored LayoutPicker following Single Responsibility Principle
// Separated layout preview logic into its own component
export const LayoutPicker: React.FC<LayoutPickerProps> = ({ 
  currentLayoutSelection, 
  onLayoutChange, 
  onSetSectionCount, 
  sectionCount
}) => {
  const [desiredSections, setDesiredSections] = useState(sectionCount);
  const availableLayouts = allLayouts.filter(l => l.sections === desiredSections);

  const handleSectionChange = (count: number) => {
    setDesiredSections(count);
  };

  return (
    <div className="space-y-4">
      <SectionCountSelector
        selectedCount={desiredSections}
        onCountChange={handleSectionChange}
      />
      
      <LayoutGrid
        layouts={availableLayouts}
        currentSelection={currentLayoutSelection}
        currentSectionCount={sectionCount}
        onLayoutChange={onLayoutChange}
        onSetSectionCount={onSetSectionCount}
      />
    </div>
  );
};

// Extracted section count selector component
const SectionCountSelector: React.FC<{
  selectedCount: number;
  onCountChange: (count: number) => void;
}> = ({ selectedCount, onCountChange }) => (
  <div>
    <label htmlFor="section-count" className="text-sm font-medium">
      Number of Sections
    </label>
    <input
      type="number"
      id="section-count"
      value={selectedCount}
      onChange={e => onCountChange(Number(e.target.value))}
      min={1}
      max={7}
      style={{ 
        position: 'absolute', 
        left: '-9999px', 
        width: '1px', 
        height: '1px', 
        opacity: 0 
      }}
      tabIndex={-1}
      aria-hidden="true"
    />
    <div 
      role="group" 
      aria-label="Number of Sections" 
      className="flex items-center justify-center gap-2 mt-2"
    >
      {[1, 2, 3, 4, 5, 6, 7].map(num => (
        <Button
          key={num}
          variant={selectedCount === num ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCountChange(num)}
        >
          {num}
        </Button>
      ))}
    </div>
  </div>
);

// Extracted layout grid component
const LayoutGrid: React.FC<{
  layouts: Layout[];
  currentSelection: LayoutSelection;
  currentSectionCount: number;
  onLayoutChange: (layout: LayoutSelection) => void;
  onSetSectionCount: (count: number) => void;
}> = ({ layouts, currentSelection, currentSectionCount, onLayoutChange, onSetSectionCount }) => (
  <div className="grid grid-cols-2 gap-4 place-items-center border-t pt-4">
    {layouts.map(layout => (
      <Dialog key={layout.id}>
        <DialogTrigger asChild>
          <div>
            <LayoutPreview
              layout={layout}
              isSelected={currentSelection.base.id === layout.id && currentSectionCount === layout.sections}
            />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose a variation for {layout.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {layout.variants.map(variant => (
              <div
                key={variant.name}
                onClick={() => {
                  onSetSectionCount(layout.sections);
                  onLayoutChange({ base: layout, variant });
                }}
              >
                <LayoutPreview
                  layout={layout}
                  variantName={variant.name}
                  isSelected={
                    currentSelection.variant.name === variant.name &&
                    currentSelection.base.id === layout.id
                  }
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    ))}
  </div>
);

// Extracted layout preview component with improved organization
const LayoutPreview: React.FC<{
  layout: Layout;
  variantName?: string;
  isSelected: boolean;
}> = ({ layout, variantName, isSelected }) => {
  const variant = layout.variants.find(v => v.name === (variantName || layout.variants[0].name)) || layout.variants[0];
  const areas = [...new Set(layout.gridTemplateAreas.replace(/"/g, '').split(/\s+/).filter(Boolean))];

  return (
    <div className={cn(
      'p-2 rounded-lg cursor-pointer w-[90px]',
      {
        'bg-blue-100 dark:bg-blue-900 ring-1 ring-blue-500': isSelected
      }
    )}>
      <LayoutPreviewGrid
        layout={layout}
        variant={variant}
        areas={areas}
      />
      <LayoutPreviewLabel
        layoutName={layout.name}
        variantName={variant.name}
      />
    </div>
  );
};

// Extracted grid visualization component
const LayoutPreviewGrid: React.FC<{
  layout: Layout;
  variant: LayoutVariant;
  areas: string[];
}> = ({ layout, variant, areas }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateAreas: layout.gridTemplateAreas,
      gridTemplateColumns: variant.gridTemplateColumns,
      gridTemplateRows: variant.gridTemplateRows
        .replace(/auto/g, '10px')
        .replace(/(\d+)fr/g, '$1fr'),
      gap: '3px',
      width: '80px',
      height: '90px',
      border: '1px solid #ccc',
      padding: '4px'
    }}
  >
    {areas.map(area => (
      <LayoutPreviewArea
        key={area}
        area={area}
        variant={variant}
      />
    ))}
  </div>
);

// Extracted area component
const LayoutPreviewArea: React.FC<{
  area: string;
  variant: LayoutVariant;
}> = ({ area, variant }) => {
  const isSection = area.startsWith('sec');
  const getLabel = () => {
    if (area === 'title') {
      return variant.titleAlign === 'center' ? 'T' : 
             variant.titleAlign === 'right' ? 'T>' : '<T';
    }
    if (area === 'date') {
      return variant.dateAlign === 'center' ? 'D' : 
             variant.dateAlign === 'right' ? 'D>' : '<D';
    }
    if (isSection) {
      return area.replace('sec', '');
    }
    return '';
  };

  return (
    <div
      style={{ gridArea: area }}
      className={cn(
        'flex items-center justify-center text-[10px] rounded-sm select-none',
        {
          'bg-gray-200 dark:bg-gray-700': isSection,
          'bg-gray-50 dark:bg-gray-800': !isSection,
          'font-bold': area === 'title' || area === 'date'
        }
      )}
    >
      {getLabel()}
    </div>
  );
};

// Extracted label component
const LayoutPreviewLabel: React.FC<{
  layoutName: string;
  variantName: string;
}> = ({ layoutName, variantName }) => (
  <p className="text-[10px] text-center mt-1 leading-tight">
    {layoutName}
    <br />
    <span className="text-[9px] opacity-70">{variantName}</span>
  </p>
);
