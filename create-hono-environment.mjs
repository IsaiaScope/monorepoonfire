/* eslint-disable node/no-process-env */
import { copyFileSync, existsSync, mkdirSync, unlinkSync } from "node:fs";
import { join, relative, resolve } from "node:path";

// Get NODE_ENV from environment or default to 'development'
const NODE_ENV = process.env.NODE_ENV || "development";

// Polyfill __dirname for ES modules
const __dirname = new URL(".", import.meta.url).pathname;
const sourceEnvPath = resolve(__dirname, ".env");

// Destination folder and file
const destDir = resolve(__dirname, "app/hono/dist/src/environment");
const destEnvFile = NODE_ENV === "development" ? `.env` : `.env.${NODE_ENV}`;
const destEnvPath = join(destDir, destEnvFile);

// Ensure destination directory exists
if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

// Only copy and remove if .env exists
if (existsSync(sourceEnvPath)) {
  copyFileSync(sourceEnvPath, destEnvPath);
  unlinkSync(sourceEnvPath);
  console.warn(`Copied .env to ${relative(process.cwd(), destEnvPath)} and removed original .env`);
}
else {
  console.warn(`No .env file found at ${sourceEnvPath}`);
}
