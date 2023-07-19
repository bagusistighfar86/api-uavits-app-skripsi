import { HistoryModel } from "../../models/Histories.js"

const getHistoryController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const histories = await HistoryModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        response.code = 200
        response.message = "Get Data History Success"
        response.data = {histories}
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getHistoryController