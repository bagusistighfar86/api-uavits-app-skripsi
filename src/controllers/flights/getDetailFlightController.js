import { FlightModel } from "../../models/Flights.js"

const getDetailFlightController = async (req, res) => {
    const { id } = req.params

    try {
        const flight = await FlightModel.findOne({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' })
        }

        return res.status(200).json(flight)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getDetailFlightController