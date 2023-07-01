import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import express from "express"
import addDroneController from "../controllers/drones/addDroneController.js"
import getDroneController from "../controllers/drones/getDroneController.js"
import getDetailDroneController from "../controllers/drones/getDetailDroneController.js"
import removeOneDroneController from "../controllers/drones/removeOneDroneController.js"
import updateDroneController from "../controllers/drones/updateDroneController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import searchDroneController from "../controllers/drones/searchDroneController.js"

const router = express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = ""
        if (file.fieldname === 'dronePicture') {
            path = './assets/drone_picture/'
        }
        else if (file.fieldname === 'emergencyProcedure') {
            path = './assets/drone_emergencyProcedure/'
        }
        else if (file.fieldname === 'insuranceDocument') {
            path = './assets/drone_insuranceDocument/'
        }
        else if (file.fieldname === 'listOfEquipment') {
            path = './assets/drone_listOfEquipment/'
        }
        else if (file.fieldname === 'droneCertificate') {
            path = './assets/drone_certificate/'
        }
        else {
            cb(null, './assets/')
        }

        cb(null, path)
    },
    filename: function (req, file, cb) {
        let extension = ""
        let fileName = ""

        if (file.fieldname === 'dronePicture') {
            extension = file.originalname.split('.').pop()
            fileName = `drone_picture-${uuidv4()}.${extension}`
        }
        else if (file.fieldname === 'emergencyProcedure') {
            extension = file.originalname.split('.').pop()
            fileName = `drone_emergencyProcedure-${uuidv4()}.${extension}`
        }
        else if (file.fieldname === 'insuranceDocument') {
            extension = file.originalname.split('.').pop()
            fileName = `drone_insuranceDocument-${uuidv4()}.${extension}`
        }
        else if (file.fieldname === 'listOfEquipment') {
            extension = file.originalname.split('.').pop()
            fileName = `drone_listOfEquipment-${uuidv4()}.${extension}`
        }
        else if (file.fieldname === 'droneCertificate') {
            extension = file.originalname.split('.').pop()
            fileName = `drone_certificate-${uuidv4()}.${extension}`
        }
        else {
            cb(null, file.originalname)
        }

        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })
const cpUpload = upload.fields([
    { name: 'dronePicture', maxCount: 1 },
    { name: 'emergencyProcedure', maxCount: 1 },
    { name: 'insuranceDocument', maxCount: 1 },
    { name: 'listOfEquipment', maxCount: 1 },
    { name: 'droneCertificate', maxCount: 1 },
])

router.get("/", verifyToken, getDroneController)
router.post("/search", verifyToken, searchDroneController)
router.get("/:id", verifyToken, getDetailDroneController)
router.post("/", verifyToken, cpUpload, addDroneController)
router.delete("/:id", verifyToken, removeOneDroneController)
router.put("/:id", verifyToken, cpUpload, updateDroneController)

export { router as droneRouter }
