import { DroneModel } from "../../models/Drones.js"
import dangerArea from "../../data/dangerArea.json" assert { type: "json" }
import { DangerAreaModel } from "../../models/DangerArea.js"

const addDangerAreaController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const areas = dangerArea
        let newDangerAreas = []

        areas.forEach(item => {
            const newArea = {
                name: item.name,
                type: item.type,
                radius: item.radius,
                coordinates: {
                    latitude: item.latitude,
                    longitude: item.longitude,
                },
            }
            newDangerAreas.push(newArea)
        });

        await DangerAreaModel.create(newDangerAreas)

        response.code = 200
        response.message = "Danger area created successfully"
        response.data = {}
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default addDangerAreaController