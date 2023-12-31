import { DroneModel } from "../../models/Drones.js"

const getDroneController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const drones = await DroneModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        if (drones.length === 0) {
            response.code = 404
            response.message = "No data found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Get drones data successfull"
        response.data = { drones }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getDroneController