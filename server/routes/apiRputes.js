import sessionRoutes from "./sessionRoutes.js"
import userRoutes from "./userRoutes.js"
import shopifyOauth from "../middleware/shopifyOAuth.js"
import productRoutes from "./productRoutes.js"
import express from "express"

const router = express.Router()

// All routes protected
router.use(shopifyOauth.validateToken)
router.use("/products", productRoutes)
router.use("/user", userRoutes)
router.use("/session", sessionRoutes)

export default router