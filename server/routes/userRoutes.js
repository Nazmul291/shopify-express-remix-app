import express from "express"
// import admin from "../middleware/adminMiddleware.js"
import user from "../controllers/userController.js"

const router = express.Router()

// admin.validate,
router.get("/", user.getAll)

// admin.validate,
router.get("/:id", user.get)

// admin.validate,
router.post(
    "/",
    user.create
  );

//   admin.validate,
router.put(
    "/:id",
    user.update
  );

//   admin.validate,
router.delete(
    "/:id",
    user.delete
  );

export default router