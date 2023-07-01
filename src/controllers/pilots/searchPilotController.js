import { PilotModel } from "../../models/Pilots.js"

const searchPilotController = async (req, res) => {
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

        let pilots
        if (category && category.length > 0 && search) {
            const searchOptions = []

            if (category.includes('name')) {
                searchOptions.push({ name: { $regex: search, $options: 'i' } })
            }

            query.$or = searchOptions

            pilots = await PilotModel.find(query)

            if (pilots.length === 0) {
                response.code = 404
                response.message = "No pilots found"
                response.data = {}
                return res.status(404).json(response)
            }

            response.code = 200
            response.message = "Search pilot data successfull"
            response.data = { pilots }
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

export default searchPilotController