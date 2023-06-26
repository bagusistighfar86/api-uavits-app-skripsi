import express from "express"
import addContactController from "../controllers/contacts/addContactController.js"
import getContactController from "../controllers/contacts/getContactController.js"
import { verifyTokenAdmin } from "../middleware/verifyTokenAdmin.js"

const router = express.Router()

router.post("/", verifyTokenAdmin, addContactController)

router.get("/", verifyTokenAdmin, getContactController)

export { router as contactRouter }
