#!/usr/bin/env bash
set -euo pipefail

MAX_RETRIES=30
RETRY=0

echo "Waiting for mof-postgres to be ready..."
until docker exec mof-postgres pg_isready -U mof -q 2>/dev/null; do
  RETRY=$((RETRY + 1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: PostgreSQL did not become ready in time."
    echo "Is Docker running? Try: pnpm db"
    exit 1
  fi
  sleep 1
done
echo "PostgreSQL is ready."
