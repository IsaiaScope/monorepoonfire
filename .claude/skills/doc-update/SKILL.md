---
name: doc-update
description: Run a documentation audit for MonorepoOnFire. Verifies all READMEs and doc/ guides against the actual codebase — scripts, routes, schemas, exports, env vars, middleware, CI workflows. Use after code changes or when running /doc-update.
---

# MonorepoOnFire Documentation Update

Audit and fix all documentation files so they match the current codebase state.

## File Inventory

### READMEs (7 files)

| File                        | Covers                                            |
| --------------------------- | ------------------------------------------------- |
| `README.md`                 | Root — monorepo overview, tech stack, screenshots |
| `app/hono/README.md`        | Backend API — routes, database, environment       |
| `app/portfolio/README.md`   | Frontend SPA — features, components, testing      |
| `package/config/README.md`  | Shared config — ESLint, TypeScript, Tailwind      |
| `package/shadcn/README.md`  | shadcn/ui wrapper package                         |
| `package/ui/README.md`      | Shared UI components                              |
| `package/utility/README.md` | Shared utilities — Zod schemas, helpers           |

### Doc Guides (7 files)

| File                                 | Covers                                 |
| ------------------------------------ | -------------------------------------- |
| `doc/architecture-overview.md`       | System architecture, Mermaid diagrams  |
| `doc/backend-guide.md`               | Hono API details, middleware, database |
| `doc/frontend-guide.md`              | React SPA, routing, state management   |
| `doc/development-workflows-guide.md` | Dev setup, scripts, CI                 |
| `doc/shared-packages-guide.md`       | Package internals and exports          |
| `doc/docker-deployment-guide.md`     | Docker build, deployment, env          |
| `doc/environment-system-guide.md`    | Env validation, .env files             |

### Other

| File                 | Covers                                       |
| -------------------- | -------------------------------------------- |
| `CLAUDE.md`          | AI assistant context — commands, conventions |
| `doc/screenshots.md` | Screenshot gallery reference                 |

## Verification Checks

Run each check against the actual codebase. Report discrepancies as a table.

### A. Scripts vs package.json

Compare every `pnpm <script>` mentioned in docs against actual `scripts` in the relevant `package.json`. Flag missing, renamed, or removed scripts.

### B. File Structure vs Filesystem

Compare directory tables (e.g., "Project Structure") in READMEs against `ls` output. Flag missing or renamed directories.

### C. Routes vs Route Modules

Compare API routes listed in docs against `src/routes/` files in `app/hono`. Flag undocumented or removed routes.

### D. Package Exports vs package.json

Compare exported modules listed in package READMEs against `exports` field in each `package/*/package.json`. Flag mismatches.

### E. Environment Variables vs env.ts

Compare env vars documented in READMEs and guides against the Zod schema in `src/environment/env.ts` for both `app/hono` and `app/portfolio`. Flag undocumented or removed variables.

### F. Database Schemas vs Schema Files

Compare database tables/columns described in docs against Drizzle schema files in `app/hono/src/database/schema/`. Ensure all docs reference **PostgreSQL** (never SQLite, Turso, or LibSQL).

### G. Middleware Stack vs create-app.ts

Compare middleware listed in docs against the actual middleware chain in `app/hono/src/library/create-app.ts`.

### H. CI Workflows vs CLAUDE.md

Compare CI commands and workflow descriptions against `.github/workflows/` YAML files and CLAUDE.md entries.

### I. Mermaid Diagrams vs Actual Relationships

Verify Mermaid diagrams in `doc/architecture-overview.md` reflect current package dependencies and data flow.

### J. Screenshots vs Filesystem

Verify screenshot references in `doc/screenshots.md` and `README.md` point to files that exist in `doc/screenshots/`.

## Style Conventions

Follow these rules when writing or fixing documentation:

### Headers

- No emoji in headers — use plain text
- Use `##` for major sections, `###` for subsections
- Keep headers short and scannable

### Code Blocks

- Always use language tags: ` ```bash `, ` ```typescript `, ` ```env `
- Show realistic examples, not placeholders

### Tables

- Use tables for structured data (directory listings, env vars, features)
- Align columns with pipes

### Mermaid Diagrams

- Vertical layout only: `graph TD` or `flowchart TB`
- Never use `graph LR` or horizontal layouts
- Keep node labels concise

### Database References

- Always say **PostgreSQL** — never SQLite, Turso, LibSQL, or "the database" ambiguously
- Connection strings use `postgresql://` URI format
- ORM is always "Drizzle ORM with PostgreSQL"

### Tone

- Professional, concise, visual
- Primary audience: recruiters and portfolio visitors
- Secondary audience: developers evaluating the codebase
- Show don't tell — prefer tables, diagrams, and code over paragraphs

### Badges

- Use shields.io badges in root README only
- Keep badge row clean — no redundant or broken badges

## Workflow

When running this skill:

1. **Read all files** from the inventory above
2. **Run each verification check** (A through J)
3. **Report findings** as a discrepancy table:

| File | Line | Issue | Current | Fix |
| ---- | ---- | ----- | ------- | --- |
| ...  | ...  | ...   | ...     | ... |

4. **Apply fixes** to all discrepancies found
5. **Verify** — re-run the grep checks:
   - `grep -ri "sqlite\|turso\|libsql"` across all doc files — expect 0 matches
   - Confirm all script references resolve
   - Confirm all file paths exist

## Post-Code-Change Checklist

After modifying code, check which docs need updates:

| Change Type           | Files to Check                                         |
| --------------------- | ------------------------------------------------------ |
| New/removed API route | `app/hono/README.md`, `doc/backend-guide.md`           |
| Schema change         | `doc/backend-guide.md`, `doc/architecture-overview.md` |
| New env variable      | Both app READMEs, `doc/environment-system-guide.md`    |
| New package export    | `package/*/README.md`, `doc/shared-packages-guide.md`  |
| Middleware change     | `doc/backend-guide.md`, `doc/architecture-overview.md` |
| New dependency        | Root `README.md` tech stack section                    |
| CI workflow change    | `CLAUDE.md`, `doc/development-workflows-guide.md`      |
| New feature/component | `app/portfolio/README.md`, `doc/frontend-guide.md`     |
| Docker/deploy change  | `doc/docker-deployment-guide.md`                       |
| New screenshot        | `doc/screenshots.md`, root `README.md`                 |
