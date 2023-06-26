import { ChecklistModel } from "../../models/Checklists.js"

const getDetailChecklistController = async (req, res) => {
    const { id } = req.params

    try {
        const checklist = await ChecklistModel.findOne({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!checklist) {
            return res.status(404).json({ error: 'Checklist not found' })
        }

        return res.status(200).json(checklist)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getDetailChecklistController