# @package/utility

Shared utilities, providers, types, and constants for the MonorepoOnFire monorepo.

## Overview

Cross-cutting concerns shared between apps and packages. Uses subpath exports for tree-shaking.

## Installation

Already included as `"@package/utility": "workspace:*"` in consuming packages.

## Exports

| Import Path | Contents |
|-------------|----------|
| `@package/utility/provider` | DarkModeProvider, useDarkMode, TanstackQueryProvider |
| `@package/utility/tailwind` | `cn()` class name merger (clsx + tailwind-merge) |
| `@package/utility/constant` | Tailwind breakpoint constants |
| `@package/utility/@types` | TypeScript utility types (Maybe, Nullable, Prettify, etc.) |
| `@package/utility/javascript` | Type-safe Object.keys, query param helpers |

## Usage

```typescript
import { DarkModeProvider } from "@package/utility/provider";
import { cn } from "@package/utility/tailwind";
import type { Maybe } from "@package/utility/@types";
```

## Note

Do **not** import from the package root (`@package/utility`). Always use a subpath.
