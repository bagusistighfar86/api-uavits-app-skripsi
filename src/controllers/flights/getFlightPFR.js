import { FlightModel } from "../../models/Flights.js"

const getFlightPFRController = async (req, res) => {
    try {
        const flights = await FlightModel.find({
            'detailChecklist.isCompleteChecklist': true,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        return res.status(200).json(flights)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getFlightPFRController