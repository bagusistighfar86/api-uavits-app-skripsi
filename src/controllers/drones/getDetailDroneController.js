import { DroneModel } from "../../models/Drones.js"

const getDetailDroneController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { id } = req.params
        const drone = await DroneModel.findOne({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!drone) {
            response.code = 404
            response.message = "Drone not found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Get drone successfull"
        response.data = { drone }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getDetailDroneController