import { ChecklistModel } from "../../models/Checklists.js"
import { FlightModel } from "../../models/Flights.js"


const updateChecklistController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
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
            response.code = 404
            response.message = "Checklist data not found"
            response.data = {}
            return res.status(404).json(response)
        }

        const detailIndex = checklist.detailChecklist.findIndex(
            (detail) => detail._id.toString() === stepId
        )

        if (detailIndex === -1) {
            response.code = 404
            response.message = "Checklist data not found"
            response.data = {}
            return res.status(404).json(response)
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

        response.code = 200
        response.message = "Checklist updated successfully"
        response.data = {}
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default updateChecklistController
