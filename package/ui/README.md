# @package/ui

Application-level UI components for the MonorepoOnFire monorepo.

## Overview

Compositions of `@package/shadcn` primitives with app-specific logic. All exports use the `UI` prefix (e.g., `UIButton`, `UIWrapper`).

## Usage

```tsx
import { UIWrapper, UIDarkModeSwitch, UILink, UIFullPageDotsLoaderOnFire } from "@package/ui";
```

## Components

| Component | Description | Key Dependencies |
|-----------|-------------|------------------|
| `UIDarkModeSwitch` | Theme toggle dropdown (light/dark) | DropdownMenu, `useDarkMode` |
| `UIBoundaryError` | Error boundary fallback component | react-error-boundary |
| `UIRouterError` | TanStack Router error display | @tanstack/react-router |
| `UIImage` | Custom image component | — |
| `UILanguageSelector` | Language picker with country flags | DropdownMenu, i18next |
| `UILink` | TanStack Router link wrapper | @tanstack/react-router |
| `UIFullPageDotsLoaderOnFire` | Full-page loading indicator | — |
| `UIWrapper` | Page section layout wrapper | — |

## Development

```bash
pnpm --filter @package/ui test        # Run tests
pnpm --filter @package/ui test:watch   # Watch mode
```

Each component has a colocated test file. Uses jsdom + Testing Library.
