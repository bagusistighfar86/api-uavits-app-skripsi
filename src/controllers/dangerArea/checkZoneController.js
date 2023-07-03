import * as turf from "@turf/turf"
import { DangerAreaModel } from "../../models/DangerArea.js"

const checkZoneController = async (req, res) => {
  let response = {
    code: 200,
    status: "",
    message: "",
    data: {}
  }

  try {
    const { latitude, longitude } = req.body

    const isPointInsideCircle = (circleCenter, circleRadius) => {
      const pointGeoJSON = turf.point([longitude, latitude])
      const circleGeoJSON = turf.circle(
        [circleCenter.longitude, circleCenter.latitude],
        circleRadius
      )

      return turf.booleanPointInPolygon(pointGeoJSON, circleGeoJSON)
    }

    const areas = await DangerAreaModel.find()
    for (const area of areas) {
      const circleCenter = area.coordinates
      const circleRadius = area.radius
      const isInside = isPointInsideCircle(circleCenter, circleRadius)
      if (isInside) {
        response.code = 200
        response.status = "danger"
        response.message = "Flight need permission"
        response.data = { area }
        return res.status(200).json(response)
      }
    }

    response.code = 200
    response.status = "safe"
    response.message = "Flight doesn't need permission"
    response.data = {}
    return res.status(200).json(response)
  } catch (e) {
    response.code = 500
    response.status = "error"
    response.message = e.message
    response.data = {}
    res.status(500).json(response)
  }
}

export default checkZoneController