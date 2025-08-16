import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoomControlsComponentProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

/**
 * Zoom controls component - handles zoom in/out functionality
 * Follows SRP by focusing only on zoom UI controls
 */
export function ZoomControlsComponent({ zoom, onZoomIn, onZoomOut, onResetZoom }: ZoomControlsComponentProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        disabled={zoom <= 0.25}
        className="bg-white/80 backdrop-blur-sm"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onResetZoom} className="bg-white/80 backdrop-blur-sm min-w-[60px]">
        {Math.round(zoom * 100)}%
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        disabled={zoom >= 2}
        className="bg-white/80 backdrop-blur-sm"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
}
