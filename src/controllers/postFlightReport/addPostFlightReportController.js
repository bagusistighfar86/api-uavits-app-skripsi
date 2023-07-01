import { FlightModel } from "../../models/Flights.js"
import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const addPostFlightReportController = async (req, res) => {
    let response = {
        code: 200,
        message: "",
        data: {},
    }
    try {
        const pfrDetail = JSON.parse(req.body.pfrDetail)
        const flightDetail = JSON.parse(req.body.flightDetail)
        const userDetail = JSON.parse(req.body.userDetail)
    
        const notam = req.files['notam'][0]
        const pfr = await PostFlightReportModel.findOne({
            'flightDetail.id': flightDetail?.id
        })

        if (pfr) {
            response.code = 400
            response.message = "Post flight report already registered"
            response.data = {}
            return res.status(400).json(response)
        }

        if (!flightDetail || !flightDetail.id) {
            response.code = 400
            response.message = "Invalid flight details"
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

        await FlightModel.findByIdAndUpdate(
            flightDetail?.id,
            {
                $set: {
                    departure: flightDetail?.departure,
                    arrival: flightDetail?.arrival,
                    completeFlightStatus: pfrDetail?.isSafeFlight ? "success" : "failed"
                }
            },
            { new: true }
        )
        
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