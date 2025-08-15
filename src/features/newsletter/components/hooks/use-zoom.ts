import { useState, useCallback } from 'react';
import type { ZoomControlsType } from '@/features/newsletter/types';

const ZOOM_LIMITS = {
  MIN: 0.25,
  MAX: 2,
  STEP: 0.25,
} as const;

/**
 * Custom hook for managing zoom functionality
 */
export function useZoom(): ZoomControlsType {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + ZOOM_LIMITS.STEP, ZOOM_LIMITS.MAX));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - ZOOM_LIMITS.STEP, ZOOM_LIMITS.MIN));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  return {
    zoom,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onResetZoom: handleResetZoom,
  };
}
