# Scripts — Build & Deploy Utilities

## create-env.mjs

Creates environment-specific `.env` files in `app/hono/src/environment/` from system environment variables.

**Usage (via root package.json):**
```bash
pnpm deploy:test        # Creates .env.test (NODE_ENV=test)
pnpm deploy:production  # Creates .env.production (NODE_ENV=production)
```

**What it does:**
1. Reads `NODE_ENV` to determine target file name
2. Reads `ENV`, `DATABASE_URL`, `DATABASE_AUTH_TOKEN` from system env
3. Writes only defined variables to the target file
4. Prints directory listing for verification

**Used by CI** — GitHub Actions workflows call this to create env files from secrets/vars before build.

**Local dev** — Not needed. Create `.env` manually in `app/hono/src/environment/`.
