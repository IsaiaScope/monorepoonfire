# Development Workflows Guide

Step-by-step guides for common development tasks in the MonorepoOnFire monorepo.

## Add a New Backend Route/Entity

Example: adding a `blog` entity with full CRUD.

### 1. Create the database schema

Create `app/hono/src/database/schema/blog-schema.ts`:

```typescript
import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const blog = sqliteTable("blog", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title", { length: 200 }).notNull(),
  createdAt: text("createdAt", { length: 50 }).notNull(),
  updatedAt: text("updatedAt", { length: 50 }).notNull(),
});

const blogTableSchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  title: z.string().nonempty().max(200).openapi({ example: "My Post" }),
  createdAt: z.string().nonempty().max(50),
  updatedAt: z.string().nonempty().max(50),
});

export const selectBlogSchema = blogTableSchema;
export const insertBlogSchema = blogTableSchema.omit({
  id: true, createdAt: true, updatedAt: true,
});
```

### 2. Register schema in database index

Import and spread in `app/hono/src/database/index.ts`.

### 3. Generate and review migration

```bash
cd app/hono
pnpm db:generate    # Creates SQL in migrations/
# Review the generated .sql file
pnpm db:migrate     # Apply to dev database
```

### 4. Create route module (3-file pattern)

Create `app/hono/src/routes/blog/`:

- `blog.routes.ts` — OpenAPI route definitions using `createRoute()`
- `blog.handlers.ts` — Business logic typed with `AppRouterHandler<typeof route>`
- `blog.index.ts` — Router assembly with `createApp().basePath(APP_HONO.BASE_PATH).openapi(...)`
- `blog.test.ts` — Integration tests

### 5. Register route in app.ts

```typescript
import blog from "./routes/blog/blog.index";

const _routes = app
  .route("/", blog)
  .route("/", curriculum)
  // ... other routes
```

### 6. Add route constant

In `app/hono/src/constant/index.ts`, add the route path under `ROUTES`.

### 7. Update documentation

- `app/hono/src/routes/CLAUDE.md` — Add to Existing Modules table
- `app/hono/src/database/CLAUDE.md` — Add schema file to listing
- `app/hono/CLAUDE.md` — Add API endpoints
- `doc/backend-guide.md` — Add to endpoints table and ER diagram

---

## Add a New Frontend Feature

Example: adding a `blog` feature page.

### 1. Create feature directory

```
app/portfolio/src/feature/blog/
├── blog.tsx              # Main component
├── blog.test.tsx         # Tests
├── api/
│   ├── blog.ts           # Raw API call via honoClient
│   └── use-blog.ts       # TanStack Query hook
├── component/            # Sub-components
└── hooks/                # Feature-specific hooks
```

### 2. Create the API layer

`api/blog.ts`:
```typescript
import { honoClient } from "@/api/hono-client";

export async function getBlogs() {
  const res = await honoClient.api.blog.$get();
  return res.json();
}
```

`api/use-blog.ts`:
```typescript
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant";
import { getBlogs } from "./blog";

export function useBlogs() {
  return useQuery({
    queryKey: QUERY_KEYS.BLOG,
    queryFn: getBlogs,
  });
}
```

### 3. Add query key constant

In `app/portfolio/src/constant/`, add `BLOG` query key.

### 4. Create the route

Add a lazy route file in `app/portfolio/src/routes/blog.lazy.tsx`:

```typescript
import { createLazyFileRoute } from "@tanstack/react-router";
import Blog from "@/feature/blog/blog";

export const Route = createLazyFileRoute("/blog")({
  component: Blog,
});
```

### 5. Write tests

Use the custom render from `src/test/set-up-test.tsx` and MSW handlers for API mocking.

### 6. Add translations

Add keys to `public/locales/en-GB/common.json` and `public/locales/it-IT/common.json`.

---

## Add a New Database Table

1. Create schema file: `app/hono/src/database/schema/{entity}-schema.ts`
2. Define Drizzle table + Zod schemas (select + insert)
3. Import and spread in `database/index.ts`
4. Generate migration: `pnpm db:generate`
5. Review generated SQL in `migrations/`
6. Apply: `pnpm db:migrate` (dev), `pnpm db:migrate:test` (test), `pnpm db:migrate:production` (prod)
7. Config reference: `drizzle.config.ts` at `app/hono/` root

---

## Add a New Shared Package Component

### shadcn (low-level primitive)

1. Create `package/shadcn/src/component/{name}.tsx`
2. Follow Radix UI + CVA pattern, use `cn()` from `@package/utility/tailwind`
3. Export from `package/shadcn/src/index.ts`

### ui (app-level composition)

1. Create `package/ui/src/{component-name}/{component-name}.tsx` (prefix with `UI`)
2. Create `package/ui/src/{component-name}/{component-name}.test.tsx`
3. Export from `package/ui/src/index.ts`

---

## Update Environment Variables

### Backend (`app/hono`)

1. Add the variable to `src/environment/env.ts` Zod schema under `server`
2. Add to `.env`, `.env.test`, `.env.production` as needed
3. Add to `.env.example`
4. If used in CI: add to GitHub repository secrets/variables
5. Update `script/create-env.mjs` if the variable needs CI generation

### Frontend (`app/portfolio`)

1. Variable **must** have `VITE_` prefix
2. Add to `src/environment/env.ts` Zod schema under `client`
3. Add to `.env` and `.env.production`
4. If used in Docker: add as `ARG` in Dockerfile and `args` in docker-compose.yaml (build-time only)
5. If used in CI: add to GitHub repository secrets/variables

### CI Secrets

Environment files are created from GitHub secrets/variables by `script/create-env.mjs` (invoked via `deploy:test` or `deploy:production` scripts). Add new variables to:

1. GitHub repository settings (Secrets or Variables)
2. `script/create-env.mjs` — so it writes the variable to the generated `.env` file
3. The appropriate CI workflow YAML
