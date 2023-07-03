import express from "express"
import addDangerAreaController from "../controllers/dangerArea/addDangerAreaController.js"
import checkZoneController from "../controllers/dangerArea/checkZoneController.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.post("/", addDangerAreaController)
router.post("/check-zone", verifyToken, checkZoneController)

export { router as dangerAreaRouter }
