"use client";

import { CanvasPanel } from "@/components/canvas-panel";
import { InspectorPanel } from "@/components/inspector-panel";
import { StuffPanel } from "@/components/stuff-panel";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useStore } from "@/lib/store";
import { useEffect } from "react";
import { useMemo } from "react";




// Re-export types for convenience


export default function EditorPage() {
  // Listen for delete-element event and call deleteElement from store
  useEffect(() => {
    const handleDeleteElement = (e: CustomEvent) => {
      const detail = e.detail;
      if (detail && detail.id && (detail.type === 'text' || detail.type === 'image')) {
        deleteElement(detail.id, detail.type);
      }
    };
    window.addEventListener('delete-element', handleDeleteElement as EventListener);
    return () => window.removeEventListener('delete-element', handleDeleteElement as EventListener);
  }, []);
  const {
    title, date, textBlocks, images, layout, theme, selectedElement, sectionStyles,
    setTitle, setDate, setLayout, setTheme, addTextBlock, addImage,
    updateTextBlock, updateImage, selectElement, updateStyle, setSectionCount,
    deleteElement,
  } = useStore();

  // Update handler to accept property and value for granular updates
  const handleUpdateTextBlock = (id: string, property: 'title' | 'content', value: string) => {
    if (typeof updateTextBlock === 'function') {
      updateTextBlock(id, property, value);
    }
  };

  

  const selectedBlock = useMemo(() => {
    if (!selectedElement) return undefined;
    if (selectedElement.type === 'text') {
      return textBlocks.find(b => b.id === selectedElement.id);
    }
    return images.find(i => i.id === selectedElement.id);
  }, [textBlocks, images, selectedElement]);

  

  return (
    <div className="flex flex-col h-screen min-h-0">
      <ResizablePanelGroup direction="horizontal" className="flex-grow h-full min-h-0 max-w-screen">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <StuffPanel 
              currentLayoutSelection={layout}
              onLayoutChange={setLayout}
              currentTheme={theme}
              onThemeChange={setTheme}
              onAddTextBlock={addTextBlock}
              onAddImage={addImage}
              onSetSectionCount={setSectionCount}
              sectionCount={textBlocks.length}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <CanvasPanel 
              title={title}
              date={date}
              textBlocks={textBlocks}
              images={images}
              layoutSelection={layout}
              onSelectElement={selectElement} 
              selectedElement={selectedElement}
              sectionStyles={sectionStyles}
              theme={theme}
              onUpdateImage={updateImage}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <InspectorPanel 
              selectedElement={selectedBlock}
              onStyleChange={updateStyle}
              onUpdateTextBlock={handleUpdateTextBlock}
              onUpdateImage={updateImage}
              title={title}
              date={date}
              onTitleChange={setTitle}
              onDateChange={setDate}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
