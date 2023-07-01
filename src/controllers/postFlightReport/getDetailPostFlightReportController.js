import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const getDetailPostFlightReportController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { id } = req.params
        const pfr = await PostFlightReportModel.findOne({
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
        response.message = "Get post flight report successfull"
        response.data = { drone }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        res.status(500).json(response)
    }
}

export default getDetailPostFlightReportController