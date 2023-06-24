import { FlightModel } from "../../models/Flights.js"
import addChecklistController from "../checklogs/addChecklistController.js"

const addFlightController = async (req, res) => {
    const { detailDrone, flightDate, takeOffPoint, landingPoint, pilot, document } = req.body
    try {
        const newDetailDrone = {
            id: detailDrone?.id,
            name: detailDrone?.name,
        }

        const newFlightPilot = pilot

        const newKML = {
            name: document?.kml?.name || "",
            coordinates: document?.kml?.coordinates || [],
            kmlFile: document?.kml?.kmlFile || ""
        }

        const newDocument = {
            kml: newKML,
            airspaceAssessment: document?.airspaceAssessment,
            dnpPermit: document?.dnpPermit,
            militaryPermit: document?.militaryPermit || "",
            authorityPermit: document?.authorityPermit || "",
        }

        const newFlight = new FlightModel({
            detailDrone: newDetailDrone,
            flightDate,
            takeOffPoint,
            document: newDocument,
            landingPoint,
            pilot: newFlightPilot,
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
        await savedFlight.save()

        res.status(200).json({ message: "Flight & Checklists created successfully" })
    } catch (e) {
        res.status(500).json({ e, error: "Internal server error" })
    }
}

export default addFlightController