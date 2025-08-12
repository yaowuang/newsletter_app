import React from 'react';
import { cn } from '@/lib/utils';
import { UI_CONSTANTS } from '@/lib/ui-constants';
import { TextBlock as TextBlockComponent } from './TextBlock';
import type { TextBlock, SectionStyles } from '@/lib/types';
import type { Theme } from '@/lib/themes';
import { CSSProperties } from 'react';

interface SectionsContainerProps {
  textBlocks: TextBlock[];
  sectionStyles: SectionStyles;
  theme: Theme;
  denseMode: boolean;
  selectedElement: { id: string; type: 'text' | 'image' | 'horizontalLine' } | null;
  onSelectElement: (id: string, type: 'text') => void;
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
}: SectionsContainerProps) {
  return (
    <div style={{ display: 'contents' }}>
      {textBlocks.map((block, index) => {
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
          onSelectElement(block.id, 'text');
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
            />
          </div>
        );
      })}
    </div>
  );
}
