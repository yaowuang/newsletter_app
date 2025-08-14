import { useEffect } from 'react';

interface UseTextBlockSwapProps {
  onSwapTextBlocks: (sourceId: string, targetId: string) => void;
}

/**
 * Custom hook for handling text block drag and drop swapping
 */
export function useTextBlockSwap({ onSwapTextBlocks }: UseTextBlockSwapProps) {
  useEffect(() => {
    const handleSwapEvent = (event: CustomEvent) => {
      const { sourceId, targetId } = event.detail || {};
      if (sourceId && targetId) {
        onSwapTextBlocks(sourceId, targetId);
      }
    };

    window.addEventListener('swap-text-blocks', handleSwapEvent as EventListener);
    return () => window.removeEventListener('swap-text-blocks', handleSwapEvent as EventListener);
  }, [onSwapTextBlocks]);
}
