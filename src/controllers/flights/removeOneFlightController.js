import { FlightModel } from "../../models/Flights.js"

const removeOneFlightController = async (req, res) => {
    try {
        const { id } = req.params
        const flight = await FlightModel.findOneAndRemove({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' })
        }

        return res.status(200).json({ message: "Flight deleted succesfull" })
    } catch (error) {
        res.status(500).json({ error: "Internal server error", detail: error.message })
    }
}

export default removeOneFlightController