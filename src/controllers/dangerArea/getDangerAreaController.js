import { DangerAreaModel } from "../../models/DangerArea.js"

const getDangerAreaController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const area = await DangerAreaModel.find()

        if (area.length === 0) {
            response.code = 404
            response.message = "No data found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Get drones data successfull"
        response.data = { dangerArea: area }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getDangerAreaController