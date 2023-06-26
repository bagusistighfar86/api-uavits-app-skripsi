import { FlightModel } from "../../models/Flights.js"
import addChecklistController from "../checklogs/addChecklistController.js"

const addFlightController = async (req, res, next) => {
    const { flightDate, takeOffPoint, landingPoint } = req.body

    const detailDrone = JSON.parse(req.body.detailDrone)
    const pilot = JSON.parse(req.body.pilot)

    const kml = req.files['kml'][0]
    const airspaceAssessment = req.files['airspaceAssessment'][0]
    const dnpPermit = req.files['dnpPermit'][0]
    const militaryPermit = req.files['militaryPermit'][0]
    const authorityPermit = req.files['authorityPermit'][0]

    try {
        const newKML = {
            name: "",
            coordinates: [],
            kmlFile: kml.path.replace(/\\/g, '/')
        }

        const newDocument = {
            kml: newKML,
            airspaceAssessment: airspaceAssessment.path.replace(/\\/g, '/'),
            dnpPermit: dnpPermit.path.replace(/\\/g, '/'),
            militaryPermit: militaryPermit.path.replace(/\\/g, '/'),
            authorityPermit: authorityPermit.path.replace(/\\/g, '/'),
        }

        const newFlight = new FlightModel({
            detailDrone,
            flightDate,
            takeOffPoint,
            document: newDocument,
            landingPoint,
            pilot,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        const savedFlight = await newFlight.save()

        const reqPreparation = {
            detailChecklist: [
                { step: "Setup airframe PUTA" },
                { step: "Setup telemetry" },
                { step: "Check wind direction and speed" },
                { step: "Setting GCS (Ground Control Sistem)" },
                { step: "Battery installation telemetry check GCS activation Check remotes" },
                { step: "Load loading" },
                { step: "Calibration and check center of gravity" },
                { step: "Check actuator (control surface and UAV engine)" },
                { step: "Test hover" },
                { step: "Take off" },
            ],
            type: "preparation",
            flightId: savedFlight._id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        }

        const reqLanding = {
            detailChecklist: [
                { step: "Mission done" },
                { step: "Deactivate system" },
                { step: "Check battery" },
                { step: "Check engine temperature" },
                { step: "Unloading" }
            ],
            type: "landing",
            flightId: savedFlight._id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        }

        const preparation = await addChecklistController({ body: reqPreparation }, res)
        const landing = await addChecklistController({ body: reqLanding }, res)

        const detailChecklist = {
            idPreparation: preparation._id,
            idLanding: landing._id,
            isCompleteChecklist: false
        }

        savedFlight.detailChecklist = detailChecklist

        req.kmlFile = kml

        await next()

        await savedFlight.save()

        res.status(200).json({ message: "Flight & Checklists created successfully" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ e, error: "Internal server error" })
    }
}

export default addFlightController