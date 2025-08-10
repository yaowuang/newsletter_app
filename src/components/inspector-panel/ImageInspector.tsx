import React from "react";
import { ImageElement, useStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageInspectorProps {
  image: ImageElement;
  onUpdateImage: (id: string, newProps: Partial<ImageElement>) => void;
}

export const ImageInspector: React.FC<ImageInspectorProps> = ({ image, onUpdateImage }) => {
  const deleteElement = useStore(s => s.deleteElement);
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="destructive" size="sm" onClick={() => deleteElement(image.id, 'image')} aria-label="Delete image element">Delete Image</Button>
      </div>
      {/* Position */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-4 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold">Position</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">X</Label>
            <Input type="number" value={image.x} onChange={e => onUpdateImage(image.id, { x: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Y</Label>
            <Input type="number" value={image.y} onChange={e => onUpdateImage(image.id, { y: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
      </div>

      {/* Size */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-4 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold">Size</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Width</Label>
            <Input type="number" value={image.width} onChange={e => onUpdateImage(image.id, { width: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Height</Label>
            <Input type="number" value={image.height} onChange={e => onUpdateImage(image.id, { height: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
      </div>
    </div>
  );
};
