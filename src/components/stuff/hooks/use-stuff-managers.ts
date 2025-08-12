// Custom hooks following Single Responsibility Principle
// Each hook manages a specific piece of functionality

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { LayoutSelection } from '@/lib/types';
import { Theme } from '@/lib/themes';

// Layout management hook
export const useLayoutManager = () => {
  const currentLayoutSelection = useStore(state => state.layout);
  const sectionCount = useStore(state => state.textBlocks.length);
  const setLayout = useStore(state => state.setLayout);
  const addTextBlock = useStore(state => state.addTextBlock);
  const deleteElement = useStore(state => state.deleteElement);
  
  const handleLayoutChange = (layout: LayoutSelection) => {
    setLayout(layout);
    
    // Automatically adjust section count to match layout
    const targetSections = layout.base.sections;
    const currentSections = useStore.getState().textBlocks.length;
    
    if (currentSections < targetSections) {
      // Add sections if we need more
      for (let i = currentSections; i < targetSections; i++) {
        addTextBlock();
      }
    } else if (currentSections > targetSections) {
      // Remove excess sections (starting from the end)
      const textBlocksToRemove = useStore.getState().textBlocks.slice(targetSections);
      textBlocksToRemove.forEach(block => {
        deleteElement(block.id, 'text');
      });
    }
  };

  const handleSectionCountChange = (count: number) => {
    const currentSections = useStore.getState().textBlocks.length;
    
    if (currentSections < count) {
      // Add sections
      for (let i = currentSections; i < count; i++) {
        addTextBlock();
      }
    } else if (currentSections > count) {
      // Remove excess sections (starting from the end)
      const textBlocksToRemove = useStore.getState().textBlocks.slice(count);
      textBlocksToRemove.forEach(block => {
        deleteElement(block.id, 'text');
      });
    }
  };

  return {
    currentLayoutSelection,
    sectionCount,
    onLayoutChange: handleLayoutChange,
    onSetSectionCount: handleSectionCountChange
  };
};

// Theme management hook
export const useThemeManager = () => {
  const currentTheme = useStore(state => state.theme);
  const setTheme = useStore(state => state.setTheme);

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
  };

  return {
    currentTheme,
    onThemeChange: handleThemeChange
  };
};

// Element creation hook
export const useElementCreator = () => {
  const addTextBlock = useStore(state => state.addTextBlock);
  const addHorizontalLine = useStore(state => state.addHorizontalLine);
  const addImage = useStore(state => state.addImage);
  const updateImage = useStore(state => state.updateImage);

  const handleAddTextBlock = () => {
    addTextBlock();
  };

  const handleAddHorizontalLine = () => {
    addHorizontalLine();
  };

  const handleAddImage = (src: string) => {
    addImage();
    const images = useStore.getState().images;
    const newImage = images[images.length - 1];
    if (newImage) {
      updateImage(newImage.id, { src });
    }
  };

  return {
    onAddTextBlock: handleAddTextBlock,
    onAddHorizontalLine: handleAddHorizontalLine,
    onAddImage: handleAddImage
  };
};

// Image upload hook
export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowedTypes = new Set([
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'
  ]);

  const uploadFromFile = async (file: File): Promise<string | null> => {
    if (!allowedTypes.has(file.type)) {
      setError('File type not supported');
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            resolve(result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return {
    isUploading,
    error,
    uploadFromFile,
    validateUrl,
    clearError: () => setError(null)
  };
};
