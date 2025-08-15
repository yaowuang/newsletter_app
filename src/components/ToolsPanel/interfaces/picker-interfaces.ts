// Abstract interfaces following Interface Segregation Principle
// Each interface has a single, focused responsibility

import { LayoutSelectionType } from '@/features/newsletter/types';
import { ThemeType } from '@/lib/themes';
import { ImageSearchResult } from '@/components/stuff/services/image-search-service';

// Base interface for all picker components
export interface BasePickerProps {
  isActive?: boolean;
  onSelectionChange?: (selection: unknown) => void;
}

// Layout-specific interface
export interface LayoutPickerActions {
  onLayoutChange: (layout: LayoutSelectionType) => void;
  onSetSectionCount: (count: number) => void;
}

export interface LayoutPickerState {
  currentLayoutSelection: LayoutSelectionType;
  sectionCount: number;
}

// Theme-specific interface
export interface ThemePickerActions {
  onThemeChange: (theme: ThemeType) => void;
}

export interface ThemePickerState {
  currentTheme: ThemeType;
}

// Element creation interface
export interface ElementCreatorActions {
  onAddTextBlock: () => void;
  onAddHorizontalLine: () => void;
  onAddImage: (src: string) => void;
}

// Search interface
export interface SearchActions {
  onResultSelect: (result: ImageSearchResult) => void;
}

// Combined interfaces for components
export interface LayoutPickerProps extends BasePickerProps, LayoutPickerActions, LayoutPickerState {}
export interface ThemePickerProps extends BasePickerProps, ThemePickerActions, ThemePickerState {}
export interface ElementAdderProps extends BasePickerProps, ElementCreatorActions {}
export interface ClipartSearchProps extends BasePickerProps, SearchActions {}
