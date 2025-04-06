// Config
import "dotenv/config";
import "./config/logger.js"
import builder from "./config/builder.js";

// Package
import "@shopify/shopify-app-remix/adapters/node";

import express from "express";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http"


// Middleware
import errorHandler from "./middleware/errorHandlerMiddleware.js"
import baseclient from "./middleware/baseClientMiddleware.js"
import shopifyOauth from "./middleware/shopifyOAuth.js"
import requestForward from "./middleware/requestForward.js";

// routes
import weebhooks from "./routes/webhooks.js"
import progressMiddleware from "./middleware/progress.js"
import SocketManager from './socket/socketManager.js';
import apiRoutes from "./routes/apiRputes.js"
import pageRendererRoutes from "./routes/pageRendererRoutes.js"

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
app.use(shopifyOauth.load);

// api routes
app.use("/api", apiRoutes)

// Only pass the get request middleware
app.use(baseclient.path)

// and your app is "just a request handler"
app.use("/app", pageRendererRoutes)


app.use(errorHandler.handle)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
