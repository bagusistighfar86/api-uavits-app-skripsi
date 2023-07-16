import { PostFlightReportModel } from "../../../models/PostFlightReports.js"

const verifyPostFlightReportController = async (req, res, next) => {
    try {
        const { id } = req.params

        const { statusVerification, noteVerification } = req.body

        const updatedData = {
            $set: {
                statusVerification,
                noteVerification,
                isNeedSubmit: false,
                isNeedVerified: false,
                updatedAt: new Date()
            },
        }

        if (statusVerification !== "accepted") {
            const pfr = await PostFlightReportModel.findByIdAndUpdate(
                id,
                updatedData,
                { new: true }
            )

            if (!pfr) {
                return res.status(404).json({ error: 'Post flight report not found' })
            }

            return res.status(200).json({ message: "Post flight report has been verified", pfr })
        }

        try {
            const pfr = await PostFlightReportModel.findById(id)

            if (!pfr) {
                return res.status(404).json({ error: 'Post flight report not found' })
            }

            req.flightId = pfr.flightDetail?.id
            req.userId = pfr.auth?.userId
            req.role = pfr.auth?.role
            req.updatedData = updatedData
            req.pfrId = pfr._id

            next()
        } catch (error) {
            return res.status(500).json({ error: 'Error adding post-flight report', details: error.message })
        }
    } catch (error) {
        res.status(500).json({ error, error: "Internal server error", detail: error.message })
    }
}

export default verifyPostFlightReportController