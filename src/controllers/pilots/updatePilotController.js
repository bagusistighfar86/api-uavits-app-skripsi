import fs from "fs"
import { fileURLToPath } from 'url'
import path, { dirname, join } from 'path'
import { PilotModel } from "../../models/Pilots.js"

const updatePilotController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { id } = req.params
        const { name, phone, nik, certificateExpiredDate } = req.body

        const lastPilot = await PilotModel.findById({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        let ktpPicture = lastDrone.document.ktpPicture
        if (req.files['ktpPicture']) ktpPicture = req.files['ktpPicture'][0]

        let certificate = lastDrone.document.certificate
        if (req.files['certificate']) certificate = req.files['certificate'][0]

        const updatedData = {
            name,
            phone,
            nik,
            ktpPicture: ktpPicture === lastPilot.ktpPicture ? ktpPicture : ktpPicture.path.replace(/\\/g, '/'),
            certificateExpiredDate,
            certificate: certificate === lastPilot.certificate ? certificate : certificate.path.replace(/\\/g, '/'),
            updatedAt: new Date()
        }

        const newPilot = await PilotModel.findOneAndUpdate(
            {
                _id: id,
                auth: {
                    userId: req.userId,
                    role: req.role
                }
            },
            updatedData,
            { new: true }
        )


        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        const assetsDirectory = join(__dirname, '../../../')
        
        if (ktpPicture !== lastDrone.ktpPicture)
        fs.unlinkSync(join(assetsDirectory, lastPilot.ktpPicture))

        if (certificate !== lastDrone.certificate)
        fs.unlinkSync(join(assetsDirectory, lastPilot.certificate))

        if (!newPilot) {
            response.code = 404
            response.message = "Pilot not found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Pilot data successfully update"
        response.data = { pilot: newPilot }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default updatePilotController