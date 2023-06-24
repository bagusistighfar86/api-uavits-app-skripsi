import { PilotModel } from "../../models/Pilots.js"

const addPilotController = async (req, res) => {
    const { name, phone, nik, ktpPicture, certificateExpiredDate, certificate } = req.body

    try {
        const pilot = await PilotModel.findOne({ nik })

        if (pilot) {
            return res.status(400).json({ error: "Pilot already registered" })
        }

        const newPilot = new PilotModel({
            name,
            phone,
            nik,
            ktpPicture,
            certificateExpiredDate,
            certificate,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        await newPilot.save()

        res.status(200).json({ message: "Pilot created successfully" })
    } catch (e) {
        res.status(500).json({ e, error: "Internal server error" })
    }
}

export default addPilotController