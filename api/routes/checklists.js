import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import updateChecklistController from "../controllers/checklogs/updateChecklistController.js"
import getChecklistController from "../controllers/checklogs/getChecklistController.js"
import getDetailChecklistController from "../controllers/checklogs/getDetailChecklistController.js"

const router = express.Router()

router.patch('/:id', verifyToken, updateChecklistController)
router.get("/", verifyToken, getChecklistController)
router.get("/:id", verifyToken, getDetailChecklistController)

export { router as checklistRouter }
