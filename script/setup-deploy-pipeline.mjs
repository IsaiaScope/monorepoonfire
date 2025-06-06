/* eslint-disable no-console */
/* eslint-disable node/no-process-env */
import { existsSync, writeFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

/* PORT=''
ENV=''
LOG_LEVEL=''
DATABASE_URL=''
DATABASE_AUTH_TOKEN='' */

console.log("========================================");
console.log("Printing environment variables...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("ENV:", process.env.ENV);
console.log("LOG_LEVEL:", process.env.LOG_LEVEL);
console.log("DATABASE_AUTH_TOKEN:", process.env.DATABASE_AUTH_TOKEN);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("========================================");

if (!process.env.NODE_ENV) {
  console.error("NODE_ENV is not set");
  process.exit(0);
}

const envVars = [
  ["ENV", process.env.ENV],
  ["DATABASE_AUTH_TOKEN", process.env.DATABASE_AUTH_TOKEN],
  ["DATABASE_URL", process.env.DATABASE_URL],
];

const envContent = envVars
  .filter(([_, value]) => value !== undefined)
  .map(([key, value]) => `${key}=${value}`)
  .join("\n");

if (!envContent) {
  console.log("No environment variables found to write to .env file.");
  process.exit(0); // Exit with no error
}

const honoEnvDir = resolve(process.cwd(), "app/hono/src/environment");

if (!existsSync(honoEnvDir)) {
  console.log("No app/hono/dist/src/environment directory found so exiting...");
  process.exit(0); // Exit with no error
}

const envFileName = process.env.NODE_ENV !== "development" ? `.env.${process.env.NODE_ENV}` : ".env";

const honoEnvPath = join(honoEnvDir, envFileName);

writeFileSync(honoEnvPath, envContent, { encoding: "utf8" });

console.log("========================================");
console.log(`${envFileName} file created at: ${relative(process.cwd(), honoEnvPath)}`);
console.log("========================================");

function printDir(dir, prefix = "") {
  const entries = readdirSync(dir).filter(e => e !== "node_modules");
  entries.forEach((entry, idx) => {
    const fullPath = join(dir, entry);
    const isDir = statSync(fullPath).isDirectory();
    const connector = idx === entries.length - 1 ? "└── " : "├── ";
    console.log(prefix + connector + entry);
    if (isDir) {
      printDir(fullPath, prefix + (idx === entries.length - 1 ? "    " : "│   "));
    }
  });
}

console.log("========================================");
console.log("Printing app/hono directory structure:");
printDir("app/hono");
console.log("========================================");
