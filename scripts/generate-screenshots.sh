#!/usr/bin/env bash
set -euo pipefail

# ─── Generate Screenshots Locally ─────────────────────────────────
# Convenience script that runs the full E2E pipeline:
#   1. Ensures the database is running
#   2. Runs migrations and seeds data
#   3. Builds both apps
#   4. Runs Playwright tests (which generate screenshots)
# ───────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Starting database..."
pnpm db

echo "==> Waiting for database..."
./scripts/wait-for-db.sh

echo "==> Running migrations..."
pnpm --filter @app/hono db:migrate

echo "==> Seeding database..."
pnpm --filter @app/hono db:seed

echo "==> Building portfolio..."
pnpm --filter @app/portfolio build

echo "==> Building hono..."
pnpm --filter @app/hono build

echo "==> Running E2E tests and generating screenshots..."
pnpm e2e

echo "==> Done! Screenshots saved to doc/screenshots/"
