import { DroneModel } from "../../models/Drones.js"

const addDroneController = async (req, res) => {
    const { name, serialNumber, specifications, document, expiredDate, transponder } = req.body

    try {
        const drone = await DroneModel.findOne({
            serialNumber,
            transponder: {
                imei: transponder.imei
            }
        })

        if (drone) {
            return res.status(400).json({ error: "Drone already registered" })
        }

        const newSpecifications = {
            maxTakeOffWeight: specifications?.maxTakeOffWeight,
            weightWithoutPayload: specifications?.weightWithoutPayload,
            maxFlightRange: specifications?.maxFlightRange,
            cruiseSpeed: specifications?.cruiseSpeed,
            maxCruiseHeight: specifications?.maxCruiseHeight,
            operationalPayloadHeight: specifications?.operationalPayloadHeight,
            operationalPayloadWeight: specifications?.operationalPayloadWeight,
            fuselageMaterial: specifications?.fuselageMaterial,
            wingMaterial: specifications?.wingMaterial,
            proximitySensors: specifications?.proximitySensors,
            precisionLandingMechanism: specifications?.precisionLandingMechanism,
            fileSaveSystem: specifications?.fileSaveSystem,
            operationSystem: specifications?.operationSystem,
            controlSystem: specifications?.controlSystem,
            communicationSystem: specifications?.communicationSystem,
        }

        const newDocument = {
            dronePicture: document?.dronePicture || "",
            emergencyProcedure: document?.emergencyProcedure,
            insuranceDocument: document?.insuranceDocument,
            listOfEquipment: document?.listOfEquipment,
            droneCertificate: document?.droneCertificate,
        }

        const newTransponder = {
            name: transponder?.name,
            imei: transponder?.imei,
        }

        const newDrone = new DroneModel({
            name,
            serialNumber,
            specifications: newSpecifications,
            document: newDocument,
            expiredDate,
            transponder: newTransponder,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        await newDrone.save()

        res.status(200).json({ message: "Drone created successfully" })
    } catch (e) {
        res.status(500).json({ e, error: "Internal server error" })
    }
}

export default addDroneController