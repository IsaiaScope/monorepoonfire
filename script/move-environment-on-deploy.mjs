/* eslint-disable node/no-process-env */
// 📝 NOTE: this script is used to move the .env file inside hono project during deploys because service as Render, Netlify and Cloudflare add environment variables to an .env file at the root of the project
import { copyFileSync, existsSync, unlinkSync } from "node:fs";
import { join, relative, resolve } from "node:path";

// Get NODE_ENV from environment or default to 'development'
const NODE_ENV = process.env.NODE_ENV || "development";

// Polyfill __dirname for ES modules
const sourceEnvPath = resolve(process.cwd(), ".env"); // Use project root as base

// Destination folder and file
const destDir = resolve(process.cwd(), "app/hono/src/environment");
const destEnvFile = NODE_ENV === "development" ? `.env` : `.env.${NODE_ENV}`;
const destEnvPath = join(destDir, destEnvFile);

if (!existsSync(destDir)) {
  console.warn(`Destination directory does not exist: ${destDir}`);
  process.exit(0); // Exit without error
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
