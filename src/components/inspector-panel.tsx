"use client";

import { TextBlock, ImageElement, SectionStyle } from "@/lib/store";
// Refactored components
import { TextInspector } from "./inspector-panel/TextInspector";
import { ImageInspector } from "./inspector-panel/ImageInspector";
import { DocumentInspector } from "./inspector-panel/DocumentInspector";
import { useStore } from "@/lib/store";

type SelectableElement = TextBlock | ImageElement;

interface InspectorPanelProps {
  selectedElement?: SelectableElement;
  onUpdateTextBlock: (id: string, property: 'title' | 'content', value: string) => void;
  onUpdateImage: (id: string, newProps: Partial<ImageElement>) => void;
  onStyleChange: (blockId: string, newStyles: Partial<SectionStyle>) => void;
  title: string;
  date: string;
  onTitleChange: (title: string) => void;
  onDateChange: (date: string) => void;
}

export function InspectorPanel({ 
  selectedElement, 
  onUpdateTextBlock,
  onUpdateImage,
  onStyleChange,
  title,
  date,
  onTitleChange,
  onDateChange
}: InspectorPanelProps) {
  const theme = useStore(state => state.theme);
  const sectionStyles = useStore(state => state.sectionStyles);
  const textBlocks = useStore(state => state.textBlocks);
  const currentStyle = selectedElement ? sectionStyles[selectedElement.id] || {} : {};

  // Render content using refactored components
  const getInspectorContent = () => {
    if (!selectedElement) {
      return <DocumentInspector 
        title={title}
        date={date}
        theme={theme}
        onTitleChange={onTitleChange}
        onDateChange={onDateChange}
      />;
    }
    switch (selectedElement.type) {
      case 'text': {
        const block = textBlocks.find(b => b.id === selectedElement.id) as TextBlock;
        return <TextInspector 
          block={block}
          theme={theme}
          currentStyle={currentStyle}
          onUpdateTextBlock={onUpdateTextBlock}
          onStyleChange={onStyleChange}
        />;
      }
      case 'image':
        return <ImageInspector 
          image={selectedElement as ImageElement}
          onUpdateImage={onUpdateImage}
        />;
      default:
        return <div><p>Select an element to inspect.</p></div>;
    }
  }

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex-grow rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
        {getInspectorContent()}
      </div>
    </div>
  );
}