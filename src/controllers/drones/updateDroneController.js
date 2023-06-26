import fs from "fs"
import { fileURLToPath } from 'url'
import path, { dirname, join } from 'path'
import { DroneModel } from "../../models/Drones.js"

const updateDroneController = async (req, res) => {
    const { id } = req.params
    const { name, serialNumber, expiredDate } = req.body

    const specifications = JSON.parse(req.body.specifications)
    const transponder = JSON.parse(req.body.transponder)

    const dronePicture = req.files['dronePicture'][0]
    const emergencyProcedure = req.files['emergencyProcedure'][0]
    const insuranceDocument = req.files['insuranceDocument'][0]
    const listOfEquipment = req.files['listOfEquipment'][0]
    const droneCertificate = req.files['droneCertificate'][0]

    try {
        const newDocument = {
            dronePicture: dronePicture.path.replace(/\\/g, '/'),
            emergencyProcedure: emergencyProcedure.path.replace(/\\/g, '/'),
            insuranceDocument: insuranceDocument.path.replace(/\\/g, '/'),
            listOfEquipment: listOfEquipment.path.replace(/\\/g, '/'),
            droneCertificate: droneCertificate.path.replace(/\\/g, '/'),
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
        
        const lastDrone = await DroneModel.findOneAndUpdate(
            {
                _id: id,
                auth: {
                    userId: req.userId,
                    role: req.role
                }
            },
            updatedData,
        )

        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        const assetsDirectory = join(__dirname, '../../../')
        fs.unlinkSync(join(assetsDirectory, lastDrone.document.dronePicture))
        fs.unlinkSync(join(assetsDirectory, lastDrone.document.emergencyProcedure))
        fs.unlinkSync(join(assetsDirectory, lastDrone.document.insuranceDocument))
        fs.unlinkSync(join(assetsDirectory, lastDrone.document.listOfEquipment))
        fs.unlinkSync(join(assetsDirectory, lastDrone.document.droneCertificate))

        if (!lastDrone) {
            return res.status(404).json({ error: 'Drone not found' })
        }

        return res.status(200).json({ message: "Drone updated succesfull", lastDrone })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" , detail: error.message})
    }
}

export default updateDroneController