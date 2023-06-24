import { FlightModel } from "../../models/Flights.js"
import { PostFlightReportModel } from "../../models/PostFlightReports.js"

const addPostFlightReportController = async (req, res, next) => {
    const { pfrDetail, flightDetail, userDetail, document } = req.body
    try {
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
            notam: document?.notam,
        }

        const newAbnormalOperation = {
            selectedOption: pfrDetail?.abnormalOperation?.selectedOption,
            otherOption: pfrDetail?.abnormalOperation?.otherOption
        }

        const newFlightAccident = {
            selectedOption: pfrDetail?.flightAccident?.selectedOption,
            otherOption: pfrDetail?.flightAccident?.otherOption
        }

        const newUserDetail = {
            operatorName: userDetail?.operatorName,
            operatorEmail: userDetail?.operatorEmail
        }

        const newFlightDetail = {
            id: flightDetail?.id,
            flightDate: flightDetail?.flightDate,
            departure: flightDetail?.departure,
            arrival: flightDetail?.arrival,
            pilot: flightDetail?.pilot
        }

        const newPFRDetail = {
            operatingPermitNumber: pfrDetail?.operatingPermitNumber,
            notamNumber: pfrDetail?.notamNumber,
            isSafeFlight: pfrDetail?.isSafeFlight,
            isOutRange: pfrDetail?.isOutRange,
            descOutRange: pfrDetail?.descOutRange,
            flightAccident: newFlightAccident,
            abnormalOperation: newAbnormalOperation,
        }

        const newPFR = new PostFlightReportModel({
            pfrDetail: newPFRDetail,
            flightDetail: newFlightDetail,
            userDetail: newUserDetail,
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
        res.status(500).json({ e, error: "Internal server error" })
    }
}

export default addPostFlightReportController