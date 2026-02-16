# Scripts

Build and deployment utility scripts for the MonorepoOnFire monorepo.

## create-env.mjs

Generates environment-specific `.env` files for the Hono backend from system environment variables. Primarily used by CI/CD pipelines.

```bash
# CI usage (system env vars must be set)
NODE_ENV=test pnpm deploy:test
NODE_ENV=production pnpm deploy:production
```

**Output:** Creates `app/hono/src/environment/.env.{test|production}` with `ENV`, `DATABASE_URL`, and `DATABASE_AUTH_TOKEN`.

For local development, create `app/hono/src/environment/.env` manually (see `.env.example`).
