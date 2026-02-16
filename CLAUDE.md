# CLAUDE.md — MonorepoOnFire

## Commands

```bash
# Root-level (runs across all workspaces via Turborepo)
pnpm dev                  # Start all apps in dev mode
pnpm build                # Build all (development)
pnpm build:test           # Build all (test env)
pnpm build:production     # Build all (production env)
pnpm test                 # Run all tests
pnpm test:watch           # Watch mode
pnpm lint                 # Lint all
pnpm lint:fix             # Lint + auto-fix all
pnpm check-types          # Type-check all

# Per-workspace (use --filter)
pnpm --filter @app/hono dev
pnpm --filter @app/portfolio dev
pnpm --filter @app/hono test
pnpm --filter @app/portfolio test:watch

# Database (run from app/hono/)
pnpm update:database              # Generate + push schema (dev)
pnpm update:database:test         # Generate + push schema (test)
pnpm update:database:production   # Generate + push schema (prod)
pnpm see:db                       # Open Drizzle Studio

# Single test file
pnpm --filter @app/hono exec vitest run path/to/file.test.ts
pnpm --filter @app/portfolio exec vitest run path/to/file.test.ts
```

## Architecture

```
monorepoonfire/
├── app/
│   ├── hono/          # @app/hono — Backend API (Hono + Node.js)
│   └── portfolio/     # @app/portfolio — Frontend SPA (React + Vite)
├── package/
│   ├── config/        # @package/config — Shared ESLint & TypeScript configs
│   ├── shadcn/        # @package/shadcn — Radix UI primitives with Tailwind
│   ├── ui/            # @package/ui — Higher-level UI components (UI* prefix)
│   └── utility/       # @package/utility — Providers, types, helpers
└── script/            # Build/deploy scripts
```

**Key relationships:**
- Portfolio builds into `app/hono/portfolio/` — Hono serves it as static files with SPA fallback
- Frontend uses Hono's **RPC client** for type-safe API calls: backend exports `Routes` type, frontend imports `hc<Routes>` via `@app/hono/rpc`
- `@package/shadcn` provides primitives, `@package/ui` composes them into app-specific components (all prefixed `UI*`)
- `@package/utility` uses subpath exports: `@package/utility/provider`, `/tailwind`, `/constant`, `/@types`, `/javascript`

## Code Conventions

**Style (enforced by ESLint via @antfu/eslint-config):**
- Double quotes, semicolons, 2-space indent
- `type` keyword only — `interface` is an error
- kebab-case filenames (e.g., `create-app.ts`, `use-skills.ts`)
- `no-console: warn` — avoid console statements
- `node/no-process-env: error` — use `@t3-oss/env-core` validated env instead

**Commits (enforced by commitlint + husky):**
- Format: `<type>(<scope>): <description>` — scope is **required**
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Scope can be lower-case or UPPER-CASE (e.g., `fix(SEO):`, `feat(redirect):`)

## Backend Patterns (app/hono)

**Route module structure** — each entity has 3 files:
```
src/routes/{entity}/
├── {entity}.index.ts      # Router: createApp().openapi(route, handler)
├── {entity}.routes.ts     # OpenAPI route defs via createRoute()
└── {entity}.handlers.ts   # Business logic, typed as AppRouterHandler<typeof route>
```

**Stack:** Hono + OpenAPIHono (`@hono/zod-openapi`) + Drizzle ORM + Turso (LibSQL/SQLite)
- Schemas in `src/database/schema/` define both Drizzle tables and Zod validation schemas
- Routes use `stoker` helpers (`jsonContent`, `jsonContentRequired`, `IdParamsSchema`, `createErrorSchema`)
- OpenAPI docs at `/doc` (JSON) and `/scalar` (interactive UI)
- Middleware: compress, CORS, pino logger, secure-headers, timing, request-id
- Env validation: `src/environment/env.ts` using `@t3-oss/env-core` with Zod + dotenv-expand

**Env files** live at `app/hono/src/environment/` (`.env`, `.env.test`, `.env.production`)

## Frontend Patterns (app/portfolio)

**Feature-based structure** — each feature is self-contained:
```
src/feature/{name}/
├── {name}.tsx              # Main component
├── {name}.test.tsx         # Tests
├── api/                    # Data layer
│   ├── {resource}.ts       # Raw API call via honoClient.api.{resource}.$get()
│   └── use-{resource}.ts   # TanStack Query hook wrapper
├── component/              # Sub-components
└── hooks/                  # Feature-specific hooks
```

**Stack:** React + Vite + TanStack Router (file-based, lazy routes) + TanStack Query + i18next (en-GB, it-IT)

**Query pattern:** 2-file approach — raw fetch function + `useQuery`/`useMutation` hook with centralized query keys in `src/constant/`

**Provider stack** (outer to inner): `StrictMode > ErrorBoundary > DarkModeProvider > Suspense > TanstackQueryProvider > TanstackRouterProvider`

**Testing:**
- Custom render in `src/test/set-up-test.tsx` wraps components with QueryClient + i18n providers
- Options: `viewport` (mobile/tablet/desktop), `location`, `language`
- MSW for API mocking: handlers in `src/test/mocks/handlers.ts`, mock data in `src/test/mocks/data/`
- Env validation: `src/environment/env.ts` using `@t3-oss/env-core` with `VITE_` prefix

## CI/CD

| Branch | Workflow | Env File | Tests | Build |
|--------|----------|----------|-------|-------|
| `dev` | ci-dev.yaml | `.env` | Yes | `pnpm build` |
| `test` | ci-test.yaml | `.env.test` | Yes | `pnpm build:test` |
| `production` | ci-production.yaml | `.env.production` | No | `pnpm build:production` |

CI creates env files from GitHub secrets/vars, installs pnpm + Node 20, runs tests then build.
