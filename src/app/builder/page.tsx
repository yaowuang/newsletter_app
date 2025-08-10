"use client";

import { CanvasPanel } from "@/components/canvas-panel";
import { Header } from "@/components/header";
import { InspectorPanel } from "@/components/inspector-panel";
import { StuffPanel } from "@/components/stuff-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useStore } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export default function BuilderPage() {
  const {
    title, date, textBlocks, images, layout, theme, selectedElement, sectionStyles,
    setTitle, setDate, setLayout, setTheme, addTextBlock, addImage,
    updateTextBlock, updateImage, selectElement, updateStyle, setSectionCount,
    deleteElement,
  } = useStore();

  // Sidebar visibility
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

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
  }, [deleteElement]);

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
    <div className="flex flex-col h-screen min-h-0 relative">
      <Header />
      {(!showLeft || !showRight) && (
        <div className="flex items-center gap-3 px-2 py-1 bg-background/60 border-b border-border/50 backdrop-blur-sm">
          {!showLeft && (
            <Button size="sm" variant="outline" onClick={() => setShowLeft(true)}>Show Tools</Button>
          )}
          <div className="flex-1" />
          {!showRight && (
            <Button size="sm" variant="outline" onClick={() => setShowRight(true)}>Show Inspector</Button>
          )}
        </div>
      )}
      <ResizablePanelGroup direction="horizontal" className="flex-grow h-full min-h-0 max-w-screen">
        {showLeft && (
          <>
            <ResizablePanel defaultSize={25} minSize={16} maxSize={32} className="flex flex-col min-h-0">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-background/60 sticky top-0 z-10 backdrop-blur">
                <span className="text-xs font-medium tracking-wide uppercase opacity-60">Tools</span>
                <Button size="sm" variant="ghost" onClick={() => setShowLeft(false)} aria-label="Hide tools panel">Hide</Button>
              </div>
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
          </>
        )}
        <ResizablePanel defaultSize={showLeft && showRight ? 50 : showLeft || showRight ? 70 : 100} className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-background/60 sticky top-0 z-10 backdrop-blur">
            <span className="text-xs font-medium tracking-wide uppercase opacity-60">Canvas</span>
          </div>
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
        {showRight && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={16} maxSize={32} className="flex flex-col min-h-0">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-background/60 sticky top-0 z-10 backdrop-blur">
                <span className="text-xs font-medium tracking-wide uppercase opacity-60">Inspector</span>
                <Button size="sm" variant="ghost" onClick={() => setShowRight(false)} aria-label="Hide inspector panel">Hide</Button>
              </div>
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
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
