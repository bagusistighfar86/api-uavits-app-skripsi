import { FlightModel } from "../../models/Flights.js"
import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const addPostFlightReportController = async (req, res) => {
    try {
        const pfrDetail = JSON.parse(req.body.pfrDetail)
        const flightDetail = JSON.parse(req.body.flightDetail)
        const userDetail = JSON.parse(req.body.userDetail)
    
        const notam = req.files['notam'][0]
        const pfr = await PostFlightReportModel.findOne({
            'flightDetail.id': flightDetail?.id
        })

        if (pfr) {
            return res.status(400).json({ error: "Post flight report already created before" })
        }

        if (!flightDetail || !flightDetail.id) {
            return res.status(400).json({ error: "Invalid flight details" })
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

        res.status(200).json({ message: "Post flight report created successfully" })
    } catch (e) {
        res.status(500).json({ error: "Internal server error", detail: e.message })
    }
}

export default addPostFlightReportController