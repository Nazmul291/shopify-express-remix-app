import express from "express"
import sessionController from "../controllers/sessionController.js"
import shopifyOAuth from "../middleware/shopifyOAuth.js" 

const router = express.Router()

// shopifyOAuth.requireAdmin
router.get("/", sessionController.getAll)

// shopifyOAuth.requireAdmin
router.get("/:id", sessionController.get)

// shopifyOAuth.requireAdmin
router.put(
    "/:id",
    sessionController.update
);

// shopifyOAuth.requireAdmin
router.delete(
    "/:id",
    sessionController.delete
  );

export default router