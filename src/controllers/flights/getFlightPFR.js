import { FlightModel } from "../../models/Flights.js"

const getFlightPFRController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const flights = await FlightModel.find({
            'detailChecklist.isCompleteChecklist': true,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        response.code = 200
        response.message = "Get flights for Post flight report success"
        response.data = { flights }
        return res.status(200).json(response)
    } catch (error) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getFlightPFRController