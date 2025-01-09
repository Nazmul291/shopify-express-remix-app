#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const appName = process.argv[2] || "my-shopify-app";
const appPath = path.resolve(process.cwd(), appName);

// Check if the directory already exists
if (fs.existsSync(appPath)) {
  console.error(`Error: Directory "${appName}" already exists.`);
  process.exit(1);
}

// Ensure git is installed
try {
  execSync(`git --version`, { stdio: "ignore" });
} catch {
  console.error("Error: Git is not installed or not found in PATH.");
  process.exit(1);
}

// Create the app directory
console.log(`Creating a new Shopify app at ${appPath}...`);
fs.mkdirSync(appPath, { recursive: true });

// Clone the repository
try {
  execSync(`git clone https://github.com/nazmul291/shopify-express-remix-app.git "${appPath}"`, {
    stdio: "inherit",
  });
} catch (error) {
  fs.rmSync(appPath, { recursive: true, force: true });
  console.error("Error: Failed to clone the repository.");
  process.exit(1);
}

// Remove unnecessary files
const cleanupPaths = [".git", "bin"];
cleanupPaths.forEach((cleanupPath) => {
  const targetPath = path.join(appPath, cleanupPath);
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
});

// Initialize a new git repository
try {
  execSync(`git init`, { cwd: appPath, stdio: "inherit" });
} catch {
  fs.rmSync(appPath, { recursive: true, force: true });
  console.error("Warning: Failed to initialize a git repository.");
}

// Provide tutorial and next steps
const tutorial = "https://youtu.be/I2FJiK6NFZc";

console.log("\nApp created successfully!");
console.log(`\x1b[34m[Tutorial] \x1b[33m\x1b[4m${tutorial}\x1b[0m\x1b[0m`);
console.log(`\nNext steps:\n  cd ${appName}\n  npm install\n  npm run deploy\n  npm run dev`);
