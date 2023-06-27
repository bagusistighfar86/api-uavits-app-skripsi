import bcrypt from "bcrypt"
import { UserModel } from "../../models/Users.js"

const registerController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {

        const { email, password, confirmPassword, name, address, phoneNumber, role } = req.body
        const user = await UserModel.findOne({ email })
        if (user) {
            response.code = 400
            response.message = "User already registered. Try another!"
            response.data = {}
            return res.status(400).json(response)
        }

        const hashPassword = await bcrypt.hash(password, 10)
        if (password != confirmPassword) {
            response.code = 400
            response.message = "Password and confirm password not match!"
            response.data = {}
            return res.status(400).json(response)
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

        response.code = 201
        response.message = "Registration successful"
        response.data = newUser
        return res.status(201).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default registerController