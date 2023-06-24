import express from "express"
import multer from "multer"
import addContactController from "../controllers/contacts/addContactController.js"
import getContactController from "../controllers/contacts/getContactController.js"
import { verifyTokenAdmin } from "../middleware/verifyTokenAdmin.js"

const router = express.Router()
const upload = multer();

router.post("/", verifyTokenAdmin, upload.fields([
    { name: 'test', maxCount: 1 },
    { name: 'text', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]), addContactController)

router.get("/", verifyTokenAdmin, getContactController)

export { router as contactRouter }
