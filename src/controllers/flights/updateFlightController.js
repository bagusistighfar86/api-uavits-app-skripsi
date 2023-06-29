import fs from "fs"
import { fileURLToPath } from 'url'
import path, { dirname, join } from 'path'
import { FlightModel } from "../../models/Flights.js"

const updateFlightController = async (req, res, next) => {
    try {
        const { id } = req.params
        const { flightDate, takeOffPoint, landingPoint } = req.body
        
        const detailDrone = JSON.parse(req.body.detailDrone)
        const pilot = JSON.parse(req.body.pilot)
    
        const kml = req.files['kml'][0]
        const airspaceAssessment = req.files['airspaceAssessment'][0]
        const dnpPermit = req.files['dnpPermit'][0]

        let militaryPermit
        if (req.files['militaryPermit'])  militaryPermit = req.files['militaryPermit'][0]
        let authorityPermit
        if (req.files['authorityPermit'])  authorityPermit = req.files['authorityPermit'][0]

        const newKML = {
            name: "",
            coordinates: [],
            kmlFile: kml.path.replace(/\\/g, '/')
        }
    
        const newDocument = {
            kml: newKML,
            airspaceAssessment: airspaceAssessment.path.replace(/\\/g, '/'),
            dnpPermit: dnpPermit.path.replace(/\\/g, '/'),
            militaryPermit: militaryPermit?.path?.replace(/\\/g, '/') || "",
            authorityPermit: authorityPermit?.path?.replace(/\\/g, '/') || "",
        }
    
        const updatedData = {
            detailDrone,
            flightDate,
            takeOffPoint,
            document: newDocument,
            landingPoint,
            pilot,
            isNeedSubmit: true,
            updatedAt: new Date()
        }

        const lastFlight = await FlightModel.findOneAndUpdate(
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

        fs.unlinkSync(join(assetsDirectory, lastFlight.document.kml.kmlFile))
        fs.unlinkSync(join(assetsDirectory, lastFlight.document.airspaceAssessment))
        fs.unlinkSync(join(assetsDirectory, lastFlight.document.dnpPermit))
        
        if (lastFlight.document.militaryPermit)
        fs.unlinkSync(join(assetsDirectory, lastFlight.document.militaryPermit))

        if (lastFlight.document.authorityPermit)
        fs.unlinkSync(join(assetsDirectory, lastFlight.document.authorityPermit))


        if (!lastFlight) {
            return res.status(404).json({ error: 'Flight not found' })
        }

        req.kmlFile = kml
        req.flightId = id
        req.savedFlight = lastFlight

        next()
    } catch (e) {
        res.status(500).json({ error: "Internal server error", detail: e.message })
    }
}

export default updateFlightController