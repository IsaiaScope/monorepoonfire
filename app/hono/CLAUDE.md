# @app/hono — Backend API

## Commands

```bash
pnpm --filter @app/hono dev              # Start dev server (port 3075)
pnpm --filter @app/hono build            # Build (tsc + tsc-alias)
pnpm --filter @app/hono test             # Run tests (sequential, no parallelism)
pnpm --filter @app/hono test:watch       # Watch mode

# Database
pnpm --filter @app/hono update:database              # Generate + push (dev)
pnpm --filter @app/hono update:database:test          # Generate + push (test)
pnpm --filter @app/hono update:database:production    # Generate + push (prod)
pnpm --filter @app/hono see:db                        # Open Drizzle Studio

# Single test
pnpm --filter @app/hono exec vitest run src/routes/projects/projects.test.ts
```

## Stack

Hono + OpenAPIHono (`@hono/zod-openapi`) + Drizzle ORM + Turso (LibSQL/SQLite) + Pino logger

## Architecture

```
src/
├── @types/          # Custom type definitions (AppEnv, AppRouterHandler, AppOpenAPIHono)
├── constant/        # APP_HONO config (BASE_PATH="/api", PORT=3075, ROUTES)
├── database/        # Drizzle schemas, migrations, seed JSON
├── environment/     # @t3-oss/env-core validation + .env files
├── library/         # App factory (create-app), OpenAPI config, RPC export
├── middleware/      # Custom middleware (redirect-host)
├── routes/          # Route modules (3-file pattern per entity)
├── app.ts           # App assembly: routes + static serving + type export
└── index.ts         # Entry point: @hono/node-server
```

## Key Patterns

**Route modules** follow a strict 3-file convention — see `src/routes/CLAUDE.md`

**RPC type export** — `app.ts` exports `Routes` type consumed by the portfolio frontend:
```typescript
const _routes = app.route("/", skills).route("/", workExperience).route("/", projects);
export type Routes = typeof _routes;
```

**Static file serving** — Portfolio SPA builds into `./portfolio/` directory, served by Hono as catch-all with SPA fallback

**Build pipeline**: `drizzle-kit generate && drizzle-kit push && tsc && tsc-alias`

**Middleware stack** (order matters): compress > favicon > CORS > requestId > pinoLogger > redirectHost > secureHeaders > timing

**Environment files** live at `src/environment/` (.env, .env.test, .env.production)

**Tests run sequentially** (fileParallelism: false, maxConcurrency: 1) to avoid database lock conflicts

## API Endpoints

- `GET /api/skills` — All skills
- `GET/POST /api/projects` — List or create projects
- `GET/PATCH/DELETE /api/projects/:id` — Single project CRUD
- `DELETE /api/projects` — Delete all projects
- `GET/POST /api/work-experience` — List or create work experiences
- `GET/PATCH/DELETE /api/work-experience/:id` — Single work experience CRUD
- `DELETE /api/work-experience` — Delete all work experiences
- `GET /doc` — OpenAPI JSON spec
- `GET /scalar` — Interactive API documentation (Scalar UI)
