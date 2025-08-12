// Tab Registry - Follows Open/Closed Principle
// Makes it easy to add/remove tabs without modifying core StuffPanel code

export interface TabConfig {
  id: string;
  label: string;
  component: React.ComponentType<any>;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface TabRegistryEntry {
  config: TabConfig;
  props: Record<string, any>;
}

export class TabRegistry {
  private static instance: TabRegistry;
  private tabs: Map<string, TabRegistryEntry> = new Map();

  static getInstance(): TabRegistry {
    if (!TabRegistry.instance) {
      TabRegistry.instance = new TabRegistry();
    }
    return TabRegistry.instance;
  }

  register(entry: TabRegistryEntry): void {
    this.tabs.set(entry.config.id, entry);
  }

  unregister(tabId: string): void {
    this.tabs.delete(tabId);
  }

  getTabs(): TabRegistryEntry[] {
    return Array.from(this.tabs.values());
  }

  getTab(tabId: string): TabRegistryEntry | undefined {
    return this.tabs.get(tabId);
  }
}
