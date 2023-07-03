import express from "express"
import addDangerAreaController from "../controllers/dangerArea/addDangerAreaController.js"

const router = express.Router()

router.post("/", addDangerAreaController)


export { router as dangerAreaRouter }
