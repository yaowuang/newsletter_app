import { ImagePlus, PlusSquare, UploadCloud } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useImageUpload } from "./hooks/use-stuff-managers";
import type { ElementAdderProps } from "./interfaces/picker-interfaces";

// Refactored ElementAdder following Single Responsibility Principle
// Separated concerns: UI layout, image handling, and element creation
export const ElementAdder: React.FC<ElementAdderProps> = ({ onAddTextBlock, onAddHorizontalLine, onAddImage }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <TextBlockAdder onAdd={onAddTextBlock} />
      <HorizontalLineAdder onAdd={onAddHorizontalLine} />
      <ImageAdder onAdd={onAddImage} />
    </div>
  );
};

// Extracted component for text block creation
const TextBlockAdder: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <Button variant="outline" onClick={onAdd}>
    <PlusSquare className="h-4 w-4 mr-2" />
    Section
  </Button>
);

// Extracted component for horizontal line creation
const HorizontalLineAdder: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <Button variant="outline" onClick={onAdd}>
    <span style={{ display: "inline-block", transform: "rotate(90deg)" }}>
      <PlusSquare className="h-4 w-4 mr-2" />
    </span>
    Horizontal Line
  </Button>
);

// Extracted component for image creation with full upload functionality
const ImageAdder: React.FC<{ onAdd: (src: string) => void }> = ({ onAdd }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { isUploading, error, uploadFromFile, validateUrl, clearError } = useImageUpload();

  const handleUrlAdd = async () => {
    if (!imageUrl.trim()) return;

    if (!validateUrl(imageUrl.trim())) {
      // Could show error feedback here
      return;
    }

    onAdd(imageUrl.trim());
    setImageUrl("");
    setIsDialogOpen(false);
    clearError();
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const result = await uploadFromFile(file);

    if (result) {
      onAdd(result);
      setIsDialogOpen(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ImagePlus className="h-4 w-4 mr-2" />
          Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ImageUrlInput value={imageUrl} onChange={setImageUrl} onAdd={handleUrlAdd} disabled={isUploading} />

          <FileUploadSection
            onFileSelect={handleFileUpload}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            disabled={isUploading}
          />

          {error && <div className="text-sm text-red-600">{error}</div>}

          {isUploading && <div className="text-sm text-blue-600">Uploading...</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Extracted URL input component
const ImageUrlInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  disabled: boolean;
}> = ({ value, onChange, onAdd, disabled }) => (
  <div className="p-3 border rounded-md bg-white dark:bg-gray-900">
    <p className="text-sm font-medium mb-2">Image URL</p>
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste image URL"
        className="flex-grow px-2 py-1 text-sm border rounded-md bg-transparent"
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) {
            e.preventDefault();
            onAdd();
          }
        }}
        disabled={disabled}
      />
      <Button size="sm" onClick={onAdd} disabled={!value.trim() || disabled}>
        Add
      </Button>
    </div>
  </div>
);

// Extracted file upload section
const FileUploadSection: React.FC<{
  onFileSelect: (files: FileList | null) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  disabled: boolean;
}> = ({ onFileSelect, onDrop, onDragOver, disabled }) => (
  <div className="p-3 border rounded-md bg-white dark:bg-gray-900">
    <p className="text-sm font-medium mb-2">Upload File</p>

    <div className="flex items-center justify-between mb-2">
      <label
        htmlFor="image-file-input"
        className="text-xs text-blue-600 cursor-pointer hover:underline flex items-center gap-1"
      >
        <UploadCloud className="h-3 w-3" />
        Browse File
      </label>
      <input
        id="image-file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files)}
        disabled={disabled}
      />
    </div>

    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="mt-2 flex flex-col items-center justify-center h-28 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 p-2"
    >
      <p className="text-center">Drag & Drop Image Here</p>
      <p className="text-[10px] mt-1">(png, jpg, gif, webp, svg)</p>
      <p className="text-[10px] mt-1">or use URL / file selector</p>
    </div>
  </div>
);
