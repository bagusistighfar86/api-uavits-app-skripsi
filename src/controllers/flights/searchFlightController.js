import { FlightModel } from "../../models/Flights.js"

const searchFlightController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const search = req.query.search || ""
        const category = req.body.category

        let query = {
            auth: {
                userId: req.userId,
                role: req.role
            }
        }

        let flights
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
                response.code = 404
                response.message = "No flights found"
                response.data = {}
                return res.status(404).json(response)
            }

            response.code = 200
            response.message = "Search flight data successfull"
            response.data = { flights }
            return res.status(200).json(response)
        } else {
            return res.status(400).json({ error: 'Invalid request' })
        }
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default searchFlightController