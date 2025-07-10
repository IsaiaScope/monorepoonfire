import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    name: "@package/ui",
    environment: "jsdom",
    setupFiles: ["src/test/set-up-test.ts"],
  },
});
