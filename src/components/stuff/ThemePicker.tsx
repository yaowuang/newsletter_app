import React from 'react';
import { Theme, allThemes } from '@/lib/themes';
import { cn } from '@/lib/utils';

const ThemePreview = ({ theme, isSelected }: { theme: Theme, isSelected: boolean }) => {
  const borderColor = theme.styles.section.borderColor || theme.styles.section.headingBackgroundColor || '#e5e7eb';
  const page = theme.styles.page;
  const title = theme.styles.title;
  return (
    <div
      className={cn('p-2 rounded-lg cursor-pointer flex flex-col items-center transition-colors', { 'bg-blue-100 dark:bg-blue-900': isSelected })}
      style={{ width: 100 }}
    >
      {/* Page background (acts as tile) */}
      <div
        className='w-full overflow-hidden rounded-md flex items-center justify-center'
        style={{
          height: 62, // taller to accommodate larger text
          backgroundColor: page.backgroundColor,
          backgroundImage: page.backgroundImage,
          backgroundSize: page.backgroundSize,
          backgroundPosition: page.backgroundPosition,
          backgroundRepeat: page.backgroundRepeat,
          position: 'relative'
        }}
      >
        {/* Section miniature */}
        <div
          className='flex overflow-hidden rounded-sm'
          style={{
            width: '70%',
            height: '55%', // leave room for label
            border: `2px solid ${borderColor}`,
            boxShadow: isSelected ? `0 0 0 2px rgba(0,0,0,0.15)` : undefined,
            marginTop: 2
          }}
        >
          <div style={{ backgroundColor: theme.styles.section.headingBackgroundColor, width: '40%', height: '100%' }} />
          <div style={{ backgroundColor: theme.styles.section.backgroundColor, width: '60%', height: '100%' }} />
        </div>
        {/* Theme name label inside tile */}
        <span
          style={{
            position: 'absolute',
            bottom: 4,
            left: 4,
            right: 4,
            fontFamily: title.fontFamily,
            color: title.color,
            fontSize: 12, // match text-xs (~12px)
            lineHeight: '12px',
            textAlign: title.textAlign || 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textShadow: '0 0 2px rgba(0,0,0,0.4)',
            pointerEvents: 'none'
          }}
          aria-hidden='true'
        >
          {theme.name}
        </span>
      </div>
    </div>
  );
};

interface ThemePickerProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className='w-full h-full overflow-y-auto pr-1 min-h-0'>
      <div className='grid grid-cols-2 gap-4 place-items-center pb-2'>
        {allThemes.map(theme => (
          <div key={theme.name} onClick={() => onThemeChange(theme)}>
            <ThemePreview theme={theme} isSelected={currentTheme.name === theme.name} />
          </div>
        ))}
      </div>
    </div>
  );
};
