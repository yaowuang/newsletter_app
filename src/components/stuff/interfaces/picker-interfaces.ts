// Abstract interfaces following Interface Segregation Principle
// Each interface has a single, focused responsibility

import { LayoutSelection } from '@/lib/types';
import { Theme } from '@/lib/themes';

// Base interface for all picker components
export interface BasePickerProps {
  isActive?: boolean;
  onSelectionChange?: (selection: any) => void;
}

// Layout-specific interface
export interface LayoutPickerActions {
  onLayoutChange: (layout: LayoutSelection) => void;
  onSetSectionCount: (count: number) => void;
}

export interface LayoutPickerState {
  currentLayoutSelection: LayoutSelection;
  sectionCount: number;
}

// Theme-specific interface
export interface ThemePickerActions {
  onThemeChange: (theme: Theme) => void;
}

export interface ThemePickerState {
  currentTheme: Theme;
}

// Element creation interface
export interface ElementCreatorActions {
  onAddTextBlock: () => void;
  onAddHorizontalLine: () => void;
  onAddImage: (src: string) => void;
}

// Search interface
export interface SearchActions {
  onResultSelect: (result: any) => void;
}

// Combined interfaces for components
export interface LayoutPickerProps extends BasePickerProps, LayoutPickerActions, LayoutPickerState {}
export interface ThemePickerProps extends BasePickerProps, ThemePickerActions, ThemePickerState {}
export interface ElementAdderProps extends BasePickerProps, ElementCreatorActions {}
export interface ClipartSearchProps extends BasePickerProps, SearchActions {}
