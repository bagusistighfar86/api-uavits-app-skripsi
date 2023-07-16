import fs from "fs"
import { fileURLToPath } from 'url'
import path, { dirname, join } from 'path'
import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const updatePostFlightReportController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { id } = req.params

        const pfrDetail = JSON.parse(req.body.pfrDetail)
        const flightDetail = JSON.parse(req.body.flightDetail)
        const userDetail = JSON.parse(req.body.userDetail)

        const lastPFR = await PostFlightReportModel.findById({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        let notam = lastPFR.document.notam
        if (req.files['notam']) notam = req.files['notam'][0]


        const newDocument = {
            notam: notam === lastPFR.document.notam ? notam : notam.path.replace(/\\/g, '/'),
        }

        const updatedData = {
            pfrDetail,
            flightDetail,
            userDetail,
            document: newDocument,
            isNeedSubmit: true,
            updatedAt: new Date()
        }

        const newPFR = await PostFlightReportModel.findOneAndUpdate(
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

        if (!newPFR) {
            response.code = 404
            response.message = "Post flight report not found"
            response.data = {}
            return res.status(404).json(response)
        }

        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        const assetsDirectory = join(__dirname, '../../../')
        if (notam !== lastDrone.document.notam)
            fs.unlinkSync(join(assetsDirectory, lastDrone.document.notam))

            response.code = 200
        response.message = "Post flight report  data successfully update"
        response.data = { pfr: newPFR }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default updatePostFlightReportController