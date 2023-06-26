import multer from "multer"
import { v4 as uuidv4 } from "uuid"
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
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path
        if (file.fieldname === 'notam') {
            path = './assets/pfr_notam/'
        }
        else {
            cb(null, './assets/')
        }

        cb(null, path)
    },
    filename: function (req, file, cb) {
        let extension
        let fileName

        if (file.fieldname === 'notam') {
            extension = file.originalname.split('.').pop()
            fileName = `pfr_notam-${uuidv4()}.${extension}`
        }
        else {
            cb(null, file.originalname)
        }

        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })
const cpUpload = upload.fields([
    { name: 'notam', maxCount: 1 },
])

router.get("/", verifyToken, getPostFlightReportController)
router.get("/search", verifyToken, searchPostFlightReportController)
router.get("/:id", verifyToken, getDetailPostFlightReportController)
router.post("/", verifyToken, cpUpload, addPostFlightReportController)
router.delete("/:id", verifyToken, removeOnePostFlightReportController)
router.put("/:id", verifyToken, cpUpload, updatePostFlightReportController)
router.patch('/:id/submit', verifyToken, submitPostFlightReportController)

// ADMIN
router.patch('/:id/verify', verifyTokenAdmin, verifyPostFlightReportController, addHistoryController)

export { router as postFlightReportRouter }
