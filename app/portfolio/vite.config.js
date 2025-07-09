/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = "./src/environment";
  const env = loadEnv(mode, envDir);
  return {
    envDir,
    ...(mode === "production" && {
      esbuild: {
        drop: ["console", "debugger"],
      },
    }),
    server: {
      port: env.VITE_SERVER_PORT,
    },
    plugins: [TanStackRouterVite({ target: "react", autoCodeSplitting: true, routesDirectory: "src/routes", generatedRouteTree: "src/provider/routeTree.gen.ts" }), viteReact(), tailwindcss()],
    test: {
      name: "@package/portfolio",
      globals: true,
      environment: "jsdom",
      setupFiles: "src/test/set-up-test.ts",

    },
    build: {
      emptyOutDir: true,
      outDir: "../hono/portfolio",
      sourcemap: mode !== "production",
      minify: mode === "production" ? "esbuild" : false,
    },
    proxy: {
      // 📝 NOTE: port should be the same as in HONO server
      "/api": `http://localhost:3075`,
    },

  };
});
