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

const fonts = [
  "Inter",
  "Roboto",
  "Montserrat",
  "Poppins",
  "Nunito",
  "Lato",
  "Raleway",
  "Oswald",
  "Merriweather",
  "Playfair Display",
  "Alegreya SC",
  "Lora",
  "Pacifico",
  "Ultra",
  "Roboto Condensed",
  "Fredoka",
  "Comic Neue",
  "Mountains of Christmas",
  "Creepster",
  "Share Tech Mono",
  "Bangers",
  "Orbitron",
  "Rye",
  "Special Elite",
  "Cinzel",
  "Cinzel Decorative",
  "Source Sans 3",
  "Irish Grover"
];

// Provide mapping for variable-based fonts that differ from label
export const FONT_LABEL_TO_VALUE: Record<string,string> = {
  "Share Tech Mono": "var(--font-share-tech-mono)",
  "Mountains of Christmas": "var(--font-mountains-of-christmas)",
  "Source Sans 3": "var(--font-source-sans3)"
};
export const FONT_VALUE_TO_LABEL: Record<string,string> = Object.fromEntries(Object.entries(FONT_LABEL_TO_VALUE).map(([k,v]) => [v,k]));

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

  // Ensure updates to text block are merged into state
  // Ensure updates to text block are merged into state
  // No longer needed: TextInspector now calls onUpdateTextBlock directly with (id, property, value)
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
        // Find the latest block from state to avoid stale props
        const block = textBlocks.find(b => b.id === selectedElement.id) as TextBlock;
        return <TextInspector 
          block={block}
          fonts={fonts}
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