import { FlightModel } from "../../models/Flights.js"

const updateFlightController = async (req, res) => {
    const { id } = req.params

    const { detailDrone, flightDate, takeOffPoint, landingPoint, pilot, document } = req.body

    const updatedData = {
        detailDrone,
        flightDate,
        takeOffPoint, 
        landingPoint, 
        pilot, 
        document,
        isNeedSubmit: true,
        updatedAt: new Date()
    }

    try {
        const flight = await FlightModel.findOneAndUpdate(
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
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' })
        }

        return res.status(200).json({ message: "Flight updated succesfull", flight })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default updateFlightController