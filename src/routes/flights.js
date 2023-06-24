import express from "express"
import addFlightController from "../controllers/flights/addFlightController.js"
import getFlightController from "../controllers/flights/getFlightController.js"
import getDetailFlightController from "../controllers/flights/getDetailFlightController.js"
import removeOneFlightController from "../controllers/flights/removeOneFlightController.js"
import updateFlightController from "../controllers/flights/updateFlightController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import searchFlightController from "../controllers/flights/searchFlightController.js"
import submitFlightController from "../controllers/flights/submitFlightController.js"
import verifyFlightController from "../controllers/admin/flights/verifyFlightController.js"
import { verifyTokenAdmin } from "../middleware/verifyTokenAdmin.js"
import getFlightPFRController from "../controllers/flights/getFlightPFR.js"
import startFlightController from "../controllers/flights/startFlightController.js"
import stopFlightController from "../controllers/flights/stopFlightController.js"

const router = express.Router()

router.get("/", verifyToken, getFlightController)
router.get("/search", verifyToken, searchFlightController)
router.get("/pfr", verifyToken, getFlightPFRController)
router.get("/:id", verifyToken, getDetailFlightController)
router.post("/", verifyToken, addFlightController)
router.delete("/:id", verifyToken, removeOneFlightController)
router.put("/:id", verifyToken, updateFlightController)
router.patch('/:id/submit', verifyToken, submitFlightController)
router.patch('/:id/start-flight', verifyToken, startFlightController)
router.patch('/:id/stop-flight', verifyToken, stopFlightController)

// ADMIN
router.patch('/:id/verify', verifyTokenAdmin, verifyFlightController)

export { router as flightRouter }
