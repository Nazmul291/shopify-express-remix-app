import "dotenv/config";
import "./config/logger.js"
import "@shopify/shopify-app-remix/adapters/node";

import { createRequestHandler } from "@remix-run/express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import builder from "./config/builder.js";
import errorHandler from "./middleware/errorHandlerMiddleware.js"
import baseclient from "./middleware/baseClientMiddleware.js"
import shopifyOauth from "./middleware/shopifyOauth2Middleware.js"
import shopifySession from "./middleware/shopifySession.js"
import uploader from "./middleware/uploadMiddleware.js"
import requestForward from "./middleware/requestForward.js";
import productRoutes from "./routes/productRoutes.js"

const app = express();

app.use(cors());
app.use(builder.static);
app.use("/public", builder.publicStatic);
app.use(cookieParser());
app.use(express.json())

app.use(requestForward.getMiddleware)

// Api test before oauth 2.0
app.post("/test", uploader.formData(), async(req, res, next)=>{
  
  console.log(req.body)
  res.status(200).send({data:req.body})
})


app.get("/api/auth", shopifyOauth.authorize);
app.get("/api/auth/callback", shopifyOauth.oauthCallback);

// load app session
app.use(shopifySession.load);

// Protected routes start from here
app.use("/api/product", productRoutes)

app.use(baseclient.path)
// and your app is "just a request handler"
app.all("*", createRequestHandler({ build: builder.build }));

app.use(errorHandler.handle)

const port = 3001
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
