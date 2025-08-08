import React from 'react';
import { Theme, allThemes } from '@/lib/themes';
import { cn } from '@/lib/utils';

const ThemePreview = ({ theme, isSelected }: { theme: Theme, isSelected: boolean }) => {
  const borderColor = theme.styles.section.borderColor || theme.styles.section.headingBackgroundColor || '#e5e7eb';
  return (
    <div
      className={cn('p-2 rounded-lg cursor-pointer flex flex-col items-center transition-colors', { 'bg-blue-100 dark:bg-blue-900': isSelected })}
      style={{ width: 100 }}
    >
      <div
        className='flex w-full overflow-hidden rounded-md'
        style={{
          height: 40,
          border: `2px solid ${borderColor}`,
          boxShadow: isSelected ? `0 0 0 2px rgba(0,0,0,0.15)` : undefined,
        }}
      >
        <div style={{ backgroundColor: theme.styles.section.headingBackgroundColor, width: '50%', height: '100%' }} />
        <div style={{ backgroundColor: theme.styles.section.backgroundColor, width: '50%', height: '100%' }} />
      </div>
      <p className='text-xs text-center mt-1 w-full truncate'>{theme.name}</p>
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
