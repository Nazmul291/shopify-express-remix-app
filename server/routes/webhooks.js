import express from "express"
import webhook from "../controllers/webhookController.js"


const router = express.Router()


//  need to create Admin middleware
router.post("/uninstalled/:shop",  webhook.deleteMany );




export default router