import { FlightModel } from "../../models/Flights.js"

const searchFlightController = async (req, res) => {
    const search = req.query.search || ""
    const category = req.body.category

    let query = {
        auth: {
            userId: req.userId,
            role: req.role
        }
    }

    let flights
    try {
        if (category && category.length > 0 && search) {
            const searchOptions = []

            if (category.includes('id')) {
                searchOptions.push({ _id: { $regex: search, $options: 'i' } })
            }

            if (category.includes('droneName')) {
                searchOptions.push({ 'detailDrone.name': { $regex: search, $options: 'i' } })
            }

            query.$or = searchOptions

            flights = await FlightModel.find(query)

            if (flights.length === 0) {
                return res.status(404).json({ error: 'No flights found' })
            }

            return  res.json(flights)
        } else {
            return res.status(400).json({ error: 'Invalid request' })
        }
    } catch (e) {
        res.status(500).json({ e, error: 'Internal server error' })
    }
}

export default searchFlightController