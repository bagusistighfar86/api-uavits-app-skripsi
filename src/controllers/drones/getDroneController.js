import { DroneModel } from "../../models/Drones.js"

const getDroneController = async (req, res) => {
    try {
        const drones = await DroneModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        return res.status(200).json(drones)
    } catch (e) {
        res.status(500).json({ e, error: "Internal server error", detail: e.message })
    }
}

export default getDroneController