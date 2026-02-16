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

Key defaults: double quotes, semicolons, 2-space indent, `type` over `interface`, kebab-case filenames.

## TypeScript

Three composable configs:

- **`typescript/base`** — Strict ESNext + Bundler module resolution
- **`typescript/react`** — Adds JSX, DOM libs, `noEmit`
- **`typescript/hono`** — Adds Hono JSX source, Node types

```json
{
  "extends": "@package/config/typescript/react",
  "compilerOptions": { "types": ["vite/client"] }
}
```
