# ── Stage 1: Install dependencies ──────────────────────────────
# Copy only package.json files first so pnpm install is cached
# unless dependencies change (Docker layer caching optimization)
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@9.1.1 --activate
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY app/hono/package.json app/hono/
COPY app/portfolio/package.json app/portfolio/
COPY package/config/package.json package/config/
COPY package/shadcn/package.json package/shadcn/
COPY package/ui/package.json package/ui/
COPY package/utility/package.json package/utility/

RUN pnpm install --frozen-lockfile

# ── Stage 2: Build application ─────────────────────────────────
# Builds both portfolio (Vite SPA) and hono (Node API), then
# uses `pnpm deploy` to create a minimal production bundle
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.1.1 --activate
WORKDIR /app

COPY --from=deps /app/ ./
COPY . .

# Portfolio env is now copied directly (only VITE_* client vars, no secrets).
# For local Docker testing, override VITE_BASE_URL via build arg.
ARG VITE_BASE_URL
RUN if [ -n "$VITE_BASE_URL" ]; then \
      sed -i "s|^VITE_BASE_URL=.*|VITE_BASE_URL=$VITE_BASE_URL|" \
        app/portfolio/src/environment/.env.production; \
    fi

# Portfolio builds into app/hono/portfolio/ (Hono serves it as static files)
RUN pnpm --filter @app/portfolio build:docker
RUN pnpm --filter @app/hono build:docker
# `pnpm deploy` extracts only production deps for @app/hono into /deploy
RUN pnpm --filter @app/hono deploy /deploy --prod
# Copy the built SPA into the deploy bundle
RUN cp -r /app/app/hono/portfolio /deploy/portfolio

# ── Stage 3: Production runner ─────────────────────────────────
# Minimal image: only compiled JS, static assets, and prod node_modules
FROM node:22-alpine AS runner

WORKDIR /app

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hono

# --chown is required because COPY --from= defaults to root:root,
# and the hono user needs read access to serve files
COPY --from=builder --chown=hono:nodejs /deploy/dist ./dist
COPY --from=builder --chown=hono:nodejs /deploy/portfolio ./portfolio
COPY --from=builder --chown=hono:nodejs /deploy/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /deploy/package.json ./package.json

USER hono
EXPOSE 3075
ENV NODE_ENV=production
CMD ["node", "dist/src/index.js"]
