import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "@app/hono",
    globals: true,
    fileParallelism: false,
    maxConcurrency: 1,
    setupFiles: ["src/test/set-up-test.ts"],
  },
});
