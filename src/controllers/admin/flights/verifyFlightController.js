import { FlightModel } from "../../../models/Flights.js"


const verifyFlightController = async (req, res) => {
    try {
        const { id } = req.params
        const { statusVerification, noteVerification } = req.body

        const updatedData = {
            $set: {
                statusVerification,
                noteVerification,
                isNeedSubmit: false,
                isNeedVerified: false,
                updatedAt: new Date()
            },
        }

        const flight = await FlightModel.findById(
            id,
            updatedData,
            { new: true }
        )
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' })
        }

        return res.status(200).json({ message: "Flight has been verified", flight })
    } catch (error) {
        res.status(500).json({ error: "Internal server error", detail: error.message })
    }
}

export default verifyFlightController