import { ChecklistModel } from "../../models/Checklists.js"

const getChecklistController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const checklists = await ChecklistModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        response.code = 200
        response.message = "Get All Checklist successfully"
        response.data = { checklists }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getChecklistController