import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const searchPostFlightReportController = async (req, res) => {
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

        let pfr

        if (category && category.length > 0 && search) {
            const searchOptions = []

            if (category.includes('id')) {
                searchOptions.push({ _id: { $regex: search, $options: 'i' } })
            }

            if (category.includes('flightId')) {
                searchOptions.push({ 'flightDetail.id': { $regex: search, $options: 'i' } })
            }

            query.$or = searchOptions

            pfr = await PostFlightReportModel.find(query)

            if (pfr.length === 0) {
                response.code = 404
                response.message = "No data found"
                response.data = {}
                return res.status(404).json(response)
            }

            response.code = 200
            response.message = "Search post flight report data successfull"
            response.data = { pfr }
            return res.status(200).json(response)
        } else {
            response.code = 400
            response.message = "Invalid request"
            response.data = {}
            return res.status(400).json(response)
        }
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default searchPostFlightReportController