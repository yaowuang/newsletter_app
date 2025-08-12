// Centralized UI design system constants
// Provides consistent tokens for spacing, selection styling, section containers, etc.
// Import from components to standardize look & feel.
export const UI_CONSTANTS = {
  selection: 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900',
  spacing: { section: 'space-y-4', form: 'space-y-1' },
  backgrounds: {
    section: 'rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 border border-gray-100 dark:border-gray-800'
  },
  typography: {
    sectionTitle: 'text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200'
  },
  form: {
    label: 'text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400',
    input: 'h-9'
  }
} as const;

export type UIConstants = typeof UI_CONSTANTS;
