import express from "express";
import {dirname, join} from "path"
import { fileURLToPath } from 'url';

class Builder {
  constructor() {
    // Initialize variables
    this.viteDevServer = null;
    this.static = null;
    this.build = null;
  }

  // Asynchronous initialization method
  async init() {
     // Resolve __dirname safely
     const __filename = fileURLToPath(import.meta.url);
     const __dirname = dirname(__filename);

    if (process.env.NODE_ENV !== "production") {
      const vite = await import("vite");
      this.viteDevServer = await vite.createServer({
        server: { middlewareMode: true },
      });
      this.static = this.viteDevServer.middlewares;

      this.publicStatic = express.static(join(__dirname, "..", "..", "public"));

      this.build = () =>
        this.viteDevServer.ssrLoadModule("virtual:remix/server-build");
    } else {
     
      // Set up static middleware for serving files
      this.static = express.static(join(__dirname, "..","..","build", "client"));

      this.publicStatic = express.static(join(__dirname, "..", "..", "public"));

      // Dynamically import and wrap the server build
      const serverBuild = await import(join(__dirname, "..","..", "build", "server", "index.js"));
      this.build = () => serverBuild; // Ensure it's a callable function
    }
  }
}

// Create and initialize the Builder instance
const builder = new Builder();
await builder.init();

export default builder;
