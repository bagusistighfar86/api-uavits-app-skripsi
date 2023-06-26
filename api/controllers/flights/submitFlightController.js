import { FlightModel } from "../../models/Flights.js"

const submitFlightController = async (req, res) => {
    const { id } = req.params

    try {
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
            return res.status(404).json({ error: 'Flight not found' })
        }

        return res.status(200).json({ message: "Flight has been submitted", flight })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default submitFlightController