import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const getPostFlightReportController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const pfr = await PostFlightReportModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        response.code = 200
        response.message = "Get post flight report data successfull"
        response.data = { pfr }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        res.status(500).json(response)
    }
}

export default getPostFlightReportController