# Backend API Guide

## Overview

The Hono backend is a high-performance API server built with TypeScript. It provides data to the portfolio frontend through a REST API with auto-generated OpenAPI documentation, type-safe database operations via Drizzle ORM and PostgreSQL, and serves the frontend SPA as static files in production.

## Architecture

```mermaid
graph TD
    Entry[index.ts — Server entry] --> App[app.ts — Route assembly]
    App --> MW[create-app.ts — Middleware stack]
    MW --> Routes[4 API route modules]
    Routes --> DB[(PostgreSQL via Drizzle)]
    App --> OpenAPI[/doc + /scalar]
    App --> Static[Portfolio SPA static files]
```

## Middleware Stack

Middleware is applied in `create-app.ts` via `initApp()`. Order matters — each layer processes the request before passing it to the next:

```mermaid
graph TD
    R[Request] --> compress --> favicon
    favicon --> CORS --> requestId
    requestId --> pinoLogger --> redirectHost
    redirectHost --> secureHeaders --> timing
    timing --> Handler --> Response
```

| Middleware | Source | Purpose |
|-----------|--------|---------|
| `compress` | `hono/compress` | Gzip/brotli response compression |
| `serveEmojiFavicon` | `stoker/middlewares` | Serves fire emoji favicon |
| `cors` | `hono/cors` | CORS with env-driven origin list |
| `requestId` | `hono/request-id` | Unique ID per request for tracing |
| `pinoLogger` | `hono-pino` | Structured logging (JSON in prod, pretty in dev) |
| `redirectHost` | Custom | Redirects non-canonical domain for SEO |
| `secureHeaders` | `hono/secure-headers` | CSP, HSTS, and other security headers |
| `timing` | `hono/timing` | Server-Timing headers for performance debugging |

Error handlers (`notFound`, `onError`) from `stoker/middlewares` are registered after the middleware stack.

## Route Registration

Routes are assembled in `app.ts` using OpenAPIHono's chained `.route()` pattern. The `_routes` variable captures the type for RPC client usage:

```typescript
const _routes = app
  .route("/", curriculum)
  .route("/", skills)
  .route("/", workExperience)
  .route("/", projects);

export type Routes = typeof _routes;
```

The `Routes` type is consumed by the portfolio frontend via `@app/hono/rpc` for fully type-safe API calls.

## API Endpoints

### Curriculum API (`/api/curriculum`)

Manages the dynamic CV/resume download URL.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/curriculum` | List all curriculum entries |
| POST | `/api/curriculum` | Create curriculum entry |
| GET | `/api/curriculum/:id` | Get specific entry |
| PATCH | `/api/curriculum/:id` | Update entry |
| DELETE | `/api/curriculum/:id` | Delete entry |

### Skills API (`/api/skills`)

Manages technical skills and competencies.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/skills` | List all skills |
| POST | `/api/skills` | Create skill |
| GET | `/api/skills/:id` | Get specific skill |
| PATCH | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |
| DELETE | `/api/skills` | Delete all skills |

### Work Experience API (`/api/work-experience`)

Handles professional experience data.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/work-experience` | List work experiences |
| POST | `/api/work-experience` | Add experience |
| GET | `/api/work-experience/:id` | Get specific experience |
| PATCH | `/api/work-experience/:id` | Update experience |
| DELETE | `/api/work-experience/:id` | Remove experience |
| DELETE | `/api/work-experience` | Delete all experiences |

### Projects API (`/api/projects`)

Manages portfolio projects and case studies.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project details |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| DELETE | `/api/projects` | Delete all projects |

### Documentation Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/doc` | OpenAPI JSON spec |
| GET | `/scalar` | Interactive API documentation (Scalar UI) |

## Database Schema

All tables use PostgreSQL with `pgTable` from `drizzle-orm/pg-core`:

```mermaid
erDiagram
    CURRICULUM {
        serial id PK
        varchar url
        timestamp createdAt
        timestamp updatedAt
    }

    SKILLS {
        serial id PK
        varchar name
        integer level
        integer category_id
        timestamp createdAt
        timestamp updatedAt
    }

    PROJECTS {
        serial id PK
        varchar title
        text description
        varchar image_url
        varchar demo_url
        varchar github_url
        boolean published
        timestamp createdAt
        timestamp updatedAt
    }

    WORK_EXPERIENCE {
        serial id PK
        varchar company
        varchar position
        text description
        varchar start_date
        varchar end_date
        varchar location
        timestamp createdAt
        timestamp updatedAt
    }
```

Each schema file in `src/database/schema/` defines **both** the Drizzle table and Zod validation schemas:

