export interface ElementSelection {
  id: string;
  type: 'text' | 'image' | 'horizontalLine';
}

export interface ZoomControls {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export interface CanvasConfig {
  width: string;
  height: string;
  scale: number;
}
