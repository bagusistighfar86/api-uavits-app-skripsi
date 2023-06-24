import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const getDetailPostFlightReportController = async (req, res) => {
    const { id } = req.params

    try {
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
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getDetailPostFlightReportController