"use client";

import React from 'react';
import type { TextBlock, ImageElement, SectionStyle } from "@/features/newsletter/types";
import { HorizontalLineInspector } from '@/features/newsletter/components/InspectorPanel/HorizontalLineInspector';
import { TextInspector } from '@/features/newsletter/components/InspectorPanel/TextInspector';
import { DocumentInspector } from '@/features/newsletter/components/InspectorPanel/DocumentInspector';
import CalendarInspector from '@/features/calendar/components/CalendarInspector';
import { DateInspector } from '@/features/calendar/components/DateInspector';
import { useStore } from "@/lib/store";
import { ImageInspector } from '@/features/newsletter/components/InspectorPanel/ImageInspector';

type SelectableElement = (TextBlock & { subType?: 'title' | 'content' }) | ImageElement | { id: string; type: 'horizontalLine' | 'calendarDate'; subType?: 'title' | 'content' };

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
  const selectElement = useStore(state => state.selectElement);
  const currentStyle = selectedElement ? sectionStyles[selectedElement.id] || {} : {};
  const setCellContent = useStore(s => s.setCellContent);
  const textBlocks = useStore(s => s.textBlocks);

  // Typing-to-focus bridge: when a section or calendar date is selected and the user starts typing
  // while focus is elsewhere (e.g., canvas), automatically focus the relevant inspector field and append text.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if user is already typing in an input / textarea / contentEditable
      const active = document.activeElement as HTMLElement | null;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
      if (!selectedElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return; // don't hijack shortcuts

      const isPrintable = e.key.length === 1;
      const isBackspace = e.key === 'Backspace';
      const isEnter = e.key === 'Enter';
      if (!isPrintable && !isBackspace && !isEnter) return; // only handle text-like input

      // Prevent page scrolling/back navigation etc. We'll manage insertion ourselves.
      e.preventDefault();

      if (selectedElement.type === 'text') {
        const block = textBlocks.find((b: TextBlock) => b.id === selectedElement.id);
        if (!block || block.locked) return;
        // If inline editing is active on canvas for this block (data attribute flag), skip redirect to inspector
        const inlineEditing = document.querySelector(`[data-inline-edit-block="${selectedElement.id}"]`);
        if (inlineEditing) return; // let inline editor handle the keypress natively
        const titleEmpty = !block.title;
        const targetTitleId = `section-title-${block.id}`;
        const targetContentId = `section-content-${block.id}`;
        // Choose field: explicit subType wins; else if title empty -> title; else content
  const targetId = (selectedElement as unknown as { subType?: string }).subType === 'title'
          ? targetTitleId
          : (selectedElement as unknown as { subType?: string }).subType === 'content'
            ? targetContentId
            : (titleEmpty ? targetTitleId : targetContentId);
  // Removed unused variable targetEl
        const appendToTitle = targetId === targetTitleId;
        let currentVal = appendToTitle ? (block.title || '') : (typeof block.content === 'string' ? block.content : '');

        if (isBackspace) {
          currentVal = currentVal.slice(0, -1);
        } else if (isEnter) {
            currentVal += '\n';
        } else if (isPrintable) {
          currentVal += e.key;
        }
        if (appendToTitle) {
          onUpdateTextBlock(block.id, 'title', currentVal);
        } else {
          onUpdateTextBlock(block.id, 'content', currentVal);
        }
        // Focus after state update so user keeps typing seamlessly
        requestAnimationFrame(() => {
          const el = document.getElementById(targetId) as HTMLInputElement | HTMLTextAreaElement | null;
          if (el) {
            el.focus();
            // Place caret at end
            const len = el.value.length;
            (el as HTMLTextAreaElement).selectionStart = (el as HTMLTextAreaElement).selectionEnd = len;
          }
        });
      } else if (selectedElement.type === 'calendarDate') {
        const dateKey = selectedElement.id; // already YYYY-MM-DD
        // If an inline date cell editor is active (textarea with matching aria-label), don't reroute
        const inlineDateEditor = document.querySelector(`textarea[aria-label="Edit content for ${dateKey}"]`);
        if (inlineDateEditor) return; // inline editor will receive native input
        const textareaId = 'cell-content';
        // Retrieve current content from store
        const calendarData = useStore.getState().calendarData;
        const existing = calendarData.cellContents?.[dateKey] || '';
        let next = existing;
        if (isBackspace) next = next.slice(0, -1);
        else if (isEnter) next += '\n';
        else if (isPrintable) next += e.key;
        setCellContent(dateKey, next);
        requestAnimationFrame(() => {
          const el = document.getElementById(textareaId) as HTMLTextAreaElement | null;
          if (el) {
            el.focus();
            const len = el.value.length;
            el.selectionStart = el.selectionEnd = len;
          }
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedElement, onUpdateTextBlock, setCellContent, textBlocks]);


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
      const block = textBlocks.find((b: TextBlock) => b.id === selectedElement.id) as TextBlock;
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