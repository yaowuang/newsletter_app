import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusSquare, ImagePlus, UploadCloud } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStore } from '@/lib/store';

interface ElementAdderProps {
  onAddTextBlock: () => void;
  onAddImage: () => void; // retained if needed elsewhere
}

export const ElementAdder: React.FC<ElementAdderProps> = ({ onAddTextBlock }) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const addImageStore = useStore(state => state.addImage);
  const updateImageStore = useStore(state => state.updateImage);

  const allowedImageTypes = new Set([
    'image/png','image/jpeg','image/jpg','image/gif','image/webp','image/svg+xml'
  ]);

  const addImageFromSrc = (src: string) => {
    if (!src) return;
    addImageStore();
    const newImage = useStore.getState().images.slice(-1)[0];
    if (newImage) {
      updateImageStore(newImage.id, { src });
      setImageDialogOpen(false);
      setImageUrl('');
    }
  };

  const handleFileInput = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!allowedImageTypes.has(file.type)) return;
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result;
      if (typeof result === 'string') addImageFromSrc(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlAdd = () => {
    if (!imageUrl.trim()) return;
    addImageFromSrc(imageUrl.trim());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleFileInput(e.dataTransfer.files);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <div className='grid grid-cols-2 gap-2 mb-4'>
      <Button variant='outline' onClick={onAddTextBlock}><PlusSquare className='h-4 w-4 mr-2' /> Section</Button>
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='outline'><ImagePlus className='h-4 w-4 mr-2' /> Image</Button>
        </DialogTrigger>
        <DialogContent className='max-w-md'>
          <DialogHeader><DialogTitle>Add Image</DialogTitle></DialogHeader>
          <div className='space-y-4'>
            <div className='p-3 border rounded-md bg-white dark:bg-gray-900'>
              <p className='text-sm font-medium mb-2'>Source</p>
              <div className='flex gap-2 mb-2'>
                <input
                  type='text'
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder='Paste image URL'
                  className='flex-grow px-2 py-1 text-sm border rounded-md bg-transparent'
                  onKeyDown={e => { if (e.key === 'Enter' && imageUrl.trim()) { e.preventDefault(); handleUrlAdd(); } }}
                />
                <Button size='sm' onClick={handleUrlAdd} disabled={!imageUrl.trim()}>Add</Button>
              </div>
              <div className='flex items-center justify-between mb-2'>
                <label htmlFor='image-file-input' className='text-xs text-blue-600 cursor-pointer hover:underline flex items-center gap-1'><UploadCloud className='h-3 w-3' /> Browse File</label>
                <input id='image-file-input' type='file' accept='image/*' className='hidden' onChange={e => handleFileInput(e.target.files)} />
              </div>
              <div onDrop={handleDrop} onDragOver={handleDragOver} className='mt-2 flex flex-col items-center justify-center h-28 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 p-2'>
                <p className='text-center'>Drag & Drop Image Here</p>
                <p className='text-[10px] mt-1'>(png, jpg, gif, webp, svg)</p>
                <p className='text-[10px] mt-1'>or use URL / file selector</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
