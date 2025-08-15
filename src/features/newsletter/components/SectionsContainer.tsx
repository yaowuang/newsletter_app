import React from 'react';
import { cn } from '@/lib/utils';
import { UI_CONSTANTS } from '@/lib/ui-constants';
import { TextBlock as TextBlockComponent } from './TextBlock';
import type { TextBlock, SectionStylesType, LayoutSelectionType } from '@/features/newsletter/types';
import type { ThemeType } from '@/lib/themes';
import { CSSProperties } from 'react';

interface SectionsContainerProps {
  textBlocks: TextBlock[];
  sectionStyles: SectionStylesType;
  theme: ThemeType;
  denseMode: boolean;
  selectedElement: { id: string; type: 'text' | 'image' | 'horizontalLine' | 'calendarDate' } | null;
  onSelectElement: (id: string, type: 'text', subType?: 'title' | 'content') => void;
  layoutSelection: LayoutSelectionType; // Add this to know how many sections the layout supports
}

/**
 * Sections container component - renders all text sections
 * Follows SRP by focusing only on text sections layout and interactions
 */
export function SectionsContainer({
  textBlocks,
  sectionStyles,
  theme,
  denseMode,
  selectedElement,
  onSelectElement,
  layoutSelection,
}: SectionsContainerProps) {
  // Only render sections that the current layout can accommodate
  const maxSections = layoutSelection.base.sections;
  const visibleTextBlocks = textBlocks.slice(0, maxSections);
  
  return (
    <div style={{ display: 'contents' }}>
      {visibleTextBlocks.map((block, index) => {
        const gridArea = `sec${index + 1}`;
        if (!gridArea) return null;
        
        const userStyle = sectionStyles[block.id] || {};
        const themeStyle = theme.styles.section;
        const isSelected = selectedElement?.id === block.id && selectedElement?.type === 'text';
        
        const sectionContainerStyle: CSSProperties = {
          gridArea,
          borderWidth: userStyle.borderWidth ? `${userStyle.borderWidth}px` : '1px',
          borderRadius: userStyle.borderRadius != null 
            ? `${userStyle.borderRadius}px` 
            : (themeStyle.borderRadius != null ? `${themeStyle.borderRadius}px` : '0px'),
          borderColor: userStyle.borderColor || (isSelected ? 'blue' : themeStyle.borderColor),
          borderStyle: 'solid',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: userStyle.backgroundColor || themeStyle.backgroundColor,
        };
        
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          // Default click (background of section) selects content region
          onSelectElement(block.id, 'text', 'content');
        };

        return (
          <div 
            key={block.id} 
            style={sectionContainerStyle} 
            onClick={handleClick}
            className={cn("cursor-pointer relative z-10", {
              [UI_CONSTANTS.selection]: isSelected
            })}
          >
            <TextBlockComponent 
              block={block} 
              style={userStyle} 
              themeStyle={themeStyle} 
              denseMode={denseMode} 
              onSelectElement={onSelectElement}
            />
          </div>
        );
      })}
    </div>
  );
}
