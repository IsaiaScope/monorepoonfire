// =============================================================================
// VITE CONFIGURATION - Modern Frontend Build Tool Setup
// =============================================================================
// This configuration sets up Vite for the portfolio application with React,
// TypeScript, TailwindCSS, TanStack Router, and Vitest testing integration.
// Vite provides fast HMR, optimized builds, and modern tooling for development.

/// <reference types="vitest" />
// TypeScript reference for Vitest type definitions and IntelliSense support

// Import TailwindCSS Vite plugin for utility-first CSS framework integration
import tailwindcss from "@tailwindcss/vite";
// Import TanStack Router plugin for type-safe routing and code generation
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
// Import React plugin for JSX transformation and React-specific optimizations
import viteReact from "@vitejs/plugin-react";
// Import Vite configuration utilities and environment loading
import { defineConfig, loadEnv } from "vite";

// Vite configuration factory function - receives build mode (development/production)
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Custom environment directory for centralized env file management
  // This allows organizing environment files in a dedicated folder structure
  const envDir = "./src/environment";

  // Load environment variables from the custom directory based on current mode
  // This enables mode-specific configuration (development, production, test)
  const env = loadEnv(mode, envDir);

  return {
    // Specify custom environment directory (overrides default project root)
    envDir,

    // Production-only optimizations for smaller bundle size and better performance
    ...(mode === "production" && {
      esbuild: {
        // Remove console.log and debugger statements in production builds
        // This reduces bundle size and prevents debug information in production
        drop: ["console", "debugger"],
      },
    }),

    // Development server configuration
    server: {
      // Use environment variable for server port configuration
      // Allows different ports for different environments or developers
      port: env.VITE_SERVER_PORT,
    },

    test: {
    // Use JSDOM environment for React component testing
      environment: "jsdom",

      // Setup files that run before each test
      setupFiles: [
        "./src/test/set-up-test.tsx", // Global test setup with providers and MSW
      ],
      // Include patterns for test files
      include: [
        "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      ],

      // Exclude patterns for files that shouldn't be tested
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/.git/**",
      ],

      // Globals configuration - enables global test functions without imports
      globals: true,
      name: "@app/portfolio",
      // Coverage configuration
      coverage: {
        provider: "istanbul",
        reporter: ["text", "json", "html"],
        exclude: [
          "**/*.config.*",
          "**/*.d.ts",
          "**/index.ts",
          "**/test/**",
          "**/coverage/**",
          "**/dist/**",
          "**/build/**",
        ],
      },
    },

    // Plugin configuration for enhanced development experience and build optimization
    plugins: [
      // TanStack Router plugin for file-based routing with type generation
      TanStackRouterVite({
        target: "react", // React integration
        autoCodeSplitting: true, // Automatic code splitting for better performance
        routesDirectory: "src/routes", // Source directory for route files
        generatedRouteTree: "src/provider/routeTree.gen.ts", // Generated route tree location
      }),
      // React plugin for JSX/TSX support and React-specific optimizations
      viteReact(),
      // TailwindCSS plugin for utility-first CSS processing
      tailwindcss(),
    ],

    // Build configuration for production output
    build: {
      // Clean output directory before each build to prevent stale files
      emptyOutDir: true,
      // Output to Hono backend directory for integrated deployment
      // This allows the backend to serve the frontend as static files
      outDir: "../hono/portfolio",
      // Generate source maps for debugging (disabled in production for smaller size)
      sourcemap: mode !== "production",
      // Enable minification in production for smaller bundle size
      minify: mode === "production" ? "esbuild" : false,
    },
  };
});
