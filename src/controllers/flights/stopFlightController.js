import { DroneModel } from "../../models/Drones.js"
import { FlightModel } from "../../models/Flights.js"
import { PilotModel } from "../../models/Pilots.js"

const stopFlightController = async (req, res) => {
    let response = {
        code: "",
        message: "",
        data: {},
    }
    try {
        const { id } = req.params
        
        const flight = await FlightModel.findById(id)

        await DroneModel.findByIdAndUpdate(
            flight.detailDrone.id,
            { flightStatus: false }
        )

        for (const pilot of flight.pilot) {
            await PilotModel.findByIdAndUpdate(
                pilot.id,
                { flightStatus: false }
            )
        }

        response.code = 200
        response.message = "Flight has been stopped"
        response.data = {}
        return res.status(200).json(response)
    } catch (error) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default stopFlightController