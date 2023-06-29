import multer from "multer"
import { v4 as uuidv4 } from "uuid"
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
import addKMLController from "../controllers/kml/addKMLController.js"
import getActiveFlightController from "../controllers/flights/getActiveFlightController.js"

const router = express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = ""
        if (file.fieldname === 'kml') {
            path = './assets/flight_kml/'
        }
        else if (file.fieldname === 'airspaceAssessment') {
            path = './assets/flight_airspaceAssessment/'
        }
        else if (file.fieldname === 'dnpPermit') {
            path = './assets/flight_dnpPermit/'
        }
        else if (file.fieldname === 'militaryPermit') {
            path = './assets/flight_militaryPermit/'
        }
        else if (file.fieldname === 'authorityPermit') {
            path = './assets/flight_authorityPermit/'
        }
        else {
            cb(null, './assets/')
        }

        cb(null, path)
    },
    filename: function (req, file, cb) {
        let extension = ""
        let fileName = ""

        if (file.fieldname === 'kml') {
            extension = file.originalname.split('.').pop()
            fileName = `flight_kml-${uuidv4()}.${extension}`
        }
        else if (file.fieldname === 'airspaceAssessment') {
            extension = file.originalname.split('.').pop()
            fileName = `flight_airspaceAssessment-${uuidv4()}.${extension}`
        }
        else if (file.fieldname === 'dnpPermit') {
            extension = file.originalname.split('.').pop()
            fileName = `flight_dnpPermit-${uuidv4()}.${extension}`
        }
        else if (file.fieldname === 'militaryPermit') {
            extension = file.originalname.split('.').pop()
            fileName = `flight_militaryPermit-${uuidv4()}.${extension}`
        }
        else if (file.fieldname === 'authorityPermit') {
            extension = file.originalname.split('.').pop()
            fileName = `flight_authorityPermit-${uuidv4()}.${extension}`
        }
        else {
            cb(null, file.originalname)
        }

        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })
const cpUpload = upload.fields([
    { name: 'kml', maxCount: 1 },
    { name: 'airspaceAssessment', maxCount: 1 },
    { name: 'dnpPermit', maxCount: 1 },
    { name: 'militaryPermit', maxCount: 1 },
    { name: 'authorityPermit', maxCount: 1 },
])

router.get("/", verifyToken, getFlightController)
router.get("/active", verifyToken, getActiveFlightController)
router.post("/search", verifyToken, searchFlightController)
router.get("/pfr", verifyToken, getFlightPFRController)
router.get("/:id", verifyToken, getDetailFlightController)
router.post("/", verifyToken, cpUpload, addFlightController, addKMLController)
router.delete("/:id", verifyToken, removeOneFlightController)
router.put("/:id", verifyToken, cpUpload, updateFlightController, addKMLController)
router.patch('/:id/submit', verifyToken, submitFlightController)
router.patch('/:id/start-flight', verifyToken, startFlightController)
router.patch('/:id/stop-flight', verifyToken, stopFlightController)

// ADMIN
router.patch('/:id/verify', verifyTokenAdmin, verifyFlightController)

export { router as flightRouter }
