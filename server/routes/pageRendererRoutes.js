import builder from "../config/builder.js";
import { createRequestHandler } from "@remix-run/express";
import express from "express"

const router = express.Router()


router.all("*", (req, res) => {
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

export default router