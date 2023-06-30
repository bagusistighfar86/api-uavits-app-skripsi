import { FlightModel } from "../../models/Flights.js"

const getFlightController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const flights = await FlightModel.find({
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        if (flights.length === 0) {
            response.code = 404
            response.message = "No data found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Get flights data successfull"
        response.data = { flights }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        res.status(500).json(response)
    }
}

export default getFlightController