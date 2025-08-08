import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { allLayouts, Layout } from '@/lib/layouts';
import { LayoutSelection } from '@/lib/store';
import { cn } from '@/lib/utils';

const LayoutPreview = ({ layout, isSelected }: { layout: Layout, isSelected: boolean }) => (
  <div className={cn('p-2 rounded-lg cursor-pointer', { 'bg-blue-100 dark:bg-blue-900': isSelected })}>
    <div style={{ display: 'grid', gridTemplateAreas: layout.gridTemplateAreas, gridTemplateColumns: layout.variants[0].gridTemplateColumns, gridTemplateRows: layout.variants[0].gridTemplateRows.replace(/auto/g, '10px').replace(/(\d+)fr/g, '$1fr'), gap: '3px', width: '68px', height: '88px', border: '1px solid #ccc', padding: '4px' }}>
      {[...new Set(layout.gridTemplateAreas.replace(/"/g, '').split(/\s+/).filter(Boolean))].map(area => {
        const isSection = area.startsWith('sec');
        return <div key={area} style={{ gridArea: area }} className={cn('flex items-center justify-center text-xs rounded-sm', { 'bg-gray-200 dark:bg-gray-700': isSection, 'bg-gray-50 dark:bg-gray-800': !isSection })}>{isSection && area.replace('sec', '')}</div>;
      })}
    </div>
    <p className='text-xs text-center mt-1'>{layout.name}</p>
  </div>
);

interface LayoutPickerProps {
  currentLayoutSelection: LayoutSelection;
  onLayoutChange: (layout: LayoutSelection) => void;
  onSetSectionCount: (count: number) => void;
  sectionCount: number;
}

export const LayoutPicker: React.FC<LayoutPickerProps> = ({ currentLayoutSelection, onLayoutChange, onSetSectionCount, sectionCount }) => {
  const [desiredSections, setDesiredSections] = useState(sectionCount);
  const availableLayouts = allLayouts.filter(l => l.sections === desiredSections);
  return (
    <div className='space-y-4'>
      <div>
        <label className='text-sm font-medium'>Number of Sections</label>
        <div className='flex items-center justify-center gap-2 mt-2'>
          {[1,2,3,4,5,6,7].map(num => (
            <Button key={num} variant={desiredSections === num ? 'default':'outline'} size='sm' onClick={() => setDesiredSections(num)}>{num}</Button>
          ))}
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 place-items-center border-t pt-4'>
        {availableLayouts.map(layout => (
          <Dialog key={layout.id}>
            <DialogTrigger asChild>
              <div><LayoutPreview layout={layout} isSelected={currentLayoutSelection.base.id === layout.id && sectionCount === layout.sections} /></div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Choose a variation for {layout.name}</DialogTitle></DialogHeader>
              <div className='grid grid-cols-3 gap-4 py-4'>
                {layout.variants.map(variant => (
                  <div key={variant.name} onClick={() => { onSetSectionCount(layout.sections); onLayoutChange({ base: layout, variant }); }}>
                    <LayoutPreview layout={{...layout, variants: [variant]}} isSelected={currentLayoutSelection.variant.name === variant.name && currentLayoutSelection.base.id === layout.id} />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};
