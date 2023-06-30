import { FlightModel } from "../../models/Flights.js"

const removeOneFlightController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
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

        response.code = 200
        response.message = "Flight deleted succesfull"
        response.data = {}
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        res.status(500).json(response)
    }
}

export default removeOneFlightController