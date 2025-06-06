/* eslint-disable node/no-process-env */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, unlinkSync } from "node:fs";
import { join, relative, resolve } from "node:path";

// Print all environment variables in a readable table
console.warn("=== Environment Variables ===");
// eslint-disable-next-line no-console
console.table(Object.entries(process.env));

// Print project folder structure (first 40 lines)
console.warn("\n=== Project Folder Structure ===");
try {
  // Try using 'tree' for a nice structure, fallback to 'find' if not available
  const treeOutput = execSync("tree -a -L 3 || find . | head -40", { encoding: "utf-8" });
  console.warn(treeOutput);
}
catch (err) {
  console.warn("Could not print folder structure:", err.message);
}

// ...existing code...
const NODE_ENV = process.env.NODE_ENV || "development";
const sourceEnvPath = resolve(process.cwd(), ".env"); // Use project root as base
const destDir = resolve(process.cwd(), "app/hono/src/environment");
const destEnvFile = NODE_ENV === "development" ? `.env` : `.env.${NODE_ENV}`;
const destEnvPath = join(destDir, destEnvFile);

if (!existsSync(destDir)) {
  console.warn(`Destination directory does not exist: ${destDir}`);
  process.exit(0); // Exit without error
}

if (existsSync(sourceEnvPath)) {
  copyFileSync(sourceEnvPath, destEnvPath);
  unlinkSync(sourceEnvPath);
  console.warn(`Copied .env to ${relative(process.cwd(), destEnvPath)} and removed original .env`);
}
else {
  console.warn(`No .env file found at ${sourceEnvPath}`);
}
