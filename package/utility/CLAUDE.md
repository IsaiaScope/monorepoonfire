# @package/utility — Shared Utilities

## What This Package Provides

Reusable providers, type utilities, constants, and helper functions consumed across apps and packages.

## Subpath Exports

This package uses **subpath exports** — import from specific paths, not the package root:

### `@package/utility/provider`
- `DarkModeProvider` — Dark mode context (localStorage persistence)
- `useDarkMode` — Hook: `{ theme, setTheme }`
- `TanstackQueryProvider` — React Query wrapper with optional devtools
- `TanstackRouterDevtoolsProvider` — Router devtools wrapper

### `@package/utility/tailwind`
- `cn()` — Class name merging (clsx + tailwind-merge)

### `@package/utility/constant`
- `PACKAGE_UTILITY.MEDIA_QUERY` — Tailwind breakpoints: `{ SM: 640, MD: 768, LG: 1024, XL: 1280, "2XL": 1536 }`

### `@package/utility/@types`
- `Maybe<T>` — `T | null | undefined`
- `Nullable<T>` — `T | null`
- `Undefined<T>` — `T | undefined`
- `StringKeys<T>`, `NumericKeys<T>`, `AllKeys<T>` — Key extraction types
- `StringValues<T>`, `NumericValues<T>`, `AllValues<T>` — Value extraction types

### `@package/utility/javascript`
- `ObjectKeys<T>()` — Type-safe `Object.keys` wrapper

## Usage Examples

```typescript
import { DarkModeProvider, useDarkMode } from "@package/utility/provider";
import { cn } from "@package/utility/tailwind";
import { PACKAGE_UTILITY } from "@package/utility/constant";
import type { Maybe } from "@package/utility/@types";
import { ObjectKeys } from "@package/utility/javascript";
```

## Structure

```
├── @types/      # TypeScript utility types
├── constant/    # Shared constants
├── javascript/  # JS helper functions
├── provider/    # React context providers
└── tailwind/    # Tailwind utilities (cn)
```

Each directory has its own `index.ts` barrel export.
