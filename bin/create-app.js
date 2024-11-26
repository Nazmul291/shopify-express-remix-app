#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const appName = process.argv[2] || "my-shopify-app";
const appPath = path.resolve(process.cwd(), appName);

if (fs.existsSync(appPath)) {
  console.error(`Error: Directory "${appName}" already exists.`);
  process.exit(1);
}

console.log(`Creating a new Shopify app at ${appPath}...`);
fs.mkdirSync(appPath, { recursive: true });

execSync(`git clone https://github.com/nazmul291/shopify-express-remix-app.git ${appPath}`, {
  stdio: "inherit",
});

const cleanupPaths = [".git", "bin"];
cleanupPaths.forEach((cleanupPath) => {
  fs.rmSync(path.join(appPath, cleanupPath), { recursive: true, force: true });
});

console.log("App created successfully!");
console.log(`\nNext steps:\n  cd ${appName}\n  npm install\n  npm run dev`);