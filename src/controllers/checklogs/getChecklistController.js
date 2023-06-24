import { ChecklistModel } from "../../models/Checklists.js"

const getChecklistController = async (req, res) => {
    try {
        const checklists = await ChecklistModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        return res.status(200).json(checklists)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getChecklistController