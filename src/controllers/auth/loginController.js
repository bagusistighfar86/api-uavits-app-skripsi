import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { UserModel } from "../../models/Users.js"

dotenv.config()
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

const loginController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {

        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            response.code = 400
            response.message = "Please check the email and password"
            response.data = {}
            return res.status(400).json(response)
        } else {
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                response.code = 400
                response.message = "Email or password is incorrect"
                response.data = {}
                return res.status(400).json(response)
            } else {
                const token = jwt.sign({ id: user._id, role: user.role }, PRIVATE_KEY, { expiresIn: '1d' })

                response.code = 200
                response.message = "Login success. Enjoy your flight!"
                response.data = {
                    token: token
                }
                return res.status(200).json(response)
            }
        }
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default loginController