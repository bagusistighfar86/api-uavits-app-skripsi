import { HistoryModel } from "../../models/Histories.js"

const getDetailHistoryController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { id } = req.params
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

        response.code = 200
        response.message = "Get Detail History Success"
        response.data = {history}
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getDetailHistoryController