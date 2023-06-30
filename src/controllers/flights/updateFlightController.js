import fs from "fs"
import { fileURLToPath } from 'url'
import path, { dirname, join } from 'path'
import { FlightModel } from "../../models/Flights.js"

const updateFlightController = async (req, res, next) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }

    try {
        const { id } = req.params
        const { flightDate, takeOffPoint, landingPoint } = req.body

        const detailDrone = JSON.parse(req.body.detailDrone)
        const pilot = JSON.parse(req.body.pilot)

        const lastFlight = await FlightModel.findById({
            _id: id,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        let kml = lastFlight.document.kml.kmlFile
        if (req.files['kml']) kml = req.files['kml'][0]

        let airspaceAssessment = lastFlight.document.airspaceAssessment
        if (req.files['airspaceAssessment']) airspaceAssessment = req.files['airspaceAssessment'][0]

        let dnpPermit = lastFlight.document.dnpPermit
        if (req.files['dnpPermit']) dnpPermit = req.files['dnpPermit'][0]

        let militaryPermit = lastFlight.document.militaryPermit
        if (req.files['militaryPermit']) militaryPermit = req.files['militaryPermit'][0]

        let authorityPermit = lastFlight.document.authorityPermit
        if (req.files['authorityPermit']) authorityPermit = req.files['authorityPermit'][0]

        let newKML
        if (kml === lastFlight.document.kml.kmlFile) {
            newKML = {
                name: lastFlight.document.kml.name,
                coordinates: lastFlight.document.kml.coordinates,
                kmlFile: kml
            }
        } else {
            newKML = {
                name: "",
                coordinates: [],
                kmlFile: kml.path.replace(/\\/g, '/')
            }
        }

        const newDocument = {
            kml: newKML,
            airspaceAssessment: airspaceAssessment === lastFlight.document.airspaceAssessment ? airspaceAssessment : airspaceAssessment.path.replace(/\\/g, '/'),
            dnpPermit: dnpPermit === lastFlight.document.dnpPermit ? dnpPermit : dnpPermit.path.replace(/\\/g, '/'),
            militaryPermit: militaryPermit === lastFlight.document.militaryPermit ? militaryPermit : militaryPermit?.path?.replace(/\\/g, '/'),
            authorityPermit: authorityPermit === lastFlight.document.authorityPermit ? authorityPermit : authorityPermit?.path?.replace(/\\/g, '/'),
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

        const newFlight = await FlightModel.findOneAndUpdate(
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


        if (!newFlight) {
            response.code = 404
            response.message = "Flight not found"
            response.data = {}
            return res.status(404).json(response)
        }

        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        const assetsDirectory = join(__dirname, '../../../')

        if (kml !== lastFlight.document.kml.kmlFile)
            fs.unlinkSync(join(assetsDirectory, lastFlight.document.kml.kmlFile))

        if (airspaceAssessment !== lastFlight.document.airspaceAssessment)
            fs.unlinkSync(join(assetsDirectory, lastFlight.document.airspaceAssessment))

        if (dnpPermit !== lastFlight.document.dnpPermit)
            fs.unlinkSync(join(assetsDirectory, lastFlight.document.dnpPermit))

        if (lastFlight.document.militaryPermit !== null && 
            militaryPermit !== lastFlight.document.militaryPermit)
            fs.unlinkSync(join(assetsDirectory, lastFlight.document.militaryPermit))

        if (lastFlight.document.authorityPermit !== null && 
            authorityPermit !== lastFlight.document.authorityPermit)
            fs.unlinkSync(join(assetsDirectory, lastFlight.document.authorityPermit))

        req.kmlFile = kml
        req.flightId = id
        req.savedFlight = newFlight

        next()
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default updateFlightController