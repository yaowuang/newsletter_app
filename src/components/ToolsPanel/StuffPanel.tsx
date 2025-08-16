import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LayoutSelectionType } from "@/features/newsletter/types";
import { ClipartSearch } from "./ClipartSearch";
import { TabRegistry } from "./config/tab-registry";
import { ElementAdder } from "./ElementAdder";
import { useElementCreator, useLayoutManager, useThemeManager } from "./hooks/use-stuff-managers";
import { LayoutPicker } from "./LayoutPicker";
import type { ImageSearchResult } from "./services/image-search-service";
import { ThemePicker } from "./ThemePicker";

// Production-ready StuffPanel that can be used as a drop-in replacement
// This component maintains the same interface as the original but uses the refactored architecture
interface StuffPanelProps {
  // Optional props for backwards compatibility
  defaultTab?: string;
  className?: string;

  // Legacy props (will be ignored but kept for backwards compatibility)
  currentLayoutSelection?: LayoutSelectionType;
  onLayoutChange?: (layout: LayoutSelectionType) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onAddTextBlock?: () => void;
  onAddHorizontalLine?: () => void;
  onSetSectionCount?: (count: number) => void;
  sectionCount?: number;
}

export function StuffPanel({
  defaultTab = "layouts",
  className = "flex h-full flex-col p-4",
  // Legacy props are accepted but ignored (handled internally now)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...legacyProps
}: StuffPanelProps) {
  // Use custom hooks for state management (replaces prop passing)
  const layoutManager = useLayoutManager();
  const themeManager = useThemeManager();
  const elementCreator = useElementCreator();

  // Initialize tab registry with all components
  const tabEntries = useMemo(() => {
    const registry = TabRegistry.getInstance();

    // Clear existing tabs to avoid duplicates
    registry.unregister("layouts");
    registry.unregister("themes");
    registry.unregister("elements");
    registry.unregister("clipart");

    // Register all tabs
    registry.register({
      config: {
        id: "layouts",
        label: "Layouts",
        component: LayoutPicker,
      },
      props: {
        ...layoutManager,
        isActive: true,
      },
    });

    registry.register({
      config: {
        id: "themes",
        label: "Themes",
        component: ThemePicker,
      },
      props: {
        ...themeManager,
        isActive: true,
      },
    });

    registry.register({
      config: {
        id: "elements",
        label: "Elements",
        component: ElementAdder,
      },
      props: {
        ...elementCreator,
        isActive: true,
      },
    });

    registry.register({
      config: {
        id: "clipart",
        label: "Clipart",
        component: ClipartSearch,
      },
      props: {
        // Adapt the picker contract (expects ImageSearchResult) to elementCreator (expects src string)
        onResultSelect: (result: ImageSearchResult) => elementCreator.onAddImage(result.fullSize),
        isActive: true,
      },
    });

    return registry.getTabs();
  }, [layoutManager, themeManager, elementCreator]);

  return (
    <div className={className}>
      <Tabs defaultValue={defaultTab} className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          {tabEntries.map(({ config }) => (
            <TabsTrigger key={config.id} value={config.id}>
              {config.icon && <config.icon className="h-4 w-4 mr-2" />}
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabEntries.map(({ config, props }) => (
          <TabsContent key={config.id} value={config.id} className={getTabContentClassName(config.id)}>
            <config.component {...props} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Helper function for tab-specific styling
function getTabContentClassName(tabId: string): string {
  const baseClasses = "mt-4";

  switch (tabId) {
    case "themes":
      return `${baseClasses} flex flex-col min-h-0 flex-1`;
    case "clipart":
      return `${baseClasses} space-y-4`;
    default:
      return baseClasses;
  }
}
