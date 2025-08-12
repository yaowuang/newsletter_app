import React from 'react';
import { StuffPanel } from './StuffPanel';

// Test component to validate the refactored StuffPanel
// This component can be used to test the new implementation
export const StuffPanelTestComponent: React.FC = () => {
  return (
    <div className="w-80 h-96 border border-gray-200 rounded-lg">
      <StuffPanel 
        defaultTab="layouts"
        className="flex h-full flex-col p-4"
      />
    </div>
  );
};

// Example usage in a page or story
export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Refactored StuffPanel Test</h1>
      <p className="text-gray-600 mb-6">
        This component demonstrates the refactored StuffPanel following SOLID principles.
      </p>
      <StuffPanelTestComponent />
    </div>
  );
}
