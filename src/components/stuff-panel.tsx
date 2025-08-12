import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutPicker } from '@/components/stuff/LayoutPicker';
import { ThemePicker } from '@/components/stuff/ThemePicker';
import { ElementAdder } from '@/components/stuff/ElementAdder';
import { ClipartSearch } from '@/components/stuff/ClipartSearch';
import { LayoutSelection } from '@/lib/types';
import { Theme } from '@/lib/themes';

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

export function StuffPanel({ currentLayoutSelection, onLayoutChange, currentTheme, onThemeChange, onAddTextBlock, onAddHorizontalLine, onSetSectionCount, sectionCount }: StuffPanelProps) {
  return (
    <div className="flex h-full flex-col p-4">
      <Tabs defaultValue="layouts" className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="clipart">Clipart</TabsTrigger>
        </TabsList>
        <TabsContent value="layouts" className="mt-4">
          <LayoutPicker
            currentLayoutSelection={currentLayoutSelection}
            onLayoutChange={onLayoutChange}
            onSetSectionCount={onSetSectionCount}
            sectionCount={sectionCount}
          />
        </TabsContent>
        <TabsContent value="themes" className="mt-4 flex flex-col min-h-0 flex-1">
          <div className="flex-1 min-h-0">
            <ThemePicker currentTheme={currentTheme} onThemeChange={onThemeChange} />
          </div>
        </TabsContent>
        <TabsContent value="elements" className="mt-4">
          <ElementAdder onAddTextBlock={onAddTextBlock} onAddHorizontalLine={onAddHorizontalLine} />
        </TabsContent>
        <TabsContent value="clipart" className="mt-4 space-y-4">
          <ClipartSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
}