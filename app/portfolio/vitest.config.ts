import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    name: "@app/portfolio",
    environment: "jsdom",
    setupFiles: ["src/test/set-up-test.tsx"],
  },
});
