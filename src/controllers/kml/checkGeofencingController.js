import * as turf from "@turf/turf"
import { KMLModel } from "../../models/KML.js"
import { FlightModel } from "../../models/Flights.js"

const checkGeofencingController = async (req, res) => {
  const meterToFeet = 3.2808399 
  const meterPerSecondToKnots = 1.9438444924423 

  let statusPenerbangan = ""
  let msgPenerbangan = ""

  let code = 200
  let name = ""
  let response = {
    code: code,
    message: "Data successfully retrieved",
    data: {
      status: statusPenerbangan,
      message: msgPenerbangan,
      area_name: name
    },
  }

  try {
    let isInside = false
    let distToArea = 0

    const { latitude, longitude, altitude, groundSpeed, flightId } = req.body

    let kmlModel = await KMLModel.findOne({ flightId: flightId })

    if (latitude === "" || longitude === "" || altitude === "" || !kmlModel) {
      response.code = 404
      response.message = "Requested data not valid"

      res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate")
      return res.status(404).json(response)
    }

    name = kmlModel.area.name

    let warningRad = kmlModel.radius

    let polygonArea = kmlModel.area.coordinates

    // if will use point
    // let pointArray = []

    // polygonArea.forEach((point) => {
    //     pointArray.push(point)
    // })

    let turfPoly = turf.polygon([polygonArea])
    let turfPoint = turf.point([longitude, latitude])

    let turfLines = turf.lineString(
      polygonArea,
      polygonArea[polygonArea.length - 1],
      polygonArea[0]
    )

    isInside = turf.booleanPointInPolygon(turfPoint, turfPoly)
    distToArea = turf.pointToLineDistance(turfPoint, turfLines, { units: 'meters' })

    if (isInside && distToArea > warningRad) {
      response.data.status = "safe"
      response.data.message = "Safe flight"
      response.data.area_name = name
    } else if (isInside && distToArea < warningRad) {
      response.data.status = "warning"
      response.data.message = distToArea.toFixed(0) + " meter until exiting the flight zone"
      response.data.area_name = name
    } else {
      response.data.status = "danger"
      response.data.message = "Out from the flight zone"
      response.data.area_name = name
    }

    if (altitude > 120.0) {
      response.data.status = "danger"
      response.data.message = "The flight exceeds the maximum altitude limit"
      response.data.area_name = name
    }

    await FlightModel.findByIdAndUpdate(
      flightId,
      { $push: { liveFlight: { longitude, latitude, altitude: altitude * meterToFeet, groundSpeed: groundSpeed * meterPerSecondToKnots } } },
    )

    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate")
    return res.status(200).json(response)
  } catch (e) {
    response.code = 500
    response.data.status = "error"
    response.data.message = e.message
    response.data.area_name = ""
    res.status(500).json(response)
  }
}

export default checkGeofencingController