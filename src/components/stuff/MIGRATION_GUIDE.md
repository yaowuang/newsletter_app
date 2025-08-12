# Migration Guide: StuffPanel Refactoring

This guide will help you migrate from the legacy StuffPanel implementation to the new refactored version that follows SOLID design principles.

## Quick Migration

### Step 1: Update Imports

**Before:**
```typescript
import { StuffPanel } from '@/components/stuff-panel';
```

**After:**
```typescript
import { StuffPanel } from '@/components/stuff';
```

### Step 2: Update Props Interface

**Before:**
```typescript
interface StuffPanelProps {
  currentLayoutSelection: LayoutSelection;
  onLayoutChange: (layout: LayoutSelection) => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onAddTextBlock: () => void;
  onAddHorizontalLine: () => void;
  onSetSectionCount: (count: number) => void;
  sectionCount: number;
}
```

**After:**
```typescript
interface RefactoredStuffPanelProps {
  defaultTab?: string;
  className?: string;
}

// State management is now handled internally via custom hooks
```

### Step 3: Update Component Usage

**Before:**
```typescript
<StuffPanel
  currentLayoutSelection={layoutSelection}
  onLayoutChange={handleLayoutChange}
  currentTheme={theme}
  onThemeChange={handleThemeChange}
  onAddTextBlock={handleAddTextBlock}
  onAddHorizontalLine={handleAddHorizontalLine}
  onSetSectionCount={handleSetSectionCount}
  sectionCount={sectionCount}
/>
```

**After:**
```typescript
<StuffPanel
  defaultTab="layouts"
  className="flex h-full flex-col p-4"
/>
```

## Advanced Migration

### Using Individual Components

If you need more control, you can use individual components:

```typescript
import { 
  LayoutPicker, 
  ThemePicker, 
  ElementAdder, 
  ClipartSearch,
  useLayoutManager,
  useThemeManager,
  useElementCreator
} from '@/components/stuff';

function CustomStuffPanel() {
  const layoutManager = useLayoutManager();
  const themeManager = useThemeManager();
  const elementCreator = useElementCreator();

  return (
    <div className="space-y-4">
      <LayoutPicker {...layoutManager} />
      <ThemePicker {...themeManager} />
      <ElementAdder {...elementCreator} />
      <ClipartSearch onResultSelect={elementCreator.onAddImage} />
    </div>
  );
}
```

### Adding Custom Tabs

```typescript
import { TabRegistry } from '@/components/stuff';

// Register a new tab
const registry = TabRegistry.getInstance();
registry.register({
  config: {
    id: 'custom-tab',
    label: 'Custom',
    component: MyCustomComponent
  },
  props: {
    customProp: 'value'
  }
});
```

### Creating Custom Search Services

```typescript
import { ImageSearchService, ImageSearchResult } from '@/components/stuff';

class MySearchService implements ImageSearchService {
  async search(query: string): Promise<ImageSearchResult[]> {
    // Your implementation
    return [];
  }
}
```

## Breaking Changes

### 1. Props Interface Changed
- The new component uses internal state management
- Props are significantly simplified
- State is managed through custom hooks

### 2. Component Structure
- Sub-components are now extracted and can be used independently
- Better separation of concerns
- Improved testability

### 3. Service Layer Added
- API calls are now abstracted into service classes
- Better error handling and type safety
- Easier to mock for testing

## Migration Checklist

- [ ] Update imports to use the new component
- [ ] Remove prop passing (state is now internal)
- [ ] Test all functionality works as expected
- [ ] Update any tests to use the new structure
- [ ] Consider using individual components if more control is needed
- [ ] Update documentation and comments

## Benefits After Migration

1. **Better Maintainability**: Clear separation of concerns
2. **Improved Testability**: Components can be tested in isolation
3. **Enhanced Extensibility**: Easy to add new tabs or features
4. **Better Type Safety**: More precise interfaces
5. **Reduced Coupling**: Components are less dependent on each other

## Rollback Plan

If you need to rollback during migration:

```typescript
// Use legacy components during transition
import { 
  LayoutPicker as LegacyLayoutPicker,
  ThemePicker as LegacyThemePicker,
  ElementAdder as LegacyElementAdder,
  ClipartSearch as LegacyClipartSearch
} from '@/components/stuff';

// Or import the original files directly
import { StuffPanel } from '@/components/stuff-panel';
```

## Testing the Migration

1. **Visual Testing**: Ensure UI looks the same
2. **Functional Testing**: Verify all interactions work
3. **Performance Testing**: Check for any performance regressions
4. **Integration Testing**: Test with the rest of your application

## Need Help?

If you encounter issues during migration:

1. Check the REFACTORING_SUMMARY.md for detailed information
2. Use the StuffPanel.test.tsx component to validate functionality
3. Refer to the interface definitions in picker-interfaces.ts
4. Check the service implementations in image-search-service.ts
