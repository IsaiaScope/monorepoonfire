# @package/config — Shared Configuration

## What This Package Provides

Shared ESLint and TypeScript configurations consumed by all apps and packages.

## ESLint — `@package/config/eslint/create-config`

Factory function wrapping `@antfu/eslint-config` (flat config format).

```javascript
import createConfig from "@package/config/eslint/create-config";

// For React apps
export default createConfig({ react: true });

// For Node.js apps
export default createConfig({ node: true });
```

**Enforced rules:**
- `stylistic`: 2-space indent, semicolons, double quotes
- `ts/consistent-type-definitions: ["error", "type"]` — use `type`, never `interface`
- `unicorn/filename-case: ["error", { case: "kebabCase" }]` — kebab-case files
- `node/no-process-env: ["error"]` — use validated env via @t3-oss/env-core
- `no-console: ["warn"]`

## TypeScript Configs

| Config | Extends | Used By |
|--------|---------|---------|
| `typescript/base.json` | — | Foundation: ESNext, strict, Bundler resolution |
| `typescript/react.json` | base | Portfolio, UI package: ES2022, react-jsx, DOM libs |
| `typescript/hono.json` | base | Hono backend: react-jsx with hono/jsx source, Node types |

**Usage in tsconfig.json:**
```json
{ "extends": "@package/config/typescript/react" }
```

## When Modifying

- ESLint changes in `create-config.js` affect **all** workspaces
- TypeScript changes in `base.json` cascade to `react.json` and `hono.json`
- Test with `pnpm lint` and `pnpm check-types` from root after changes
