import { ChecklistModel } from "../../models/Checklists.js"

const getDetailChecklistController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { id } = req.params
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

        response.code = 200
        response.message = "Get checklist data successfull"
        response.data = { checklist }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getDetailChecklistController