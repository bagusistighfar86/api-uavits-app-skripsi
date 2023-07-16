import { DroneModel } from "../../models/Drones.js"
import { FlightModel } from "../../models/Flights.js"
import { HistoryModel } from "../../models/Histories.js"
import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const addHistoryController = async (req, res) => {
    try {
        const flightId = req.flightId
        const history = await HistoryModel.findOne({
            'historyFlightDetail.id' : flightId
        })

        if (history) {
            return res.status(400).json({ error: "History already created before" })
        }

        const flight = await FlightModel.findById(flightId)
        const drone = await DroneModel.findById(flight?.detailDrone?.id || "")
        
        const newHistoryDroneDetail = {
            id: drone?._id,
            droneName: drone?.name,
            droneSerialNumber: drone?.serialNumber,
            transponderName: drone?.transponder?.name,
            transponderImei: drone?.transponder?.imei,
            dronePicture: drone?.document?.dronePicture
        }

        const newHistoryFlightDetail = {
            id: flightId,
            takeOffPoint: flight?.takeOffPoint,
            landingPoint: flight?.landingPoint,
            flightDate: flight?.flightDate,
            departure: flight?.departure || `2023-08-17T08:00:00.000+00:00`,
            arrival: flight?.arrival || `2023-08-17T14:05:00.000+00:00`,
            pilot: flight?.pilot,
            completeFlightStatus: flight?.completeFlightStatus
        }

        const newHistory = new HistoryModel({
            historyFlightDetail: newHistoryFlightDetail,
            historyDroneDetail: newHistoryDroneDetail,
            historyCoordinates: flight?.liveFlight,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        await newHistory.save()

        await PostFlightReportModel.findByIdAndUpdate(
            req.pfrId,
            req.updatedData,
        )

        res.status(200).json({ message: "Post flight report has been verified & History has been create" })
    } catch (e) {
        res.status(500).json({ e, error: "Internal server error", detail: e.message })
    }
}

export default addHistoryController