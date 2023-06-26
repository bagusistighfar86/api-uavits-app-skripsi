import { PilotModel } from "../../models/Pilots.js"

const getDetailPilotController = async (req, res) => {
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
            return res.status(404).json({ error: 'Pilot not found' })
        }

        return res.status(200).json(pilot)
    } catch (error) {
        res.status(500).json({ error: "Internal server error", detail: error.message })
    }
}

export default getDetailPilotController