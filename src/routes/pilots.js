import express from "express"
import addPilotController from "../controllers/pilots/addPilotController.js"
import getPilotController from "../controllers/pilots/getPilotController.js"
import getDetailPilotController from "../controllers/pilots/getDetailPilotController.js"
import removeOnePilotController from "../controllers/pilots/removeOnePilotController.js"
import updatePilotController from "../controllers/pilots/updatePilotController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import searchPilotController from "../controllers/pilots/searchPilotController.js"

const router = express.Router()

router.get("/", verifyToken, getPilotController)
router.get("/search", verifyToken, searchPilotController)
router.get("/:id", verifyToken, getDetailPilotController)
router.post("/", verifyToken, addPilotController)
router.delete("/:id", verifyToken, removeOnePilotController)
router.put("/:id", verifyToken, updatePilotController)

export { router as pilotRouter }
