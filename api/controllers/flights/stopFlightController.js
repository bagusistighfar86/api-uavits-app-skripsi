import { DroneModel } from "../../models/Drones.js"
import { FlightModel } from "../../models/Flights.js"
import { PilotModel } from "../../models/Pilots.js"

const stopFlightController = async (req, res) => {
    const { id } = req.params
    const { longitude, latitude, altitude, groundSpeed } = req.body

    try {
        const flight = await FlightModel.findById(id)

        await DroneModel.findByIdAndUpdate(
            flight.detailDrone.id,
            { flightStatus: false },
            { new: true }
        )

        for (const pilot of flight.pilot) {
            const pl = await PilotModel.findByIdAndUpdate(
                pilot.id,
                { flightStatus: false },
                { new: true }
            )
        }

        res.json({ message: 'Flight has been stopped' })
    } catch (error) {
        res.status(500).json({ error: 'Error stop flight ', details: error.message })
    }
}

export default stopFlightController