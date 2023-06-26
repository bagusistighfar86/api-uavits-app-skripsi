import { DroneModel } from "../../models/Drones.js"
import { FlightModel } from "../../models/Flights.js"
import { PilotModel } from "../../models/Pilots.js"

const startFlightController = async (req, res, next) => {
    try {
        const { id } = req.params
        const { longitude, latitude, altitude, groundSpeed } = req.body
        const flight = await FlightModel.findByIdAndUpdate(
            id,
            { $set: { flightStatus: true }, $push: { liveFlight: { longitude, latitude, altitude, groundSpeed } } },
            { new: true }
        )

        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' })
        }

        await DroneModel.findByIdAndUpdate(
            flight.detailDrone.id,
            { flightStatus: true },
            { new: true }
        )

        for (const pilot of flight.pilot) {
            const pl = await PilotModel.findByIdAndUpdate(
                pilot.id,
                { flightStatus: true },
                { new: true }
            )
        }

        req.longitude = longitude
        req.latitude = latitude
        req.altitude = altitude
        req.flightId = id

        next()

        // res.json({ message: 'Flight status and location updated successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Error updating flight status and location', details: error.message })
    }
}

export default startFlightController