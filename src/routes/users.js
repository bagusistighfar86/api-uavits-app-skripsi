import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import express from "express"
import loginController from "../controllers/auth/loginController.js"
import registerController from "../controllers/auth/registerController.js"

const router = express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path
        if (file.fieldname === 'companyDeed') {
            path = './assets/company_deed/'
        }
        else if (file.fieldname === 'identityCard') {
            path = './assets/individual_identityCard/'
        }
        else {
            cb(null, './assets/')
        }

        cb(null, path)
    },
    filename: function (req, file, cb) {
        let extension
        let fileName

        if (file.fieldname === 'companyDeed') {
            extension = file.originalname.split('.').pop()
            fileName = `company_deed-${uuidv4()}.${extension}`
        }
        else if (file.fieldname === 'identityCard') {
            extension = file.originalname.split('.').pop()
            fileName = `individual_identityCard-${uuidv4()}.${extension}`
        }
        else {
            cb(null, file.originalname)
        }

        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })
const cpUpload = upload.fields([
    { name: 'companyDeed', maxCount: 1 },
    { name: 'identityCard', maxCount: 1 },

])

router.post("/register", cpUpload, registerController)

router.post("/login", loginController)

export { router as userRouter }
