import express from "express"
import uploader from "../middleware/uploadMiddleware.js"
import admin from "../middleware/adminMiddleware.js" 
import product from "../controllers/productController.js"

const router = express.Router()

router.get("/", product.getAll)

router.get("/:id", product.get)

//  need to create Admin middleware
router.post(
    "/",
    admin.validate,
    uploader.multipleFieldsUpload([{ name: "thumbnail", maxCount: 20 }]),
    product.create
  );

router.put(
    "/:id",
    admin.validate,
    uploader.multipleFieldsUpload([{ name: "thumbnail", maxCount: 20 }]),
    product.update
  );

router.delete(
    "/:id",
    admin.validate,
    product.delete
  );

export default router