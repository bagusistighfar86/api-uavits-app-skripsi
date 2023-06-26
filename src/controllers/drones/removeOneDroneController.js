import { DroneModel } from "../../models/Drones.js"

const removeOneDroneController = async (req, res) => {
    try {
        const { id } = req.params
        const drone = await DroneModel.findOneAndRemove({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!drone) {
            return res.status(404).json({ error: 'Drone not found' })
        }

        return res.status(200).json({message: "Drone deleted succesfull"})
    } catch (error) {
        res.status(500).json({ error: "Internal server error", detail: error.message })
    }
}

export default removeOneDroneController