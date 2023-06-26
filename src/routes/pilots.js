import express from "express"
import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import addPilotController from "../controllers/pilots/addPilotController.js"
import getPilotController from "../controllers/pilots/getPilotController.js"
import getDetailPilotController from "../controllers/pilots/getDetailPilotController.js"
import removeOnePilotController from "../controllers/pilots/removeOnePilotController.js"
import updatePilotController from "../controllers/pilots/updatePilotController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import searchPilotController from "../controllers/pilots/searchPilotController.js"

const router = express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'ktpPicture') {
            cb(null, './assets/pilot_ktp/')
        } else if (file.fieldname === 'certificate') {
            cb(null, './assets/pilot_certificate')
        } else {
            cb(null, './assets/')
        }
    },
    filename: function (req, file, cb) {
        if (file.fieldname === 'ktpPicture') {
            const extension = file.originalname.split('.').pop()
            const ktpFileName = `pilot_ktp-${uuidv4()}.${extension}`
            cb(null, ktpFileName)
        } else if (file.fieldname === 'certificate') {
            const extension = file.originalname.split('.').pop()
            const certificateFileName = `pilot_certificate-${uuidv4()}.${extension}`
            cb(null, certificateFileName)
        } else {
            cb(null, file.originalname)
        }
    }
})
const upload = multer({ storage: storage })
const cpUpload = upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'ktpPicture', maxCount: 1 }
])


router.get("/", verifyToken, getPilotController)
router.get("/search", verifyToken, searchPilotController)
router.get("/:id", verifyToken, getDetailPilotController)
router.post("/", verifyToken, cpUpload, addPilotController)
router.delete("/:id", verifyToken, removeOnePilotController)
router.put("/:id", verifyToken, cpUpload, updatePilotController)

export { router as pilotRouter }
