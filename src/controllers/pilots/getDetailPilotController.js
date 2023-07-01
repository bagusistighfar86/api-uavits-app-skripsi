import { PilotModel } from "../../models/Pilots.js"

const getDetailPilotController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { id } = req.params
        const pilot = await PilotModel.findOne({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!pilot) {
            response.code = 404
            response.message = "Pilot not found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Get pilot successfull"
        response.data = { pilot }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getDetailPilotController