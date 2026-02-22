# @app/hono

Backend API server for the MonorepoOnFire portfolio application.

## Overview

A Hono-based REST API with OpenAPI documentation, serving portfolio data (skills, projects, work experience) from a Turso SQLite database. Also serves the portfolio frontend as static files.

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

Create `.env` in `src/environment/`:
```env
DATABASE_URL=file:local.db
# DATABASE_AUTH_TOKEN= (optional in dev)
```

Or copy from the example: `src/environment/.env.example`

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/routes/` | API route modules (curriculum, skills, projects, work-experience) |
| `src/database/` | Drizzle ORM schemas, migrations, seed data |
| `src/environment/` | Environment validation and .env files |
| `src/library/` | App factory, OpenAPI config, RPC client export |
| `src/middleware/` | Custom Hono middleware |
| `src/@types/` | TypeScript type definitions |
| `src/constant/` | Application constants |

## Database

Uses Drizzle ORM with Turso (LibSQL/SQLite).

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
