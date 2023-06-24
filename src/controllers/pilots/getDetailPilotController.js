import { PilotModel } from "../../models/Pilots.js"

const getDetailPilotController = async (req, res) => {
    const { id } = req.params

    try {
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
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getDetailPilotController