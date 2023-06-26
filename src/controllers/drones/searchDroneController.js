import { DroneModel } from "../../models/Drones.js"

const searchDroneController = async (req, res) => {
    try {
        const search = req.query.search || ""
        const category = req.body.category

        let query = {
            auth: {
                userId: req.userId,
                role: req.role
            }
        }

        let drones
        if (category && category.length > 0 && search) {
            const searchOptions = []

            if (category.includes('droneName')) {
                searchOptions.push({ name: { $regex: search, $options: 'i' } })
            }

            if (category.includes('serialNumber')) {
                searchOptions.push({ serialNumber: { $regex: search, $options: 'i' } })
            }

            if (category.includes('transponderName')) {
                searchOptions.push({ 'transponder.name': { $regex: search, $options: 'i' } })
            }

            if (category.includes('transponderImei')) {
                searchOptions.push({ 'transponder.imei': { $regex: search, $options: 'i' } })
            }

            query.$or = searchOptions

            drones = await DroneModel.find(query)

            if (drones.length === 0) {
                return res.status(404).json({ error: 'No drones found' })
            }

            return res.json(drones)
        } else {

            return res.status(400).json({ error: 'Invalid request' })
        }
    } catch (e) {
        res.status(500).json({ e, error: 'Internal server error', detail: e.message })
    }
}

export default searchDroneController