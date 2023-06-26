import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import express from "express"
// import { verifyTokenAdmin } from "../middleware/verifyTokenAdmin.js"
import addKMLController from "../controllers/kml/addKMLController.js"
import checkGeofencingController from "../controllers/kml/checkGeofencingController.js"

const router = express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path
        if (file.fieldname === 'kml') {
            path = './assets/kml/'
        }  else {
            path = './assets/'
        }
        cb(null, path)
    },
    filename: function (req, file, cb) {
        let fileName
        if (file.fieldname === 'kml') {
            const extension = file.originalname.split('.').pop()
            fileName = `kml-${uuidv4()}.${extension}`
        } else {
            fileName = file.originalname
        }
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })
const cpUpload = upload.fields([
    { name: 'kml', maxCount: 1 }
])

router.post("/", cpUpload, addKMLController)
router.post("/check-geofencing", checkGeofencingController,)
// router.post("/", verifyTokenAdmin, addContactController)


export { router as kmlRouter }
