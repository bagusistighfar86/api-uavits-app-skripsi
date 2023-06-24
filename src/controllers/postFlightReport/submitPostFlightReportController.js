import { PostFlightReportModel } from "../../models/PostFlightReports.js"


const submitPostFlightReportController = async (req, res) => {
    const { id } = req.params

    try {
        const updatedData = {
            $set: {
                statusVerification: "waiting",
                isNeedSubmit: false,
                isNeedVerified: true,
                updatedAt: new Date()
            },
        }

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

        return res.status(200).json({ message: "Post flight report has been submitted", pfr })
    } catch (e) {
        res.status(500).json({ e, error: "Internal server error" })
    }
}

export default submitPostFlightReportController