import { HistoryModel } from "../../models/Histories.js"

const getHistoryController = async (req, res) => {
    try {
        const histories = await HistoryModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        return res.status(200).json(histories)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getHistoryController