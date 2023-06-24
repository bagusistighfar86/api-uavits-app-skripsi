import { ChecklistModel } from "../../models/Checklists.js"
import { FlightModel } from "../../models/Flights.js"


const updateChecklistController = async (req, res) => {
    try {
        const { id } = req.params
        const { stepId, flightId } = req.query

        const { timeStep, isCheck } = req.body

        const checklist = await ChecklistModel.findOne({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        if (!checklist) {
            return res.status(404).json({ error: "Checklist not found" })
        }

        const detailIndex = checklist.detailChecklist.findIndex(
            (detail) => detail._id.toString() === stepId
        )

        if (detailIndex === -1) {
            return res.status(404).json({ error: "Detail checklist not found" })
        }

        if (timeStep) {
            checklist.detailChecklist[detailIndex].timeStep = timeStep
        }
        if (isCheck !== undefined) {
            checklist.detailChecklist[detailIndex].isCheck = isCheck
        }

        const allChecksAreTrue = checklist.detailChecklist.every(
            (detail) => detail.isCheck === true
        )

        if (allChecksAreTrue) {
            checklist.isComplete = true
        }

        checklist.updatedAt = new Date()

        const doneUpdate = await checklist.save()

        if (allChecksAreTrue && doneUpdate) {
            const allChecklist = await ChecklistModel.find({
                flightId: flightId,
                auth: {
                    userId: req.userId,
                    role: req.role
                }
            })

            const isCompleteChecklist = allChecklist.every(
                (item) => item.isComplete === true
            )

            if (isCompleteChecklist) {
                await FlightModel.findByIdAndUpdate(
                    flightId, { $set: { 'detailChecklist.isCompleteChecklist': true } },
                )
            }
        }

        res.status(200).json({ message: "Checklist updated successfully" })
    } catch (e) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default updateChecklistController
