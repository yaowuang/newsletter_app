// Main exports for the refactored stuff panel components
// This follows the barrel export pattern for cleaner imports

// Main component exports - Production Ready
export { StuffPanel } from './StuffPanel';
export { LayoutPicker } from './LayoutPicker';
export { ThemePicker } from './ThemePicker';
export { ElementAdder } from './ElementAdder';
export { ClipartSearch } from './ClipartSearch';

// Configuration and utilities
export { TabRegistry } from './config/tab-registry';
export type { TabConfig, TabRegistryEntry } from './config/tab-registry';

// Interfaces
export type {
  BasePickerProps,
  LayoutPickerProps,
  ThemePickerProps,
  ElementAdderProps,
  ClipartSearchProps,
  LayoutPickerActions,
  LayoutPickerState,
  ThemePickerActions,
  ThemePickerState,
  ElementCreatorActions,
  SearchActions
} from './interfaces/picker-interfaces';

// Services
export {
  ImageSearchServiceFactory,
  PixabayImageSearchService
} from './services/image-search-service';
export type {
  ImageSearchService,
  ImageSearchResult,
  SearchOptions
} from './services/image-search-service';

// Hooks
export {
  useLayoutManager,
  useThemeManager,
  useElementCreator,
  useImageUpload
} from './hooks/use-stuff-managers';