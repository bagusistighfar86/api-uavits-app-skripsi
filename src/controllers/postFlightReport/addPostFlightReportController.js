import { FlightModel } from "../../models/Flights.js"
import { PostFlightReportModel } from "../../models/PostFlightReports.js"
import { UserModel } from "../../models/Users.js"

const addPostFlightReportController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const pfrDetail = JSON.parse(req.body.pfrDetail)

        const flightId = req.body.flightId

        const flight = await FlightModel.findById(flightId).exec()

        const flightDetail = {
            id: flightId,
            flightDate: flight.flightDate,
            departure: flight?.departure ? flight?.departure : "2023-08-17T08:00:00.000+00:00",
            arrival: flight?.arrival ? flight?.arrival : "2023-08-17T14:05:00.000+00:00",
            pilot: flight.pilot
        }

        if (!flight) {
            response.code = 404
            response.message = "No flight data"
            response.data = {}
            return res.status(404).json(response)
        }

        flight.completeFlightStatus = pfrDetail?.isSafeFlight ? "success" : "failed"
        await flight.save()
        
        const user = await UserModel.findById(flight.auth.userId).exec()

        if (!user) {
            response.code = 404
            response.message = "No user data"
            response.data = {}
            return res.status(404).json(response)
        }

        const userDetail = {
            operatorName: user.name,
            operatorEmail: user.email
        }
    
        const notam = req.files['notam'][0]
        const pfr = await PostFlightReportModel.findOne({
            'flightDetail.id': flightId
        })

        if (pfr) {
            response.code = 400
            response.message = "Post flight report already registered"
            response.data = {}
            return res.status(400).json(response)
        }

        const newDocument = {
            notam: notam.path.replace(/\\/g, '/'),
        }

        const newPFR = new PostFlightReportModel({
            pfrDetail,
            flightDetail,
            userDetail,
            document: newDocument,
            auth: {
                userId: req.userId,
                role: req.role
            }
        })

        await newPFR.save()

        response.code = 200
        response.message = "Post flight report created successfully"
        response.data = {}
        return res.status(200).json(response)
    } catch (e) {
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default addPostFlightReportController