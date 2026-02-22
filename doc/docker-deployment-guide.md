# Docker Deployment Guide

## Quick Start

```bash
# Build and start (production image, detached)
pnpm docker:up

# View logs
pnpm docker:logs

# Stop and remove container + image
pnpm docker:down
```

The container runs at `http://localhost:3076` by default (mapped from internal port 3075). Override with `DOCKER_HOST_PORT`:

```bash
DOCKER_HOST_PORT=4000 pnpm docker:up
```

## Build Stages

The Dockerfile uses a 3-stage multi-stage build for minimal production images:

```mermaid
flowchart TB
    subgraph deps["Stage 1: deps"]
        D1[Copy package.json files]
        D2[pnpm install --frozen-lockfile]
        D1 --> D2
    end

    subgraph builder["Stage 2: builder"]
        B1[Build portfolio SPA]
        B2[Build Hono API]
        B3[pnpm deploy --prod]
        B1 --> B2 --> B3
    end

    subgraph runner["Stage 3: runner"]
        R1[Non-root user: hono]
        R2[dist/ + portfolio/ + node_modules/]
        R1 --> R2
    end

    deps --> builder --> runner
```

**Why 3 stages?**

- **Stage 1 (deps)**: Caches `pnpm install` — only re-runs when `package.json` or `pnpm-lock.yaml` changes
- **Stage 2 (builder)**: Builds both apps and uses `pnpm deploy` to extract only production `node_modules` (no devDependencies)
- **Stage 3 (runner)**: Minimal image with only compiled JS, static assets, and production dependencies. Runs as non-root user `hono` (UID 1001)

## docker-compose.yaml

```yaml
services:
  hono:
    container_name: monorepoonfire
    build:
      context: .
      args:
        VITE_BASE_URL: "http://localhost:${DOCKER_HOST_PORT:-3076}"
    ports:
      - "${DOCKER_HOST_PORT:-3076}:3075"
    env_file:
      - ./app/hono/src/environment/.env.production
    environment:
      - NODE_ENV=production
```

Key points:

- `VITE_BASE_URL` build arg overrides the frontend's API base URL for local Docker testing (the SPA needs to know where the API is)
- Port mapping: host port (default 3076) → container port 3075
- Runtime env vars come from `.env.production` via `env_file`

## Environment Variables in Docker

There are two types of environment variables, and they're injected at different stages:

| Type | When | How | Example |
|------|------|-----|---------|
| **Build-time** (`VITE_*`) | Docker build | `ARG` in Dockerfile, baked into JS bundle | `VITE_BASE_URL` |
| **Runtime** (server) | Container start | `env_file` or `environment` in compose | `DATABASE_URL`, `CORS_ORIGINS` |

The `VITE_*` variables are embedded into the React SPA at build time by Vite — they cannot be changed after the image is built. Server-side variables (database, CORS, etc.) are read at runtime from the container's environment.

## .dockerignore Policy

The `.dockerignore` excludes:

- `node_modules/`, `dist/`, `.turbo/` — rebuilt inside the container
- `*.md` — documentation not needed in production
- `.github/`, `.husky/`, `.vscode/` — dev tooling
- `.env*` files — **except** `app/portfolio/src/environment/.env*` (portfolio env files contain only `VITE_*` client variables, no secrets)
- `docker-compose.yaml` — not needed inside the image

## CI Docker Verification

The `ci-docker.yaml` workflow runs on the `production` branch to verify the Docker image builds successfully:

```yaml
# Runs: docker build . (no secrets needed)
# Purpose: Catch TypeScript compilation errors before deployment
# Does NOT push the image
```

This is separate from actual deployment — it only verifies the build compiles.

## Convenience Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `pnpm docker:up` | `docker compose up --build --force-recreate -d` | Build image and start container |
| `pnpm docker:down` | `docker compose down --rmi local` | Stop container and remove local image |
| `pnpm docker:logs` | `docker compose logs -f` | Follow container stdout/stderr |

## Troubleshooting

**Container starts but API returns wrong data**
Check that `.env.production` has the correct `DATABASE_URL` pointing to your Turso production database (not `file:local.db`).

**CORS errors from localhost**
The `VITE_BASE_URL` build arg must match the host port. If you change `DOCKER_HOST_PORT`, rebuild the image so the SPA knows the correct API URL.

**Port already in use**
Override the host port: `DOCKER_HOST_PORT=4000 pnpm docker:up`
