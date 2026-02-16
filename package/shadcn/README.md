# @package/shadcn

Shadcn/ui component library for the MonorepoOnFire monorepo.

## Overview

Pre-styled UI primitives built on Radix UI + Tailwind CSS. These are low-level building blocks — for app-specific compositions, see `@package/ui`.

## Usage

```tsx
import { Button, Card, CardContent, Dialog, Separator } from "@package/shadcn";

// Include CSS once in your app entry:
import "@package/shadcn/css";
```

## Components

Badge, Button, Card, Dialog, DropdownMenu, Form, Input, Label, Select, Separator, Sheet, Skeleton, Textarea, Toaster, Tooltip

## Adding Components

1. Create `src/component/{name}.tsx` following existing patterns
2. Use `cn()` from `@package/utility/tailwind` for class merging
3. Export from `src/index.ts`

Form components integrate with `react-hook-form` and `zod` for validation.
