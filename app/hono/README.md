# @app/hono

Backend API server for the MonorepoOnFire portfolio application.

## Overview

A Hono-based REST API with OpenAPI documentation, serving portfolio data (skills, projects, work experience) from a PostgreSQL database. Also serves the portfolio frontend as static files.

## Getting Started

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
pnpm --filter @app/hono dev
# Server runs at http://localhost:3075

# Open API docs
# http://localhost:3075/scalar
```

## Environment

Create `.env` in `src/environment/` (or copy from `.env.example`):

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `PORT` | `3075` | No | Server port |
| `ENV` | `development` | No | `development` or `production` |
| `LOG_LEVEL` | `warn` | No | Pino log level |
| `DATABASE_URL` | — | Yes | PostgreSQL connection URL |
| `CORS_ORIGINS` | `*` | No | Comma-separated allowed origins |
| `API_KEY` | — | No | When set, write endpoints require `Authorization: Bearer <API_KEY>` |

```env
DATABASE_URL=postgresql://mof:mof@localhost:5432/monorepoonfire
```

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/routes/` | API route modules (curriculum, skills, projects, work-experience) |
| `src/database/` | Drizzle ORM schemas, migrations, seed data |
| `src/environment/` | Environment validation and .env files |
| `src/library/` | App factory, OpenAPI config, RPC client export |
| `src/@types/` | TypeScript type definitions |
| `src/constant/` | Application constants |

## Database

Uses Drizzle ORM with PostgreSQL.

```bash
# Generate migration SQL from schema changes
pnpm db:generate

# Push schema directly (local prototyping)
pnpm db:push

# Open visual database browser
pnpm db:studio
```

Schemas are defined in `src/database/schema/` — each entity has a Drizzle table definition and Zod validation schemas used for both runtime validation and OpenAPI documentation.

## Testing

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
```

Tests run sequentially to prevent database lock conflicts. Each route module has a colocated test file (e.g., `projects.test.ts`).

## Build

```bash
pnpm build    # TypeScript compile + path alias resolution
```

The build process: `tsc` + `tsc-alias`. Output goes to `dist/`. Database migrations are run separately via CI or `pnpm db:migrate`.
