import { DroneModel } from "../../models/Drones.js"

const getDetailDroneController = async (req, res) => {
    const { id } = req.params

    try {
        const drone = await DroneModel.findOne({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!drone) {
            return res.status(404).json({ error: 'Drone not found' })
        }

        return res.status(200).json(drone)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getDetailDroneController