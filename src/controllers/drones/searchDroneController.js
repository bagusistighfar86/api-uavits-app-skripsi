import { DroneModel } from "../../models/Drones.js"

const searchDroneController = async (req, res) => {
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
                response.code = 404
                response.message = "No drones found"
                response.data = {}
                return res.status(404).json(response)
            }

            response.code = 200
            response.message = "Search drone data successfull"
            response.data = { drones }
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

export default searchDroneController