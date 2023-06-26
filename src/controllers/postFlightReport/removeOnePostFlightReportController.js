import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const removeOnePostFlightReportController = async (req, res) => {
    try {
        const { id } = req.params
        const pfr = await PostFlightReportModel.findOneAndRemove({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!pfr) {
            return res.status(404).json({ error: 'Post flight report not found' })
        }

        return res.status(200).json({ message: "Post flight report deleted succesfull" })
    } catch (error) {
        res.status(500).json({ error: "Internal server error", detail: error.message })
    }
}

export default removeOnePostFlightReportController