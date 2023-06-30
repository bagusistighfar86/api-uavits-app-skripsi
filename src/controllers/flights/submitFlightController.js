import { FlightModel } from "../../models/Flights.js"

const submitFlightController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }

    try {
        const { id } = req.params
        const updatedData = {
            $set: {
                statusVerification: "waiting",
                isNeedSubmit: false,
                isNeedVerified: true,
                updatedAt: new Date()
            },
        }

        const flight = await FlightModel.findOneAndUpdate(
            {
                _id: id,
                auth: {
                    userId: req.userId,
                    role: req.role
                }
            },
            updatedData,
            { new: true }
        )
        if (!flight) {
            response.code = 404
            response.message = "Flight not found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Flight has been submitted"
        response.data = {}
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default submitFlightController