import React from 'react';
import { PastelRotateText } from '@/components/common/PastelRotateText';
import { RainbowRotateText } from '@/components/common/RainbowRotateText';
import { Theme, allThemes } from '@/lib/themes';
import { ThemePickerProps } from './interfaces/picker-interfaces';
import { cn } from '@/lib/utils';

// Refactored ThemePicker following Single Responsibility Principle
// Separated theme preview logic and improved component organization
export const ThemePicker: React.FC<ThemePickerProps> = ({ 
  currentTheme, 
  onThemeChange
}) => {
  return (
    <div className="w-full h-full overflow-y-auto pr-1 min-h-0">
      <ThemeGrid
        themes={allThemes}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
      />
    </div>
  );
};

// Extracted theme grid component
const ThemeGrid: React.FC<{
  themes: Theme[];
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}> = ({ themes, currentTheme, onThemeChange }) => (
  <div className="grid grid-cols-2 gap-4 place-items-center pb-2">
    {themes.map(theme => (
      <ThemePreviewCard
        key={theme.name}
        theme={theme}
        isSelected={currentTheme.name === theme.name}
        onClick={() => onThemeChange(theme)}
      />
    ))}
  </div>
);

// Extracted theme preview card component
const ThemePreviewCard: React.FC<{
  theme: Theme;
  isSelected: boolean;
  onClick: () => void;
}> = ({ theme, isSelected, onClick }) => (
  <div onClick={onClick}>
    <ThemePreview theme={theme} isSelected={isSelected} />
  </div>
);

// Refactored theme preview component with better organization
const ThemePreview: React.FC<{ 
  theme: Theme; 
  isSelected: boolean; 
}> = ({ theme, isSelected }) => {
  const borderColor = theme.styles.section.borderColor || 
                     theme.styles.section.headingBackgroundColor || 
                     '#e5e7eb';
  
  return (
    <div
      className={cn(
        'p-2 rounded-lg cursor-pointer flex flex-col items-center transition-colors',
        { 'bg-blue-100 dark:bg-blue-900': isSelected }
      )}
      style={{ width: 100 }}
    >
      <ThemePreviewTile
        theme={theme}
        borderColor={borderColor}
        isSelected={isSelected}
      />
    </div>
  );
};

// Extracted preview tile component
const ThemePreviewTile: React.FC<{
  theme: Theme;
  borderColor: string;
  isSelected: boolean;
}> = ({ theme, borderColor, isSelected }) => {
  const { page, title, section } = theme.styles;

  return (
    <div
      className="w-full overflow-hidden rounded-md flex items-center justify-center"
      style={{
        height: 62,
        backgroundColor: page.backgroundColor,
        backgroundImage: page.backgroundImage,
        backgroundSize: page.backgroundSize,
        backgroundPosition: page.backgroundPosition,
        backgroundRepeat: page.backgroundRepeat,
        position: 'relative'
      }}
    >
      <ThemePreviewSection
        section={section}
        borderColor={borderColor}
        isSelected={isSelected}
      />
      
      <ThemePreviewLabel
        theme={theme}
        title={title}
      />
    </div>
  );
};

// Extracted section miniature component
const ThemePreviewSection: React.FC<{
  section: Theme['styles']['section'];
  borderColor: string;
  isSelected: boolean;
}> = ({ section, borderColor, isSelected }) => (
  <div
    className="flex overflow-hidden rounded-sm"
    style={{
      width: '70%',
      height: '55%',
      border: `2px solid ${borderColor}`,
      boxShadow: isSelected ? `0 0 0 2px rgba(0,0,0,0.15)` : undefined,
      marginTop: 2
    }}
  >
    <div
      style={{
        backgroundColor: section.headingBackgroundColor,
        width: '40%',
        height: '100%'
      }}
    />
    <div
      style={{
        backgroundColor: section.backgroundColor,
        width: '60%',
        height: '100%'
      }}
    />
  </div>
);

// Extracted theme name label component
const ThemePreviewLabel: React.FC<{
  theme: Theme;
  title: Theme['styles']['title'];
}> = ({ theme, title }) => {
  // Handle rainbow gradient styles
  const isPastelRotate = title.textEffectId === 'pastel-rotate';
  const isRainbowRotate = title.textEffectId === 'rainbow-rotate';
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    fontFamily: title.fontFamily,
    fontSize: 12,
    lineHeight: '12px',
    textAlign: title.textAlign || 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
  };

  if (!isPastelRotate && !isRainbowRotate) {
    Object.assign(baseStyle, {
      color: title.color,
      textShadow: title.textShadow || '0 0 2px rgba(0,0,0,0.4)',
      backgroundImage: title.backgroundImage,
      backgroundColor: title.backgroundColor,
      backgroundSize: title.backgroundSize,
      WebkitBackgroundClip: title.WebkitBackgroundClip,
      backgroundClip: title.backgroundClip,
      filter: title.filter,
      transform: title.transform,
    });
  }

  if (isPastelRotate) {
    return (
      <PastelRotateText text={theme.name} style={baseStyle} ariaLabel={theme.name} />
    );
  } else if (isRainbowRotate) {
    return (
      <RainbowRotateText text={theme.name} style={baseStyle} ariaLabel={theme.name} />
    );
  } else {
    return (
      <span style={baseStyle} aria-hidden="true">{theme.name}</span>
    );
  }
};
