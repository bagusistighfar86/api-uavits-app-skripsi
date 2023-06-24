import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import addPostFlightReportController from "../controllers/postFlightReport/addPostFlightReportController.js"
import getDetailPostFlightReportController from "../controllers/postFlightReport/getDetailPostFlightReportController.js"
import getPostFlightReportController from "../controllers/postFlightReport/getPostFlightReportController.js"
import searchPostFlightReportController from "../controllers/postFlightReport/searchPostFlightReportController.js"
import updatePostFlightReportController from "../controllers/postFlightReport/updatePostFlightReportController.js"
import removeOnePostFlightReportController from "../controllers/postFlightReport/removeOnePostFlightReportController.js"
import addHistoryController from "../controllers/history/addHistoryController.js"
import submitPostFlightReportController from "../controllers/postFlightReport/submitPostFlightReportController.js"
import verifyPostFlightReportController from "../controllers/admin/postFlightReport/verifyPostFlightReportController.js"
import { verifyTokenAdmin } from "../middleware/verifyTokenAdmin.js"

const router = express.Router()

router.get("/", verifyToken, getPostFlightReportController)
router.get("/search", verifyToken, searchPostFlightReportController)
router.get("/:id", verifyToken, getDetailPostFlightReportController)
router.post("/", verifyToken, addPostFlightReportController)
router.delete("/:id", verifyToken, removeOnePostFlightReportController)
router.put("/:id", verifyToken, updatePostFlightReportController)
router.patch('/:id/submit', verifyToken, submitPostFlightReportController)

// ADMIN
router.patch('/:id/verify', verifyTokenAdmin, verifyPostFlightReportController, addHistoryController)

export { router as postFlightReportRouter }
