import mongoose from "mongoose"
import { PostFlightReportModel } from "../../../models/PostFlightReports.js"

const verifyPostFlightReportController = async (req, res, next) => {
    const { id } = req.params

    try {
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
        
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const pfr = await PostFlightReportModel.findById(id)

            if (!pfr) {
                await session.abortTransaction()
                session.endSession()
                return res.status(404).json({ error: 'Post flight report not found' })
            }

            req.flightId = pfr.flightDetail?.id
            req.userId = pfr.auth?.userId
            req.role = pfr.auth?.role

            next()
            
            await PostFlightReportModel.findByIdAndUpdate(
                id,
                updatedData,
                { new: true }
            )

            res.status(200).json({ message: "Post flight report has been verified & History has been create", pfr: pfr })

            await session.commitTransaction()
            session.endSession()
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            return res.status(500).json({ error: 'Error adding post-flight report', details: error.message })
        }
    } catch (e) {
        res.status(500).json({ e, error: "Internal server error" })
    }
}

export default verifyPostFlightReportController