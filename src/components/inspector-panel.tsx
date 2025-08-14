"use client";

import type { TextBlock, ImageElement, SectionStyle } from "@/lib/types";
import { HorizontalLineInspector } from './inspector-panel/HorizontalLineInspector';
// Refactored components
import { TextInspector } from "./inspector-panel/TextInspector";
import { ImageInspector } from "./inspector-panel/ImageInspector";
import { DocumentInspector } from "./inspector-panel/DocumentInspector";
import { CalendarInspector } from "./inspector-panel/CalendarInspector";
import { DateInspector } from "./inspector-panel/DateInspector";
import { useStore } from "@/lib/store";

type SelectableElement = TextBlock | ImageElement | { id: string; type: 'horizontalLine' | 'calendarDate' };

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
  const layout = useStore(state => state.layout);
  const sectionStyles = useStore(state => state.sectionStyles);
  const textBlocks = useStore(state => state.textBlocks);
  const selectElement = useStore(state => state.selectElement);
  const currentStyle = selectedElement ? sectionStyles[selectedElement.id] || {} : {};

  // Check if we're in calendar mode
  const isCalendarLayout = layout.base.type === 'calendar';

  // Render content using refactored components
  const getInspectorContent = () => {
    // Always show calendar inspector for calendar layouts when no element is selected
    if (isCalendarLayout && !selectedElement) {
      return <CalendarInspector />;
    }
    
    if (!selectedElement) {
      return <DocumentInspector 
        title={title}
        date={date}
        theme={theme}
        onTitleChange={onTitleChange}
        onDateChange={onDateChange}
      />;
    }

    if (selectedElement.type === 'calendarDate') {
      const dateKey = selectedElement.id; // format YYYY-MM-DD (local)
      // Parse manually to avoid UTC interpretation shifting date backwards in some TZs
      const [y, m, d] = dateKey.split('-').map(n => parseInt(n, 10));
      const date = new Date(y, (m ?? 1) - 1, d ?? 1);
      return <DateInspector 
        dateKey={dateKey}
        date={date}
        onClose={() => selectElement(null)}
      />;
    } else if (selectedElement.type === 'text') {
      const block = textBlocks.find(b => b.id === selectedElement.id) as TextBlock;
      return <TextInspector 
        block={block}
        theme={theme}
        currentStyle={currentStyle}
        onUpdateTextBlock={onUpdateTextBlock}
        onStyleChange={onStyleChange}
      />;
    } else if (selectedElement.type === 'image') {
      return <ImageInspector 
        image={selectedElement as ImageElement}
        onUpdateImage={onUpdateImage}
      />;
    } else if (selectedElement.type === 'horizontalLine') {
      return <HorizontalLineInspector elementId={selectedElement.id} />;
    }
    return <div><p>Select an element to inspect.</p></div>;
  }

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex-grow rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
        {getInspectorContent()}
      </div>
    </div>
  );
}