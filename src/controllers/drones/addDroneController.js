import { DroneModel } from "../../models/Drones.js"

const addDroneController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const { name, serialNumber, expiredDate } = req.body

        const specifications = JSON.parse(req.body.specifications)
        const transponder = JSON.parse(req.body.transponder)

        const dronePicture = req.files['dronePicture'][0]
        const emergencyProcedure = req.files['emergencyProcedure'][0]
        const insuranceDocument = req.files['insuranceDocument'][0]
        const listOfEquipment = req.files['listOfEquipment'][0]
        const droneCertificate = req.files['droneCertificate'][0]

        const drone = await DroneModel.findOne({
            serialNumber,
            transponder: {
                imei: transponder.imei
            }
        })

        if (drone) {
            response.code = 400
            response.message = "Drone already registered"
            response.data = {}
            return res.status(400).json(response)
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

        response.code = 200
        response.message = "Drone created successfully"
        response.data = {}
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default addDroneController