import { FlightModel } from "../../../models/Flights.js"


const verifyFlightController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    
    try {
        const { id } = req.params
        const { statusVerification, noteVerification } = req.body

        const updatedData = {
            $set: {
                statusVerification,
                noteVerification,
                isNeedSubmit: false,
                isNeedVerified: false,
                updatedAt: new Date()
            },
        }

        const flight = await FlightModel.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        )
        if (!flight) {
            response.code = 404
            response.message = "Flight not found"
            response.data = { flight }
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Flight has been verified"
        response.data = { flight }
        return res.status(200).json(response)
    } catch (error) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default verifyFlightController