import express from "express"
import uploader from "../middleware/uploadMiddleware.js"
import shopifyOAuth from "../middleware/shopifyOAuth.js" 
import product from "../controllers/productController.js"

const router = express.Router()

router.get("/", product.getAll)

router.get("/:id", product.get)

//  need to create Admin middleware
router.post(
    "/",
    shopifyOAuth.requireAdmin,
    uploader.multipleFieldsUpload([{ name: "thumbnail", maxCount: 20 }]),
    product.create
  );

router.put(
    "/:id",
    shopifyOAuth.requireAdmin,
    uploader.multipleFieldsUpload([{ name: "thumbnail", maxCount: 20 }]),
    product.update
  );

router.delete(
    "/:id",
    shopifyOAuth.requireAdmin,
    product.delete
  );

export default router