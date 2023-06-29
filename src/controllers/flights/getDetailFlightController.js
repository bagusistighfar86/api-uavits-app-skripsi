import { FlightModel } from "../../models/Flights.js"

const getDetailFlightController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { id } = req.params
        const flight = await FlightModel.findOne({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })
        if (!flight) {
            response.code = 404
            response.message = "Flight not found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Get flight successfull"
        response.data = { flight }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getDetailFlightController