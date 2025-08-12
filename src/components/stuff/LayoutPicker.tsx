import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { allLayouts, Layout } from '@/lib/layouts';
import { LayoutSelection } from '@/lib/types';
import { cn } from '@/lib/utils';

const LayoutPreview = ({ layout, variantName, isSelected }: { layout: Layout; variantName?: string; isSelected: boolean }) => {
  const variant = layout.variants.find(v => v.name === (variantName || layout.variants[0].name)) || layout.variants[0];
  const areas = [...new Set(layout.gridTemplateAreas.replace(/"/g, '').split(/\s+/).filter(Boolean))];
  return (
    <div className={cn('p-2 rounded-lg cursor-pointer w-[90px]', { 'bg-blue-100 dark:bg-blue-900 ring-1 ring-blue-500': isSelected })}>
      <div style={{ display: 'grid', gridTemplateAreas: layout.gridTemplateAreas, gridTemplateColumns: variant.gridTemplateColumns, gridTemplateRows: variant.gridTemplateRows.replace(/auto/g, '10px').replace(/(\d+)fr/g, '$1fr'), gap: '3px', width: '80px', height: '90px', border: '1px solid #ccc', padding: '4px' }}>
        {areas.map(area => {
          const isSection = area.startsWith('sec');
          const label = area === 'title' ? (variant.titleAlign === 'center' ? 'T' : variant.titleAlign === 'right' ? 'T>' : '<T') : area === 'date' ? (variant.dateAlign === 'center' ? 'D' : variant.dateAlign === 'right' ? 'D>' : '<D') : isSection ? area.replace('sec', '') : '';
          return (
            <div
              key={area}
              style={{ gridArea: area }}
              className={cn('flex items-center justify-center text-[10px] rounded-sm select-none', {
                'bg-gray-200 dark:bg-gray-700': isSection,
                'bg-gray-50 dark:bg-gray-800': !isSection,
                'font-bold': area === 'title' || area === 'date'
              })}
            >{label}</div>
          );
        })}
  {/* Removed decoration count badge per user request */}
      </div>
      <p className='text-[10px] text-center mt-1 leading-tight'>{layout.name}<br/><span className='text-[9px] opacity-70'>{variant.name}</span></p>
    </div>
  );
};

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
        <label htmlFor='section-count' className='text-sm font-medium'>Number of Sections</label>
        <input
          type='number'
          id='section-count'
          value={desiredSections}
          onChange={e => setDesiredSections(Number(e.target.value))}
          min={1}
          max={7}
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          tabIndex={-1}
          aria-hidden='true'
        />
        <div role='group' aria-label='Number of Sections' className='flex items-center justify-center gap-2 mt-2'>
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
        <LayoutPreview layout={layout} variantName={variant.name} isSelected={currentLayoutSelection.variant.name === variant.name && currentLayoutSelection.base.id === layout.id} />
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
