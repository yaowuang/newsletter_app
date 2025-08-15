"use client";

import { CanvasPanel } from "@/components/CanvasPanel/CanvasPanel";
import { Header } from "@/components/header";
import { InspectorPanel } from "@/components/InspectorPanel/InspectorPanel";
import { StuffPanel } from "@/components/ToolsPanel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useStore } from '@/lib/store/index';
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { TextBlock, ImageElement } from '@/features/newsletter/types';

export default function BuilderPage() {
  // Fix selectElement type to accept 'horizontalLine'
  const handleSelectElement = (id: string | null, type?: 'text' | 'image' | 'horizontalLine' | 'calendarDate', subType?: 'title' | 'content') => {
    if (typeof selectElement === 'function') {
      selectElement(id, type, subType);
    }
  };
  const {
    title, date, textBlockMap, textBlockOrder, images, layout, theme, selectedElement, sectionStyles,
    setTitle, setDate, updateTextBlock, updateImage, selectElement, updateStyle,
    deleteTextBlock, deleteImage, deleteHorizontalLine,
  } = useStore();

  // Sidebar visibility
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  // Listen for delete-element event and call deleteElement from store
  useEffect(() => {
    const handleDeleteElement = (e: CustomEvent) => {
      const detail = e.detail;
      if (detail && detail.id && (detail.type === 'text' || detail.type === 'image' || detail.type === 'horizontalLine')) {
        if (detail.type === 'text') {
  deleteTextBlock(detail.id);
} else if (detail.type === 'image') {
  deleteImage(detail.id);
} else if (detail.type === 'horizontalLine') {
  deleteHorizontalLine(detail.id);
}
      }
    };
    window.addEventListener('delete-element', handleDeleteElement as EventListener);
    return () => window.removeEventListener('delete-element', handleDeleteElement as EventListener);
  }, [deleteTextBlock, deleteImage, deleteHorizontalLine]);

  const handleUpdateTextBlock = (id: string, property: 'title' | 'content', value: string) => {
     if (typeof updateTextBlock === 'function') {
       updateTextBlock(id, property, value);
     }
  };

  const selectedBlock = useMemo(() => {
    if (!selectedElement) return undefined;
    if (selectedElement.type === 'text') {
      const base = textBlockMap[selectedElement.id];
      const subType = (selectedElement as { subType?: string }).subType;
      const validSubType: 'title' | 'content' | undefined = subType === 'title' || subType === 'content' ? subType : undefined;
      return base ? { ...base, subType: validSubType } as typeof base & { subType?: 'title' | 'content' } : undefined;
    } else if (selectedElement.type === 'image') {
      return images.find((i: ImageElement) => i.id === selectedElement.id);
    } else if (selectedElement.type === 'horizontalLine') {
      return { id: selectedElement.id, type: 'horizontalLine' as const };
    } else if (selectedElement.type === 'calendarDate') {
      return { id: selectedElement.id, type: 'calendarDate' as const };
    }
    return undefined;
  }, [textBlockMap, images, selectedElement]);

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
                <StuffPanel defaultTab="layouts" />
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
              textBlocks={textBlockOrder.map(id => textBlockMap[id])}
              images={images}
              layoutSelection={layout}
              onSelectElement={handleSelectElement}
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
      {/* Sticky AdSense ad at the bottom, only in production */}
      {typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', boxShadow: '0 -2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ maxWidth: 728, margin: '0 auto', padding: '8px 0', display: 'flex', justifyContent: 'center' }}>
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '90px' }}
              data-ad-client="ca-pub-4218207840308637"
              data-ad-slot="4972122172"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>
          <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }} />
        </div>
      )}
    </div>
  );
}
