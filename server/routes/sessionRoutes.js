import express from "express"
import admin from "../middleware/adminMiddleware.js" 
import sessionController from "../controllers/sessionController.js"

const router = express.Router()

// admin.validate,
router.get("/", sessionController.getAll)

// admin.validate,
router.get("/:id", sessionController.get)

// admin.validate,
router.put(
    "/:id",
    sessionController.update
);

// admin.validate,
router.delete(
    "/:id",
    sessionController.delete
  );

export default router