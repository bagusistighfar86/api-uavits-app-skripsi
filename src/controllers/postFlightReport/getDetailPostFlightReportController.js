import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const getDetailPostFlightReportController = async (req, res) => {
    try {
        const { id } = req.params
        const pfr = await PostFlightReportModel.findOne({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!pfr) {
            return res.status(404).json({ error: 'PostFlightReport not found' })
        }

        return res.status(200).json(pfr)
    } catch (error) {
        res.status(500).json({ error: "Internal server error", detail: error.message })
    }
}

export default getDetailPostFlightReportController