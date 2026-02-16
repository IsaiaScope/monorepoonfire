# @app/portfolio — Frontend SPA

## Commands

```bash
pnpm --filter @app/portfolio dev          # Start Vite dev server
pnpm --filter @app/portfolio build        # Production build
pnpm --filter @app/portfolio test         # Run tests
pnpm --filter @app/portfolio test:watch   # Watch mode

# Single test
pnpm --filter @app/portfolio exec vitest run src/feature/about/about.test.tsx
```

## Stack

React + Vite + TanStack Router (file-based) + TanStack Query + i18next (en-GB, it-IT) + Tailwind CSS

## Architecture

```
src/
├── @types/          # i18next type definitions (auto-generated resources.d.ts)
├── api/             # RPC client setup (honoClient from @app/hono/rpc)
├── component/       # Shared layout components (navbar, footer)
├── constant/        # APP_PORTFOLIO config (TANSTACK keys, LANGUAGE)
├── environment/     # @t3-oss/env-core with VITE_ prefix + .env files
├── feature/         # Feature modules (self-contained, see feature/CLAUDE.md)
├── library/         # Third-party integrations (i18next)
├── provider/        # TanStack Router provider + routeTree.gen.ts
├── routes/          # File-based route definitions (__root, index, contact)
├── test/            # Test utilities, MSW mocks, custom render
├── utility/         # Shared helpers (createSectionId)
├── main.tsx         # Entry: provider stack assembly
├── global.css       # Global Tailwind styles
└── font.css         # Font definitions
```

## Key Patterns

**Feature modules** are self-contained — see `src/feature/CLAUDE.md` for the structure

**RPC client** — type-safe API calls via Hono's `hc` client:
```typescript
const res = await honoClient.api.projects.$get();
const data = await res.json(); // Fully typed from backend Routes
```

**Query pattern** — 2-file approach per data source:
1. `{resource}.ts` — raw fetch function using honoClient
2. `use-{resource}.ts` — TanStack Query hook with centralized query keys

**Provider stack** (outer to inner):
`StrictMode > ErrorBoundary > DarkModeProvider > Suspense > TanstackQueryProvider > TanstackRouterProvider`

**Routes** use lazy loading: `createLazyFileRoute("/")` — route tree auto-generated in `provider/routeTree.gen.ts`

**i18n** — translations at `public/locales/{lang}/common.json`, detected from browser, cached in localStorage

**Testing** — custom render wraps with QueryClient + i18n. MSW intercepts API calls. Supports viewport simulation (mobile/tablet/desktop)

**Environment** — `.env` files at `src/environment/`, validated with `@t3-oss/env-core` using `VITE_` prefix
