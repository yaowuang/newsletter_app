import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import { ImageElement } from '@/features/newsletter/types';

export interface ImageSlice {
	images: ImageElement[];
	addImage: () => void;
	updateImage: (id: string, newProps: Partial<ImageElement>) => void;
	deleteImage: (id: string) => void;
	setElementLocked_image: (id: string, locked: boolean) => void;
}

export const createImageSlice: StateCreator<ImageSlice, [], [], ImageSlice> = (set, get) => ({
  images: [],
  addImage: () => {
    const newImage: ImageElement = { id: nanoid(), type: 'image', src: '', x: 50, y: 50, width: 200, height: 150 };
    set(state => ({ images: [...state.images, newImage] }));
  },
  updateImage: (id, newProps) => {
    set(state => ({
      images: state.images.map(img => {
        if (img.id !== id) return img;
        if (img.locked && !('locked' in newProps)) return img;
        return { ...img, ...newProps };
      })
    }));
  },
  deleteImage: (id) => {
  set(state => {
    if (state.images.find(i => i.id === id && i.locked)) return { ...state };
    return {
      images: state.images.filter(i => i.id !== id)
    };
  });
},
  setElementLocked_image: (id, locked) => {
    set(state => ({
      images: state.images.map(img => img.id === id ? { ...img, locked } : img)
    }));
  },
});;
