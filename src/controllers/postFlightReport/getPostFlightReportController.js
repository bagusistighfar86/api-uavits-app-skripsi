import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const getPostFlightReportController = async (req, res) => {
    try {
        const pfr = await PostFlightReportModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        return res.status(200).json(pfr)
    } catch (error) {
        res.status(500).json({ error: "Internal server error", detail: error.message })
    }
}

export default getPostFlightReportController