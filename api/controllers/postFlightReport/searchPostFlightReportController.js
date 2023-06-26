import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const searchPostFlightReportController = async (req, res) => {
    const search = req.query.search || ""
    const category = req.body.category

    let query = {
        auth: {
            userId: req.userId,
            role: req.role
        }
    }

    let pfr
    try {
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
                return res.status(404).json({ error: 'No post flight report found' })
            }

            return  res.json(pfr)
        } else {
            return res.status(400).json({ error: 'Invalid request' })
        }
    } catch (e) {
        res.status(500).json({ e, error: 'Internal server error' })
    }
}

export default searchPostFlightReportController