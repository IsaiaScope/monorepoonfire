# @app/portfolio

Frontend single-page application for the MonorepoOnFire portfolio.

## Overview

A React-based portfolio website showcasing skills, projects, and work experience. Features internationalization (English and Italian), dark mode, animated components, and type-safe API integration with the Hono backend.

## Getting Started

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
pnpm --filter @app/portfolio dev

# Or start both frontend and backend together
pnpm dev
```

## Environment

Environment files live at `src/environment/`. Copy from the example:
```bash
cp src/environment/.env.example src/environment/.env
```

Key variables:
- `VITE_BASE_URL` — Backend API URL (default: `http://localhost:3075`)
- `VITE_SHOW_TANSTACK_DEVTOOLS` — Show TanStack Query devtools (`true`/`false`)

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/feature/` | Feature modules — each is self-contained with components, API, tests |
| `src/routes/` | TanStack Router file-based route definitions |
| `src/component/` | Shared layout components (navbar, footer) |
| `src/api/` | RPC client connecting to Hono backend |
| `src/test/` | Test utilities, MSW mocks, custom render function |
| `src/provider/` | TanStack Router provider and auto-generated route tree |
| `src/library/` | Third-party integrations (i18next) |
| `src/environment/` | Validated environment variables |
| `public/locales/` | Translation files (en-GB, it-IT) |

## Features

- **About** — Skills display with animated globe and orbiting circles
- **Contact** — Contact form with EmailJS integration
- **Hero** — Landing section with 3D alien model (Three.js) and animated text
- **Projects** — Project showcase with details modal
- **Work** — Work experience timeline

## Testing

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
```

Uses Vitest + Testing Library + MSW. The custom render at `src/test/set-up-test.tsx` wraps components with all necessary providers and supports viewport simulation.

## Build

```bash
pnpm build    # Vite production build
```

Output goes to the Hono backend's `portfolio/` directory for static serving.
