import { useEffect } from 'react';
import type { ElementSelectionType } from '@/features/newsletter/types';

interface UseKeyboardShortcutsProps {
  selectedElement: ElementSelectionType | null;
  onDeleteElement: (element: ElementSelectionType) => void;
}

/**
 * Custom hook for handling keyboard shortcuts
 */
export function useKeyboardShortcuts({ 
  selectedElement, 
  onDeleteElement 
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null;
      
      // Don't handle shortcuts when user is typing in input fields
      if (activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.isContentEditable
      )) {
        return;
      }

  if ((e.key === 'Delete') && selectedElement?.id) {
        // Only delete supported element types
        if (['text', 'image', 'horizontalLine'].includes(selectedElement.type)) {
          onDeleteElement(selectedElement);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, onDeleteElement]);
}
