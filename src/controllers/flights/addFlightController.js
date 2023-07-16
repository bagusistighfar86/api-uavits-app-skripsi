import { FlightModel } from "../../models/Flights.js"
import addChecklistController from "../checklogs/addChecklistController.js"

const addFlightController = async (req, res, next) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { flightDate, takeOffPoint, landingPoint } = req.body

        const detailDrone = JSON.parse(req.body.detailDrone)
        const pilot = JSON.parse(req.body.pilot)

        const kml = req.files['kml'][0]
        const airspaceAssessment = req.files['airspaceAssessment'][0]
        const dnpPermit = req.files['dnpPermit'][0]
        
        let militaryPermit
        if (req.files['militaryPermit']) militaryPermit = req.files['militaryPermit'][0]

        let authorityPermit
        if (req.files['authorityPermit']) authorityPermit = req.files['authorityPermit'][0]
        
        const newKML = {
            _id: new mongoose.Types.ObjectId(),
            name: "",
            coordinates: [],
            kmlFile: kml.path.replace(/\\/g, '/')
        }

        const newDocument = {
            kml: newKML,
            airspaceAssessment: airspaceAssessment.path.replace(/\\/g, '/'),
            dnpPermit: dnpPermit.path.replace(/\\/g, '/'),
            militaryPermit: militaryPermit ? militaryPermit.path.replace(/\\/g, '/') : "",
            authorityPermit: authorityPermit ? authorityPermit.path.replace(/\\/g, '/') : "" ,
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
        req.flightId = savedFlight._id
        req.savedFlight = savedFlight

        next()
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default addFlightController