```typescript
import { z } from "@hono/zod-openapi";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

// Drizzle table definition (PostgreSQL)
export const curriculum = pgTable("curriculum", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 500 }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// Zod schemas for OpenAPI + runtime validation
export const selectCurriculumSchema = curriculumTableSchema;
export const insertCurriculumSchema = curriculumTableSchema.omit({
  id: true, createdAt: true, updatedAt: true,
});
```

## File Structure

```
src/
├── index.ts              # Server entry point (@hono/node-server)
├── app.ts                # Route assembly + Routes type export
├── @types/               # Custom types (AppEnv, AppRouterHandler, AppOpenAPIHono)
├── constant/             # APP_HONO config (BASE_PATH, PORT, ROUTES)
│   └── schema.ts         # Shared Zod schemas (notFoundSchema)
├── database/
│   ├── index.ts          # PostgreSQL client + drizzle instance
│   ├── schema/           # Per-entity Drizzle + Zod schemas
│   │   ├── curriculum-schema.ts
│   │   ├── projects-schema.ts
│   │   ├── skills-schema.ts
│   │   └── work-experience-schema.ts
│   ├── json/             # Seed data (JSON files)
│   └── migrations/       # Auto-generated by drizzle-kit
├── environment/          # @t3-oss/env-core validation + .env files
├── library/
│   ├── create-app.ts     # App factory (OpenAPIHono + middleware stack)
│   ├── configure-open-api.ts  # OpenAPI documentation setup
│   └── rpc.ts            # RPC client type export
├── middleware/
│   └── redirect-host.ts  # Non-canonical → canonical domain redirect
└── routes/               # API route modules (3-file pattern)
    ├── curriculum/
    │   ├── curriculum.index.ts
    │   ├── curriculum.routes.ts
    │   └── curriculum.handlers.ts
    ├── projects/
    ├── skills/
    └── work-experience/
```

## Route Module Pattern

Every entity follows a strict 3-file convention:

### `{entity}.routes.ts` — OpenAPI Route Definitions

```typescript
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

export const getCurriculumRoute = createRoute({
  path: APP_HONO.ROUTES.CURRICULUM,
  tags: ["Curriculum"],
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectCurriculumSchema),
      "The list of curriculum entries",
    ),
  },
});
```

### `{entity}.handlers.ts` — Business Logic

```typescript
import type { AppRouterHandler } from "../../@types/open-api-hono";
import type * as routes from "./curriculum.routes";

export const getCurriculumHandler: AppRouterHandler<typeof routes.getCurriculumRoute> = async (c) => {
  const result = await database.query.curriculum.findMany();
  return c.json(result, HttpStatusCodes.OK);
};
```

### `{entity}.index.ts` — Router Assembly

```typescript
const router = createApp()
  .basePath(APP_HONO.BASE_PATH)
  .openapi(routes.getCurriculumRoute, handlers.getCurriculumHandler)
  .openapi(routes.postCurriculumRoute, handlers.postCurriculumHandler);

export default router;
```

## Static File Serving

The portfolio SPA builds into `app/hono/portfolio/`. Hono serves it with cache headers and SPA fallback:

```typescript
// Content-hashed Vite assets — immutable cache
app.get("/assets/*", serveStatic({ root: "./portfolio" }));

// Other static files (models, images) — 1-day cache
app.get("*", serveStatic({ root: "./portfolio" }));

// SPA fallback — no-cache for fresh security headers
app.get("*", serveStatic({ path: "./portfolio/index.html" }));
```

## Security Features

- Input validation with Zod schemas (enforced by OpenAPI middleware)
- CORS with environment-driven origin allowlist (`CORS_ORIGINS`)
- Secure headers via `hono/secure-headers` (CSP, HSTS, X-Frame-Options)
- Host redirect for SEO (non-canonical domain → canonical domain)
- Environment variable validation at startup (`@t3-oss/env-core`)
- SQL injection prevention via Drizzle ORM parameterized queries
- Non-root user in Docker production image

## Troubleshooting

**Database connection errors**
Check that PostgreSQL is running (`pnpm db` starts the Docker container) and that `DATABASE_URL` in your `.env` file is correct. Default for local development: `postgresql://mof:mof@localhost:5432/monorepoonfire`.

**Migration conflicts**
Run `pnpm db:generate` after schema changes. Review the generated SQL in `migrations/` before committing. If a migration fails, check the `migrations/meta/journal.json` for applied state.

**Environment variable errors at startup**
The app validates all env vars at import time via `@t3-oss/env-core`. If you see a Zod validation error, check your `.env` file in `src/environment/` matches the schema in `env.ts`.

**CORS errors in development**
Set `CORS_ORIGINS=*` in your `.env` file for local development. In production, use a comma-separated list of allowed domains.
