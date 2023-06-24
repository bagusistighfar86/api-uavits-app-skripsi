import { HistoryModel } from "../../models/Histories.js"

const getDetailHistoryController = async (req, res) => {
    const { id } = req.params

    try {
        const history = await HistoryModel.findOne({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!history) {
            return res.status(404).json({ error: 'History not found' })
        }

        return res.status(200).json(history)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getDetailHistoryController