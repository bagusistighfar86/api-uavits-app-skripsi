import { PilotModel } from "../../models/Pilots.js"

const searchPilotController = async (req, res) => {
    try {
        const search = req.query.search || ""
        const category = req.body.category
    
        let query = {
            auth: {
                userId: req.userId,
                role: req.role
            }
        }
        
        let pilots
        if (category && category.length > 0 && search) {
            const searchOptions = []

            if (category.includes('id')) {
                searchOptions.push({ _id: { $regex: search, $options: 'i' } })
            }

            if (category.includes('name')) {
                searchOptions.push({ name: { $regex: search, $options: 'i' } })
            }

            query.$or = searchOptions

            pilots = await PilotModel.find(query)

            if (pilots.length === 0) {
                return res.status(404).json({ error: 'No pilots found' })
            }

            return  res.json(pilots)
        } else {
            return res.status(400).json({ error: 'Invalid request' })
        }
    } catch (e) {
        res.status(500).json({ error: 'Internal server error', detail: e.message })
    }
}

export default searchPilotController