// Main exports for the refactored stuff panel components
// This follows the barrel export pattern for cleaner imports

export { ClipartSearch } from "./ClipartSearch";
export type { TabConfig, TabRegistryEntry } from "./config/tab-registry";
// Configuration and utilities
export { TabRegistry } from "./config/tab-registry";
export { ElementAdder } from "./ElementAdder";
// Hooks
export {
  useElementCreator,
  useImageUpload,
  useLayoutManager,
  useThemeManager,
} from "./hooks/use-stuff-managers";
// Interfaces
export type {
  BasePickerProps,
  ClipartSearchProps,
  ElementAdderProps,
  ElementCreatorActions,
  LayoutPickerActions,
  LayoutPickerProps,
  LayoutPickerState,
  SearchActions,
  ThemePickerActions,
  ThemePickerProps,
  ThemePickerState,
} from "./interfaces/picker-interfaces";
export { LayoutPicker } from "./LayoutPicker";
// Main component exports - Production Ready
export { StuffPanel } from "./StuffPanel";
export type {
  ImageSearchResult,
  ImageSearchService,
  SearchOptions,
} from "./services/image-search-service";
// Services
export {
  ImageSearchServiceFactory,
  PixabayImageSearchService,
} from "./services/image-search-service";
export { ThemePicker } from "./ThemePicker";
