import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const updatePostFlightReportController = async (req, res) => {
    const { id } = req.params

    const { pfrDetail, flightDetail, userDetail, document } = req.body

    const updatedData = {
        pfrDetail,
        flightDetail,
        userDetail, 
        document,
        isNeedSubmit: true,
        updatedAt: new Date()
    }

    try {
        const pfr = await PostFlightReportModel.findOneAndUpdate(
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
        if (!pfr) {
            return res.status(404).json({ error: 'Post flight report not found' })
        }

        return res.status(200).json({ message: "Post flight report  updated succesfull", pfr })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default updatePostFlightReportController