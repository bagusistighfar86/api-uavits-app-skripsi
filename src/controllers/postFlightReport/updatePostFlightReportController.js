import fs from "fs"
import { fileURLToPath } from 'url'
import path, { dirname, join } from 'path'
import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const updatePostFlightReportController = async (req, res) => {
    try {
        const { id } = req.params
    
        const pfrDetail = JSON.parse(req.body.pfrDetail)
        const flightDetail = JSON.parse(req.body.flightDetail)
        const userDetail = JSON.parse(req.body.userDetail)
    
        const notam = req.files['notam'][0]
        const newDocument = {
            notam: notam.path.replace(/\\/g, '/'),
        }

        const updatedData = {
            pfrDetail,
            flightDetail,
            userDetail,
            document: newDocument,
            isNeedSubmit: true,
            updatedAt: new Date()
        }

        const lastPFR = await PostFlightReportModel.findOneAndUpdate(
            {
                _id: id,
                auth: {
                    userId: req.userId,
                    role: req.role
                }
            },
            updatedData,
        )

        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        const assetsDirectory = join(__dirname, '../../../')
        fs.unlinkSync(join(assetsDirectory, lastPFR.document.notam))

        if (!lastPFR) {
            return res.status(404).json({ error: 'Post flight report not found' })
        }

        return res.status(200).json({ message: "Post flight report  updated succesfull", lastPFR })
    } catch (error) {
        res.status(500).json({ error: "Internal server error", detail: error.message })
    }
}

export default updatePostFlightReportController