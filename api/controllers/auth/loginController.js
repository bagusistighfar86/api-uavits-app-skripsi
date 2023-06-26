import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { UserModel } from "../../models/Users.js"

dotenv.config()
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

const loginController = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: "User doesn't exist!" })
        } else {
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                return res
                    .status(401)
                    .json({ error: "Username or password is incorrect" })
            } else {
                const token = jwt.sign({ id: user._id, role: user.role }, PRIVATE_KEY, { expiresIn: '1d' })
                return res
                    .status(200)
                    .json({ token, userId: user._id, message: "Login successfull" })
            }
        }
    } catch (e) {
        return res.status(500).json({ e, error: "Internal server error" })
    }
}

export default loginController