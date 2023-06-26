import fs from "fs"
import { fileURLToPath } from 'url'
import path, { dirname, join } from 'path'
import { PilotModel } from "../../models/Pilots.js"

const updatePilotController = async (req, res) => {
    try {
        const { id } = req.params
        const { name, phone, nik, certificateExpiredDate } = req.body
    
        const certificate = req.files['certificate'][0]
        const ktpPicture = req.files['ktpPicture'][0]
        const updatedData = {
            name,
            phone,
            nik,
            ktpPicture: ktpPicture.path.replace(/\\/g, '/'),
            certificateExpiredDate,
            certificate: certificate.path.replace(/\\/g, '/'),
            updatedAt: new Date()
        }

        const lastPilot = await PilotModel.findOneAndUpdate(
            {
                _id: id,
                auth: {
                    userId: req.userId,
                    role: req.role
                }
            },
            updatedData
        )

        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        const assetsDirectory = join(__dirname, '../../../')
        fs.unlinkSync(join(assetsDirectory, lastPilot.ktpPicture))
        fs.unlinkSync(join(assetsDirectory, lastPilot.certificate))

        if (!lastPilot) {
            return res.status(404).json({ error: 'Pilot not found' })
        }

        return res.status(200).json({ message: "Pilot updated succesfull" })
    } catch (error) {
        res.status(500).json({ error: "Internal server error", detail: error.message })
    }
}

export default updatePilotController