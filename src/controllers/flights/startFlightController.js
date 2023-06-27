import { DroneModel } from "../../models/Drones.js"
import { FlightModel } from "../../models/Flights.js"
import { PilotModel } from "../../models/Pilots.js"

const startFlightController = async (req, res) => {
    try {
        let response = {
            code: "",
            message: "",
            data: {},
        }
        const { id } = req.params
        
        const flight = await FlightModel.findByIdAndUpdate(
            id,
            { $set: { flightStatus: true } },
            { new: true }
        )

        if (!flight) {
            response.code = 404
            response.message = "Flight not found"
            response.data = {}
            return res.status(404).json(response)
        }

        const drone = await DroneModel.findByIdAndUpdate(
            flight.detailDrone.id,
            { flightStatus: true },
            { new: true }
        )

        if (!drone) {
            response.code = 404
            response.message = "Drone not found"
            response.data = {}
            return res.status(404).json(response)
        }

        for (const pilot of flight.pilot) {
            await PilotModel.findByIdAndUpdate(
                pilot.id,
                { flightStatus: true },
                { new: true }
            )
        }

        if (!drone) {
            response.code = 404
            response.message = "Pilot not found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Flight started"
        response.data = {
            flight: flight,
            drone: drone,
            pilot: pilot,
        }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default startFlightController