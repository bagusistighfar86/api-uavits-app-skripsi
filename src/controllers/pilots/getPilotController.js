import { PilotModel } from "../../models/Pilots.js"

const getPilotController = async (req, res) => {
    try {
        const pilots = await PilotModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        return res.status(200).json(pilots)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getPilotController