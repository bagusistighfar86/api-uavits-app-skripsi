import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import getDetailHistoryController from "../controllers/history/getDetailHistoryController.js"
import searchHistoryController from "../controllers/history/searchHistoryController.js"
import getHistoryController from "../controllers/history/getHistoryController.js"
const router = express.Router()

router.get("/", verifyToken, getHistoryController)
router.get("/search", verifyToken, searchHistoryController)
router.get("/:id", verifyToken, getDetailHistoryController)

export { router as historyRouter }
