import React from 'react';
import { useStore } from '@/lib/store';

// Debug component to help troubleshoot layout issues
export const LayoutDebugger: React.FC = () => {
  const layout = useStore(state => state.layout);
  const textBlocks = useStore(state => state.textBlocks);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">Layout Debug Info</h3>
      <div className="text-xs space-y-1">
        <div><strong>Layout ID:</strong> {layout.base.id}</div>
        <div><strong>Layout Name:</strong> {layout.base.name}</div>
        <div><strong>Variant:</strong> {layout.variant.name}</div>
        <div><strong>Sections:</strong> {layout.base.sections}</div>
        <div><strong>Text Blocks:</strong> {textBlocks.length}</div>
        <div><strong>Grid Areas:</strong></div>
        <pre className="text-xs bg-gray-100 p-1 rounded">
          {layout.base.gridTemplateAreas}
        </pre>
        <div><strong>Grid Columns:</strong></div>
        <pre className="text-xs bg-gray-100 p-1 rounded">
          {layout.variant.gridTemplateColumns}
        </pre>
        <div><strong>Grid Rows:</strong></div>
        <pre className="text-xs bg-gray-100 p-1 rounded">
          {layout.variant.gridTemplateRows}
        </pre>
      </div>
    </div>
  );
};

// Hook to easily add debugging to any component
export const useLayoutDebug = () => {
  const layout = useStore(state => state.layout);
  const textBlocks = useStore(state => state.textBlocks);
  
  React.useEffect(() => {
    console.log('Layout Debug:', {
      layoutId: layout.base.id,
      layoutName: layout.base.name,
      variant: layout.variant.name,
      sections: layout.base.sections,
      textBlockCount: textBlocks.length,
      gridTemplateAreas: layout.base.gridTemplateAreas,
      gridTemplateColumns: layout.variant.gridTemplateColumns,
      gridTemplateRows: layout.variant.gridTemplateRows
    });
  }, [layout, textBlocks]);
  
  return { layout, textBlocks };
};
