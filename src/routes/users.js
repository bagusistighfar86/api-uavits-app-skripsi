import express from "express"
import loginController from "../controllers/auth/loginController.js"
import registerController from "../controllers/auth/registerController.js"

const router = express.Router()

router.post("/register", registerController)

router.post("/login", loginController)

export { router as userRouter }
