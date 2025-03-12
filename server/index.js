// Config
import "dotenv/config";
import "./config/logger.js"
import builder from "./config/builder.js";

// Package
import "@shopify/shopify-app-remix/adapters/node";
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http"


// Middleware
import errorHandler from "./middleware/errorHandlerMiddleware.js"
import baseclient from "./middleware/baseClientMiddleware.js"
import shopifyOauth from "./middleware/shopifyOauth2Middleware.js"
import shopifySession from "./middleware/shopifySession.js"
import requestForward from "./middleware/requestForward.js";
import auth from "./middleware/authMiddleware.js"

// routes
import weebhooks from "./routes/webhooks.js"
import sessionRoutes from "./routes/sessionRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import progressMiddleware from "./middleware/progress.js"
import SocketManager from './socket/socketManager.js';

const app = express();

const server = http.createServer(app);
SocketManager.initialize(server);

app.use(cors());
app.use(builder.static);
app.use("/static", builder.publicStatic);

// socket 
const progressOptions = { /* your options here */ };
app.use(progressMiddleware(progressOptions))

// Weebhook routes
app.use("/api/webhooks", bodyParser.raw({ type: 'application/json' }), weebhooks)
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Request forwarder middleware 
app.use(requestForward.getMiddleware)


app.get("/api/auth", shopifyOauth.authorize);
app.get("/api/auth/callback", shopifyOauth.oauthCallback);

// load app session
app.use(shopifySession.load);

// Shopify protected routes
app.use("/api", auth.validateToken)
app.use("/api/user", userRoutes)
app.use("/api/session", sessionRoutes)

// Only pass the get request middleware
app.use(baseclient.path)

// and your app is "just a request handler"
app.all("*", (req, res) => {
  if(req.admin){
    delete req.admin['accessToken']
    delete req.admin['scope']
  }
  return createRequestHandler({
    build: builder.build,
    getLoadContext: () => ({
      shopSession: req.shop?.session,
      admin: req.admin,
      apiKey: process.env.SHOPIFY_API_KEY
    }),
  })(req, res);
});


app.use(errorHandler.handle)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
