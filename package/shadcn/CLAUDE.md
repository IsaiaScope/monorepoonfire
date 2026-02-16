# @package/shadcn — Shadcn UI Primitives

## What This Package Provides

Low-level styled components built on Radix UI primitives + Tailwind CSS + CVA variants. These are the building blocks consumed by `@package/ui` to create higher-level compositions.

## Exports

**Import from:** `@package/shadcn`
**CSS import:** `@package/shadcn/css` (include once in app entry)

### Components (15 families)

| Component | Based On | Notes |
|-----------|----------|-------|
| Badge | — | Simple badge |
| Button | — | + `buttonVariants` export |
| Card | — | Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle |
| Dialog | @radix-ui/dialog | Full dialog with overlay, portal, close |
| DropdownMenu | @radix-ui/dropdown-menu | 13 subcomponents |
| Form | react-hook-form | Form, FormField, FormItem, FormLabel, FormControl, FormMessage |
| Input | — | Styled input |
| Label | @radix-ui/label | Styled label |
| Select | @radix-ui/select | 9 subcomponents with scroll buttons |
| Separator | @radix-ui/separator | Horizontal/vertical separator |
| Sheet | @radix-ui/dialog | Slide-over panel |
| Skeleton | — | Loading placeholder |
| Textarea | — | Styled textarea |
| Toaster | sonner | Toast notifications |
| Tooltip | @radix-ui/tooltip | With provider, trigger, content |

## Adding a New Component

1. Create file in `src/component/{name}.tsx`
2. Follow existing pattern: Radix primitive + `cn()` from `@package/utility/tailwind` + CVA variants
3. Export from `src/index.ts`

## Dependencies

- `@package/utility` — for `cn()` class name utility
- `@radix-ui/*` — Unstyled accessible primitives
- `class-variance-authority` — Variant definitions
- `lucide-react` — Icons
- `sonner` — Toast library
