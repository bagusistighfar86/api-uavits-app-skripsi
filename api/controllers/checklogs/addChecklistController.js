import { ChecklistModel } from "../../models/Checklists.js"

const addChecklistController = async (req, res) => {
    try {
        const { detailChecklist, type, flightId, auth } = req.body

        const newChecklist = new ChecklistModel({
            detailChecklist,
            type,
            flightId,
            auth
        })

        await newChecklist.save()
        return newChecklist
    } catch (e) {
        res.status(500).json({ e, error: "Internal server error" })
    }
}

export default addChecklistController