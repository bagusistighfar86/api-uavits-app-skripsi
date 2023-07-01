import { PostFlightReportModel } from "../../models/PostFlightReports.js"


const submitPostFlightReportController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { id } = req.params
        const updatedData = {
            $set: {
                statusVerification: "waiting",
                isNeedSubmit: false,
                isNeedVerified: true,
                updatedAt: new Date()
            },
        }

        const pfr = await PostFlightReportModel.findOneAndUpdate(
            {
                _id: id,
                auth: {
                    userId: req.userId,
                    role: req.role
                }
            },
            updatedData,
            { new: true }
          )
        if (!pfr) {
            response.code = 404
            response.message = "Post flight report not found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
            response.message = "Post flight report has been submitted"
            response.data = {}
            return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default submitPostFlightReportController