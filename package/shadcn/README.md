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

| Component | Based On | Subcomponents |
|-----------|----------|---------------|
| Badge | — | — |
| Button | — | + `buttonVariants` |
| Card | — | CardContent, CardDescription, CardFooter, CardHeader, CardTitle |
| Dialog | @radix-ui/dialog | DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger |
| DropdownMenu | @radix-ui/dropdown-menu | 13 subcomponents (Content, Item, Label, Separator, etc.) |
| Form | react-hook-form | FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField |
| Input | — | — |
| Label | @radix-ui/label | — |
| Select | @radix-ui/select | SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue |
| Separator | @radix-ui/separator | — |
| Sheet | @radix-ui/dialog | SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger |
| Skeleton | — | — |
| Textarea | — | — |
| Toaster | sonner | — |
| Tooltip | @radix-ui/tooltip | TooltipContent, TooltipProvider, TooltipTrigger |

## Adding Components

1. Create `src/component/{name}.tsx` following existing patterns
2. Use `cn()` from `@package/utility/tailwind` for class merging
3. Export from `src/index.ts`

Form components integrate with `react-hook-form` and `zod` for validation.
