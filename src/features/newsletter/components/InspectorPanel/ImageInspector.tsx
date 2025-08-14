import React from "react";
import { useStore } from "@/lib/store";
import type { ImageElement } from "@/features/newsletter/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';
import LockButton from '@/components/ui/LockButton';

interface ImageInspectorProps {
  image: ImageElement;
  onUpdateImage: (id: string, newProps: Partial<ImageElement>) => void;
}

export const ImageInspector: React.FC<ImageInspectorProps> = ({ image, onUpdateImage }) => {
  const deleteElement = useStore(s => s.deleteElement);
  const setElementLocked = useStore(s => s.setElementLocked);
  const posXId = React.useId();
  const posYId = React.useId();
  const widthId = React.useId();
  const heightId = React.useId();

  const locked = !!image.locked;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">Image</h3>
        <div className="flex gap-2">
          <LockButton locked={locked} onToggle={() => setElementLocked(image.id, 'image', !locked)} />
          <Button variant="destructive" size="sm" onClick={() => deleteElement(image.id, 'image')} disabled={locked} aria-label="Delete image element">Delete</Button>
        </div>
      </div>

      <InspectorSection title="Position">
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="X" id={posXId} className="space-y-1">
            <Input id={posXId} type="number" value={image.x} disabled={locked} onChange={e => onUpdateImage(image.id, { x: parseInt(e.target.value) || 0 })} />
          </FormGroup>
          <FormGroup label="Y" id={posYId} className="space-y-1">
            <Input id={posYId} type="number" value={image.y} disabled={locked} onChange={e => onUpdateImage(image.id, { y: parseInt(e.target.value) || 0 })} />
          </FormGroup>
        </div>
      </InspectorSection>

      <InspectorSection title="Size">
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Width" id={widthId} className="space-y-1">
            <Input id={widthId} type="number" value={image.width} disabled={locked} onChange={e => onUpdateImage(image.id, { width: parseInt(e.target.value) || 0 })} />
          </FormGroup>
          <FormGroup label="Height" id={heightId} className="space-y-1">
            <Input id={heightId} type="number" value={image.height} disabled={locked} onChange={e => onUpdateImage(image.id, { height: parseInt(e.target.value) || 0 })} />
          </FormGroup>
        </div>
      </InspectorSection>
    </div>
  );
};
