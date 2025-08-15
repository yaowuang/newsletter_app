import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import { ImageElementType } from '@/features/newsletter/types';

export interface ImageSlice {
	images: ImageElementType[];
	addImage: () => void;
	updateImage: (id: string, newProps: Partial<ImageElementType>) => void;
	deleteImage: (id: string) => void;
	setElementLocked_image: (id: string, locked: boolean) => void;
}

export const createImageSlice: StateCreator<ImageSlice, [], [], ImageSlice> = (set) => ({
  images: [],
  addImage: () => {
    const newImage: ImageElementType = { id: nanoid(), type: 'image', src: '', x: 50, y: 50, width: 200, height: 150 };
    set(state => ({ images: [...state.images, newImage] }));
  },
  updateImage: (id, newProps) => {
    set(state => ({
      images: state.images.map(img => img.id === id ? { ...img, ...newProps } : img)
    }));
  },
  deleteImage: (id: string) => {
    set(state => ({ images: state.images.filter(img => img.id !== id) }));
  },
  setElementLocked_image: (id: string, locked: boolean) => {
    set(state => ({
      images: state.images.map(img => img.id === id ? { ...img, locked } : img)
    }));
  }
});;;
