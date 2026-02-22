# @package/config

Shared ESLint and TypeScript configurations for the MonorepoOnFire monorepo.

## ESLint

Provides a `createConfig()` factory based on `@antfu/eslint-config`:

```javascript
// eslint.config.mjs
import createConfig from "@package/config/eslint/create-config";

export default createConfig({
  react: true,   // Enable React rules
  // node: true, // Or enable Node.js rules
}, {
  rules: { /* additional overrides */ },
});
```

### Enforced Rules

| Rule | Setting | Effect |
|------|---------|--------|
| `ts/consistent-type-definitions` | `"type"` | Must use `type`, never `interface` |
| `no-console` | `warn` | Discourage console statements |
| `node/no-process-env` | `error` | Must use `@t3-oss/env-core` validated env |
| `unicorn/filename-case` | `kebabCase` | All files must use kebab-case |
| `perfectionist/sort-imports` | `error` | Auto-sort import statements |
| Stylistic | — | 2-space indent, semicolons, double quotes |

### Customization

Pass additional rules as the second argument:

```javascript
export default createConfig({ react: true }, {
  rules: {
    "no-console": "off", // Allow console in this workspace
  },
});
```

## TypeScript

Three composable configs:

| Config | Extends | Used By |
|--------|---------|---------|
| `typescript/base` | — | Foundation: ESNext, strict, Bundler resolution |
| `typescript/react` | base | Portfolio, UI, shadcn: ES2022, react-jsx, DOM libs |
| `typescript/hono` | base | Hono backend: react-jsx with Hono JSX source, Node types |

```json
{
  "extends": "@package/config/typescript/react",
  "compilerOptions": { "types": ["vite/client"] }
}
```
