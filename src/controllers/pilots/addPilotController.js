import { PilotModel } from "../../models/Pilots.js"

const addPilotController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { name, phone, nik, certificateExpiredDate } = req.body
        const certificate = req.files['certificate'][0]
        const ktpPicture = req.files['ktpPicture'][0]

        const pilot = await PilotModel.findOne({ nik })

        if (pilot) {
            response.code = 400
            response.message = "Pilot already registered"
            response.data = {}
            return res.status(400).json(response)
        }

        const newPilot = new PilotModel({
            name,
            phone,
            nik,
            ktpPicture: ktpPicture.path.replace(/\\/g, '/'),
            certificateExpiredDate,
            certificate: certificate.path.replace(/\\/g, '/'),
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        await newPilot.save()

        response.code = 200
        response.message = "Pilot created successfully"
        response.data = {}
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default addPilotController