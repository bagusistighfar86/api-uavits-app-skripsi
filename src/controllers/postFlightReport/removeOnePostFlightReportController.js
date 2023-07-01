import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const removeOnePostFlightReportController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { id } = req.params
        const pfr = await PostFlightReportModel.findOneAndRemove({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!pfr) {
            response.code = 404
            response.message = "No data found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Post flight report deleted succesfull"
        response.data = {}
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
}

export default removeOnePostFlightReportController