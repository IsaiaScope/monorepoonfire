# @package/ui — Application UI Components

## What This Package Provides

Higher-level UI components that compose `@package/shadcn` primitives with app-specific logic. All components are prefixed with `UI` to avoid naming collisions.

## Exports

**Import from:** `@package/ui`

| Component | File | Purpose |
|-----------|------|---------|
| `UIDarkModeSwitch` | dark-mode-switch/ | Theme toggle dropdown (light/dark) |
| `UIBoundaryError` | error/ | Error boundary fallback component |
| `UIRouterError` | error/ | TanStack Router error component |
| `UIImage` | image/ | Custom image component |
| `UILanguageSelector` | language-selector/ | Language picker with country flags |
| `UILink` | link/ | Wraps TanStack Router Link |
| `UIFullPageDotsLoaderOnFire` | loader/ | Full-page loading spinner |
| `UIWrapper` | wrapper/ | Page section layout wrapper |

## Structure

Each component follows a **component-per-folder** pattern with colocated tests:

```
src/{component-name}/
├── {component-name}.tsx
└── {component-name}.test.tsx
```

## Key Dependencies

- `@package/shadcn` — Radix primitives (Button, DropdownMenu, etc.)
- `@package/utility` — `useDarkMode` hook, `cn()` utility
- `@tanstack/react-router` — Router integration for UILink
- `react-error-boundary` — For UIBoundaryError

## Adding a Component

1. Create folder `src/{component-name}/`
2. Create `{component-name}.tsx` with `UI` prefix in export name
3. Create `{component-name}.test.tsx`
4. Export from `src/index.ts`

## Testing

```bash
pnpm --filter @package/ui test
```

Uses jsdom environment. Tests run in parallel (no database dependencies).
