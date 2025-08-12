import React from 'react';
import { RefactoredStuffPanel } from '@/components/stuff/StuffPanel.refactored';

// Example: How to integrate the refactored StuffPanel into your application
// This replaces the usage in app/builder/page.tsx or wherever StuffPanel is used

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left sidebar - Canvas area (your existing canvas code) */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm h-full">
          {/* Your canvas content here */}
          <div className="p-8 text-center text-gray-500">
            Canvas Area
          </div>
        </div>
      </div>

      {/* Right sidebar - Refactored StuffPanel */}
      <div className="w-80 bg-white border-l border-gray-200">
        <RefactoredStuffPanel 
          defaultTab="layouts"
          className="flex h-full flex-col"
        />
      </div>
    </div>
  );
}

// Alternative: If you need more control over individual components
export function CustomBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Canvas area */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm h-full">
          <div className="p-8 text-center text-gray-500">
            Canvas Area
          </div>
        </div>
      </div>

      {/* Custom sidebar using individual components */}
      <CustomStuffSidebar />
    </div>
  );
}

// Example of using individual refactored components
function CustomStuffSidebar() {
  const [activeTab, setActiveTab] = React.useState('layouts');

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Design Tools</h2>
      </div>
      
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <TabButton 
            label="Layouts" 
            isActive={activeTab === 'layouts'}
            onClick={() => setActiveTab('layouts')}
          />
          <TabButton 
            label="Themes" 
            isActive={activeTab === 'themes'}
            onClick={() => setActiveTab('themes')}
          />
          <TabButton 
            label="Elements" 
            isActive={activeTab === 'elements'}
            onClick={() => setActiveTab('elements')}
          />
        </div>

        <div className="mt-6">
          {activeTab === 'layouts' && <div>Layout content here</div>}
          {activeTab === 'themes' && <div>Theme content here</div>}
          {activeTab === 'elements' && <div>Element content here</div>}
        </div>
      </div>
    </div>
  );
}

function TabButton({ 
  label, 
  isActive, 
  onClick 
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}
