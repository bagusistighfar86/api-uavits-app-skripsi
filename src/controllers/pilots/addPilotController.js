import { PilotModel } from "../../models/Pilots.js"

const addPilotController = async (req, res) => {
    try {
        const { name, phone, nik, certificateExpiredDate } = req.body
        const certificate = req.files['certificate'][0]
        const ktpPicture = req.files['ktpPicture'][0]

        const pilot = await PilotModel.findOne({ nik })

        if (pilot) {
            return res.status(400).json({ error: "Pilot already registered" })
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

        res.status(200).json({ message: "Pilot created successfully" })
    } catch (e) {
        res.status(500).json({ error: "Internal server error", detail: e.message })
    }
}

export default addPilotController