import express from "express"
import addDroneController from "../controllers/drones/addDroneController.js"
import getDroneController from "../controllers/drones/getDroneController.js"
import getDetailDroneController from "../controllers/drones/getDetailDroneController.js"
import removeOneDroneController from "../controllers/drones/removeOneDroneController.js"
import updateDroneController from "../controllers/drones/updateDroneController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import searchDroneController from "../controllers/drones/searchDroneController.js"

const router = express.Router()

router.get("/", verifyToken, getDroneController)
router.get("/search", verifyToken, searchDroneController)
router.get("/:id", verifyToken, getDetailDroneController)
router.post("/", verifyToken, addDroneController)
router.delete("/:id", verifyToken, removeOneDroneController)
router.put("/:id", verifyToken, updateDroneController)

export { router as droneRouter }
