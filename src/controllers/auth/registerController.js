import bcrypt from "bcrypt"
import { UserModel } from "../../models/Users.js"

const registerController = async (req, res) => {
    try {
        const { email, password, confirmPassword, name, address, phoneNumber, role } = req.body
        const user = await UserModel.findOne({ email })
        if (user) {
            return res.status(400).json({ error: "User already registered" })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        if (password != confirmPassword) {
            return res.json({ error: "Password and confirm password not match!" })
        }

        const newUser = new UserModel({
            email, password: hashPassword, name, address, phoneNumber, role,
        })

        if (role === "company") {
            const companyDeed = req.files['companyDeed'][0]

            newUser.companyDeed = companyDeed.path.replace(/\\/g, '/')
        } else if (role === "individual") {
            const identityCard = req.files['identityCard'][0]
            const { nik } = req.body

            newUser.nik = nik
            newUser.identityCard = identityCard.path.replace(/\\/g, '/')
        }

        await newUser.save()

        res.status(200).json({ message: "Registration successful" })
    } catch (e) {
        res.status(500).json({e, error: "Internal server error", detail: e.message })
    }
}

export default registerController