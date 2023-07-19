import { KMLModel } from "../../models/KML.js"

const getOneKMLController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { flightId } = req.body
        const kml = await KMLModel.findOne({
            flightId: flightId
        })

        if (kml === null) {
            response.code = 404
            response.message = "No data found"
            response.data = {}
            return res.status(404).json(response)
        }

        response.code = 200
        response.message = "Get kml data successfull"
        response.data = { kml }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default getOneKMLController