import { FlightModel } from "../../models/Flights.js"

const getActiveFlightController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const flights = await FlightModel.find({
            flightStatus: true,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        console.log(flights)

        if (flights.length === 0) {
            response.code = 404
            response.message = "No active flight UAV"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Active flight data succesfully retrieved"
        response.data = { flights }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getActiveFlightController