import { DroneModel } from "../../models/Drones.js"

const updateDroneController = async (req, res) => {
    const { id } = req.params
    const updatedData = { ...req.body, updatedAt: new Date() }

    try {
        const drone = await DroneModel.findOneAndUpdate(
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
        if (!drone) {
            return res.status(404).json({ error: 'Drone not found' })
        }

        return res.status(200).json({ message: "Drone updated succesfull", drone })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default updateDroneController