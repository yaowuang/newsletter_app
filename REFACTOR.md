# Refactoring Plan for Better Code Organization
# Progress
**UPDATE:** `tsconfig.json` path aliases now use `src` subfolders (e.g., `@/components/*` → `./src/components/*`). All imports should use these aliases. After all renames and import updates, review and update `tsconfig.json`/`jsconfig.json` paths to ensure aliases (e.g., `@/ui`, `@/lib`, `@/common`) resolve correctly.

Use this section to track the status of each migration step. Update as you complete tasks.

| Step                                 | Status      | Notes                         |
|--------------------------------------|-------------|-------------------------------|
| Preparation                         | Complete    | Using 'refactor' branch        |
| Automated Moves                     | Complete    | Static assets, global styles, and config files moved to new locations. Tailwind and PostCSS configs at project root. |
| Component and Utility Migration     | Complete    | All shared components/utilities are under src/. No stray files remain. |
| Feature Module Extraction           | Complete    | Newsletter feature fully extracted to src/features/newsletter/. |
| Feature Module Extraction           | Complete    | Planning and identifying feature boundaries done. |
| Type Definitions                    | Complete    | All newsletter-specific types migrated to feature module. |
| Final Integration                   | Complete    | Build and lint pass, feature works in isolation. |
| Import Path Updates                 | Complete    | All imports updated to use aliases and new structure. |
| Documentation and Cleanup           | In Progress | Updating docs and reviewing for obsolete files. |

# Refactor Progress Log & TODOs

## Feature Module Extraction Plan (August 2025)

### Overview
We are beginning feature module extraction to improve code organization and maintainability. Each major feature will have its own folder under `src/features/`, containing its components, hooks, utils, and types.

### Step 1: Identify Features
- **Newsletter Builder/Editor**: Includes canvas and inspector panels, newsletter layout, and related UI/logic.
- **Calendar**: (If distinct logic exists, to be extracted in a later step.)

### Step 2: Create Feature Folders
- Create `src/features/newsletter/`, and `src/features/calendar/`.
  - Add subfolders: `components/`, `hooks/`, `utils/`, and `types.ts` as needed.

### Step 3: Move Files
- Move all files from `src/components/canvas-panel/` and `src/components/inspector-panel/` to `src/features/newsletter/components/`.
- Move any related utilities from `src/lib/` (e.g., newsletter-specific logic) to `src/features/newsletter/utils/`.
- Move any newsletter-specific types to `src/features/newsletter/types.ts`.

### Step 4: Update Imports
- Update all imports in moved files to use the new paths or path aliases.
- Use relative imports within the feature folder where possible.

### Step 5: Test in Isolation
- Test the newsletter feature after migration to ensure nothing is broken.

### Example Structure After Extraction
```
src/
  features/
    newsletter/
      components/
        CanvasPanel.tsx
        TextBlock.tsx
        CalendarGrid.tsx
        ...
      utils/
        ...
      types.ts
      hooks/
        ...
```

---

  

## TODOs / Items for Clarification
- [ ] Review all shared components and utilities for migration. Some files may have mixed concerns (UI + logic); clarify if they should be split.
- [ ] Identify any feature-specific logic currently in `lib/` or `components/` that should move to a `features/` module.
- [ ] Some config files (e.g., `tsconfig.json`) may need special handling if tooling expects them at the root. Document any exceptions.
- [ ] Check for any hardcoded import paths in the codebase that may break after moves.
- [ ] Plan for incremental PRs to keep refactor reviewable.

---
# Strategy: Divide and Conquer

To ensure a smooth and low-risk refactor, follow this phased strategy:

## 1. Preparation
- Review the current codebase and map existing files to the new structure.
- Communicate the plan to all contributors and pause major feature work if possible.
- Set up a dedicated refactor branch in version control.

## 2. Automated Moves (Low-Risk)
- Move static assets, global styles, and configuration files to their new locations.
- Update references in config files (e.g., Tailwind, ESLint, PostCSS) as needed.

## 3. Component and Utility Migration
- Move shared components to `components/` and update imports.
- Move utilities to `lib/` and update imports.
- Move custom hooks to `hooks/` or feature folders as appropriate.

## 4. Feature Module Extraction
- For each major feature, create a folder in `features/` and move related components, hooks, utils, and types.
- Refactor imports within each feature module.
- Test each feature in isolation after migration.

## 5. Type Definitions
- Move global types to `types/` and feature-specific types to their respective feature folders.
- Update all type imports.

## 6. Final Integration
- Update all remaining import paths project-wide.
- Run the app and all tests to ensure nothing is broken.
- Fix any issues and run lint/format scripts.

## 7. Documentation and Cleanup
- Update README and internal docs to reflect the new structure.
- Remove obsolete files and code.
- Merge the refactor branch after review.

---

## Goals
- Improve maintainability and scalability
- Enhance discoverability of components and logic
- Separate concerns (UI, logic, configuration, assets)
- Adopt Next.js and React best practices

---

## 1. Directory Structure
**Note:** For Next.js and Tailwind CSS to work correctly, `tailwind.config.mjs` and `postcss.config.mjs` must be located at the project root (`app/`). Do not move these files to a subfolder unless you add custom logic to your build tooling.
## Path Aliases (from tsconfig.json)

The following path aliases are defined in `tsconfig.json` and should be used for all imports:

```jsonc
{
  "@/*": ["./src/*"],
  "@/config/*": ["./config/*"],
  "@/types/*": ["./types/*"]
}
```

Update or add additional aliases here as the project evolves. All code should use these aliases for imports, and documentation should be kept in sync with this plan.

### Updated Structure
```
app/
  src/
    components/       # Shared React components (UI, layout, widgets)
    features/         # Feature-specific modules (each with its own components, logic, hooks)
    lib/              # Utility functions, data fetching, business logic
    hooks/            # Custom React hooks (if not feature-specific)
    app/              # Next.js app directory (routes, layouts, etc.)
  styles/             # Global and modular CSS/SCSS files
  public/             # Static assets (images, icons, etc.)
  config/             # Configuration files (e.g., tailwind, eslint, etc.)
  types/              # TypeScript type definitions
```

### Example Feature Module
```
features/
  newsletter/
    components/
    hooks/
    utils/
    types.ts
    index.ts
```

---

## 2. Component Organization
- Move all generic, reusable components to `components/`
- Move feature-specific components to `features/<feature>/components/`
- Use index files for cleaner imports

---

## 3. Utilities and Logic
- Place shared utilities in `lib/`
- Place feature-specific logic in `features/<feature>/utils/`

---

## 4. Styles
- Move global styles to `styles/`
- Use CSS modules or styled-components for component-level styles

---

## 5. Type Definitions
- Place global types in `types/`
- Place feature-specific types in `features/<feature>/types.ts`

---

## 6. Configuration
- Move config files (e.g., Tailwind, ESLint, PostCSS) to `config/` if supported by tooling

---

## 7. Naming Conventions
- Use PascalCase for components and files exporting components, this should be all .tsx files.
- Use camelCase for variables, functions, and hooks.
- Use kebab-case for other file and folder names.

---

## 8. Next Steps
1. Gradually migrate files to the new structure
2. Update import paths as needed
3. Refactor in small, testable increments
4. Update documentation and README

---

## 9. References
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing/best-practices)
- [React Project Structure](https://react.dev/learn/project-structure)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

*This plan aims to make the codebase easier to navigate, maintain, and scale as the project grows.*
