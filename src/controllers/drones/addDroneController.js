import { DroneModel } from "../../models/Drones.js"

const addDroneController = async (req, res) => {
    const { name, serialNumber, expiredDate } = req.body
    
    const specifications = JSON.parse(req.body.specifications)
    const transponder = JSON.parse(req.body.transponder)

    const dronePicture = req.files['dronePicture'][0]
    const emergencyProcedure = req.files['emergencyProcedure'][0]
    const insuranceDocument = req.files['insuranceDocument'][0]
    const listOfEquipment = req.files['listOfEquipment'][0]
    const droneCertificate = req.files['droneCertificate'][0]

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

        const newDocument = {
            dronePicture: dronePicture.path.replace(/\\/g, '/'),
            emergencyProcedure: emergencyProcedure.path.replace(/\\/g, '/'),
            insuranceDocument: insuranceDocument.path.replace(/\\/g, '/'),
            listOfEquipment: listOfEquipment.path.replace(/\\/g, '/'),
            droneCertificate: droneCertificate.path.replace(/\\/g, '/'),
        }

        const newDrone = new DroneModel({
            name,
            serialNumber,
            specifications,
            document: newDocument,
            expiredDate,
            transponder,
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