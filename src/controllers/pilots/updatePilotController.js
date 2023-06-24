import { PilotModel } from "../../models/Pilots.js"

const updatePilotController = async (req, res) => {
    const { id } = req.params
    const updatedData = { ...req.body, updatedAt: new Date() }

    try {
        const pilot = await PilotModel.findOneAndUpdate(
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
        if (!pilot) {
            return res.status(404).json({ error: 'Pilot not found' })
        }

        return res.status(200).json({ message: "Pilot updated succesfull", pilot })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default updatePilotController