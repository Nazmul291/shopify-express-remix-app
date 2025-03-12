import express from "express"
import webhook from "../controllers/webhookController.js"


const router = express.Router()


//  need to create Admin middleware
router.post("/app-uninstalled",  webhook.deleteMany );


export default router