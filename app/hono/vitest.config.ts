import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "@app/hono",
    globals: true,
    setupFiles: ["src/test/set-up-test.ts"],
  },
});
