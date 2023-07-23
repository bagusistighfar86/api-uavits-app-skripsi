import { ChecklistModel } from "../../models/Checklists.js"

const addChecklistController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
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
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default addChecklistController