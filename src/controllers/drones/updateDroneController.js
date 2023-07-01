import fs from "fs"
import { fileURLToPath } from 'url'
import path, { dirname, join } from 'path'
import { DroneModel } from "../../models/Drones.js"

const updateDroneController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }

    try {
        const { id } = req.params
        const { name, serialNumber, expiredDate } = req.body

        const specifications = JSON.parse(req.body.specifications)
        const transponder = JSON.parse(req.body.transponder)

        const lastDrone = await DroneModel.findById({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        let dronePicture = lastDrone.document.dronePicture
        if (req.files['dronePicture']) dronePicture = req.files['dronePicture'][0]

        let emergencyProcedure = lastDrone.document.emergencyProcedure
        if (req.files['emergencyProcedure']) emergencyProcedure = req.files['emergencyProcedure'][0]

        let insuranceDocument = lastDrone.document.insuranceDocument
        if (req.files['insuranceDocument']) insuranceDocument = req.files['insuranceDocument'][0]

        let listOfEquipment = lastDrone.document.listOfEquipment
        if (req.files['listOfEquipment']) listOfEquipment = req.files['listOfEquipment'][0]

        let droneCertificate = lastDrone.document.droneCertificate
        if (req.files['droneCertificate']) droneCertificate = req.files['droneCertificate'][0]

        const newDocument = {
            dronePicture: dronePicture === lastDrone.document.dronePicture ? dronePicture : dronePicture.path.replace(/\\/g, '/'),
            emergencyProcedure: emergencyProcedure === lastDrone.document.emergencyProcedure ? emergencyProcedure : emergencyProcedure.path.replace(/\\/g, '/'),
            insuranceDocument: insuranceDocument === lastDrone.document.insuranceDocument ? insuranceDocument : insuranceDocument.path.replace(/\\/g, '/'),
            listOfEquipment: listOfEquipment === lastDrone.document.listOfEquipment ? listOfEquipment : listOfEquipment.path.replace(/\\/g, '/'),
            droneCertificate: droneCertificate === lastDrone.document.droneCertificate ? droneCertificate : droneCertificate.path.replace(/\\/g, '/'),
        }

        const updatedData = {
            name,
            serialNumber,
            specifications,
            document: newDocument,
            expiredDate,
            transponder,
            updatedAt: new Date()
        }

        const newDrone = await DroneModel.findOneAndUpdate(
            {
                _id: id,
                auth: {
                    userId: req.userId,
                    role: req.role
                }
            },
            updatedData,
            { new: true }
        )

        if (!newDrone) {
            response.code = 404
            response.message = "Drone not found"
            response.data = {}
            return res.status(404).json(response)
        }

        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        const assetsDirectory = join(__dirname, '../../../')

        if (dronePicture !== lastDrone.document.dronePicture)
            fs.unlinkSync(join(assetsDirectory, lastDrone.document.dronePicture))

        if (emergencyProcedure !== lastDrone.document.emergencyProcedure)
            fs.unlinkSync(join(assetsDirectory, lastDrone.document.emergencyProcedure))

        if (insuranceDocument !== lastDrone.document.insuranceDocument)
            fs.unlinkSync(join(assetsDirectory, lastDrone.document.insuranceDocument))

        if (listOfEquipment !== lastDrone.document.listOfEquipment)
            fs.unlinkSync(join(assetsDirectory, lastDrone.document.listOfEquipment))

        if (droneCertificate !== lastDrone.document.droneCertificate)
            fs.unlinkSync(join(assetsDirectory, lastDrone.document.droneCertificate))

        response.code = 200
        response.message = "Drone data successfully update"
        response.data = { drone: newDrone }
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default updateDroneController