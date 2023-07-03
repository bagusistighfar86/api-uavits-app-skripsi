import express from "express"
// import { verifyTokenAdmin } from "../middleware/verifyTokenAdmin.js"
// import checkGeofencingController from "../controllers/kml/checkGeofencingController.js"
// import { verifyToken } from "../middleware/verifyToken.js"
import addDangerAreaController from "../controllers/dangerArea/addDangerAreaController.js"

const router = express.Router()

router.post("/", addDangerAreaController)
// router.post("/check-geofencing", verifyToken, checkGeofencingController)


export { router as dangerAreaRouter }
