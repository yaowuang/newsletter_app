# Development Best Practices

This guide summarizes key best practices for contributing to this codebase. Follow these guidelines to ensure code quality, maintainability, and consistency.

## 1. Project Structure
**Shared components**: Place in `src/components/`.
**Feature modules**: Place in `src/features/<feature>/` (with their own components, hooks, utils, types).
**Utilities**: Place shared utilities in `src/lib/`.
**Global styles**: Place in `styles/`.
**Static assets**: Place in `public/`.
**Configuration**: Place config files in `config/` if supported by tooling.
**Types**: Place global types in `types/` and feature-specific types in `src/features/<feature>/types.ts`.
**Custom hooks**: Place in `src/hooks/` or within feature folders.

## 2. Naming Conventions
- **Components**: Use PascalCase for all component files (`.tsx`).
- **Variables, functions, hooks**: Use camelCase.
- **Other files/folders**: Use kebab-case.

## 3. Imports & Aliases
- Use path aliases (e.g., `@/components`, `@/lib`, `@/common`, `@/features`) as defined in `tsconfig.json`, all pointing to subfolders of `src/`.
- Update import paths after moving files.
- Do not create any more aliases without explicit approval.

## 4. Separation of Concerns
- Keep UI, logic, and configuration separate.
- Place feature-specific logic and components within their feature module.
- Avoid mixing unrelated concerns in a single file.

## 5. Refactoring & PRs
- Refactor in small, testable increments.
- Update documentation and README as needed.
- Plan for incremental PRs to keep reviews manageable.

## 6. Code Quality
- Run lint and format scripts before committing.
- Test features in isolation after migration or major changes.
- Review and update type definitions as needed.

## 7. Documentation
- Update internal docs to reflect structure changes.
- Document any exceptions or special cases (e.g., config file locations).
