import { HistoryModel } from "../../models/Histories.js"

const searchHistoryController = async (req, res) => {
    const search = req.query.search || ""
    const category = req.body.category

    let query = {
        auth: {
            userId: req.userId,
            role: req.role
        }
    }

    let histories
    try {
        if (category && category.length > 0 && search) {
            const searchOptions = []

            if (category.includes('flightId')) {
                searchOptions.push({ 'historyFlightDetail.id': { $regex: search, $options: 'i' } })
            }

            if (category.includes('droneName')) {
                searchOptions.push({ 'historyDroneDetail.droneName': { $regex: search, $options: 'i' } })
            }

            query.$or = searchOptions

            histories = await HistoryModel.find(query)

            if (histories.length === 0) {
                return res.status(404).json({ error: 'No histories found' })
            }

            return  res.json(histories)
        } else {
            return res.status(400).json({ error: 'Invalid request' })
        }
    } catch (e) {
        res.status(500).json({ e, error: 'Internal server error' })
    }
}

export default searchHistoryController