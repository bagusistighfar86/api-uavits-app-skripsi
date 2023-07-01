import { PilotModel } from "../../models/Pilots.js"

const getPilotController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const pilots = await PilotModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        if (pilots.length === 0) {
            response.code = 404
            response.message = "No data found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Get pilots data successfull"
        response.data = { pilots }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getPilotController