import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabRegistry } from './config/tab-registry';
import { LayoutPicker } from './LayoutPicker.refactored';
import { ThemePicker } from './ThemePicker.refactored';
import { ElementAdder } from './ElementAdder.refactored';
import { ClipartSearch } from './ClipartSearch.refactored';
import { 
  useLayoutManager, 
  useThemeManager, 
  useElementCreator 
} from './hooks/use-stuff-managers';

// Refactored StuffPanel following SOLID principles:
// - Single Responsibility: Only handles tab orchestration and layout
// - Open/Closed: New tabs can be added via registry without modifying this component
// - Dependency Inversion: Uses hooks instead of direct store access

interface RefactoredStuffPanelProps {
  defaultTab?: string;
  className?: string;
}

export function RefactoredStuffPanel({ 
  defaultTab = 'layouts', 
  className = 'flex h-full flex-col p-4' 
}: RefactoredStuffPanelProps) {
  // Use custom hooks for state management (Dependency Inversion)
  const layoutManager = useLayoutManager();
  const themeManager = useThemeManager();
  const elementCreator = useElementCreator();

  // Initialize tab registry (could be moved to app initialization)
  const tabEntries = useMemo(() => {
    const registry = TabRegistry.getInstance();
    
    // Clear and re-register tabs (in a real app, this would be done once at startup)
    registry.register({
      config: {
        id: 'layouts',
        label: 'Layouts',
        component: LayoutPicker
      },
      props: {
        ...layoutManager,
        isActive: true
      }
    });

    registry.register({
      config: {
        id: 'themes',
        label: 'Themes',
        component: ThemePicker
      },
      props: {
        ...themeManager,
        isActive: true
      }
    });

    registry.register({
      config: {
        id: 'elements',
        label: 'Elements',
        component: ElementAdder
      },
      props: {
        ...elementCreator,
        isActive: true
      }
    });

    registry.register({
      config: {
        id: 'clipart',
        label: 'Clipart',
        component: ClipartSearch
      },
      props: {
        onResultSelect: elementCreator.onAddImage,
        isActive: true
      }
    });

    return registry.getTabs();
  }, [layoutManager, themeManager, elementCreator]);

  return (
    <div className={className}>
      <Tabs defaultValue={defaultTab} className="flex-grow flex flex-col">
        <TabsList className={`grid w-full grid-cols-${tabEntries.length}`}>
          {tabEntries.map(({ config }) => (
            <TabsTrigger key={config.id} value={config.id}>
              {config.icon && <config.icon className="h-4 w-4 mr-2" />}
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabEntries.map(({ config, props }) => (
          <TabsContent 
            key={config.id} 
            value={config.id} 
            className={getTabContentClassName(config.id)}
          >
            <config.component {...props} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Helper function for tab-specific styling
function getTabContentClassName(tabId: string): string {
  const baseClasses = 'mt-4';
  
  switch (tabId) {
    case 'themes':
      return `${baseClasses} flex flex-col min-h-0 flex-1`;
    case 'clipart':
      return `${baseClasses} space-y-4`;
    default:
      return baseClasses;
  }
}

// Export both old and new components for gradual migration
// export { StuffPanel as LegacyStuffPanel } from '../stuff-panel';
