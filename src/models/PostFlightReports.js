import mongoose from "mongoose"
import { CounterModel } from "./Counter.js"

const StatusVerification = Object.freeze({
    ACCEPTED: "accepted",
    REVISION: "revision",
    WAITING: "waiting",
})

const UserDetailSchema = new mongoose.Schema({
    operatorName: {
        type: String,
        required: true
    },
    operatorEmail: {
        type: String,
        required: true
    },
})

const PFRPilotSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
})

const FlightDetailSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    flightDate: {
        type: Date,
        required: true
    },
    departure: {
        type: Date,
        required: true
    },
    arrival: {
        type: Date,
        required: true
    },
    pilot: {
        type: [PFRPilotSchema],
        required: true
    }
})

const PFRDocumentSchema = new mongoose.Schema({
    notam: {
        type: String,
        required: true
    },
})

const AbnormalOperationSchema = new mongoose.Schema({
    option1: {
        type: String,
        required: true,
        default: "Attack or disturbance of birds and weather",
    },
    option2: {
        type: String,
        required: true,
        default: "Navigation system problem",
    },
    option3: {
        type: String,
        required: true,
        default: "Powerplant or electrical problem",
    },
    option4: {
        type: String,
        required: true,
        default: "Control system problem",
    },
    option5: {
        type: String,
        required: true,
        default: "Nothing",
    },
    option6: {
        type: String,
        required: true,
        default: "Other",
    },
    otherOption: {
        type: String,
        required: false,
        default: ""
    },
    selectedOption: {
        type: String,
        required: true,
    }
})

const FlighAccidentSchema = new mongoose.Schema({
    option1: {
        type: String,
        required: true,
        default: "Property damage outside UAV",
    },
    option2: {
        type: String,
        required: true,
        default: "UAV fatal damage",
    },
    option3: {
        type: String,
        required: true,
        default: "Potential collision with other UAV/other manned aircraft",
    },
    option4: {
        type: String,
        required: true,
        default: "Collision with other UAV/other manned aircraft",
    },
    option5: {
        type: String,
        required: true,
        default: "Human fatal injury",
    },
    option6: {
        type: String,
        required: true,
        default: "Nothing",
    },
    option7: {
        type: String,
        required: true,
        default: "Other",
    },
    otherOption: {
        type: String,
        required: false,
        default: ""
    },
    selectedOption: {
        type: String,
        required: true,
    }
})

const PFRDetailSchema = new mongoose.Schema({
    operatingPermitNumber: {
        type: Number,
        required: true
    },
    notamNumber: {
        type: Number,
        required: true
    },
    isSafeFlight: {
        type: Boolean,
        required: true
    },
    isOutRange: {
        type: Boolean,
        required: true
    },
    descOutRange: {
        type: String,
        required: false,
        default: ""
    },
    flightAccident: {
        type: FlighAccidentSchema,
        required: true
    },
    abnormalOperation: {
        type: AbnormalOperationSchema,
        required: true
    },
})

const PostFlightReportSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    pfrDetail: {
        type: PFRDetailSchema,
        required: true
    },
    flightDetail: {
        type: FlightDetailSchema,
        required: true
    },
    userDetail: {
        type: UserDetailSchema,
        required: true
    },
    statusVerification: {
        type: String,
        enum: Object.values(StatusVerification),
        required: true,
        default: StatusVerification.WAITING
    },
    noteVerification: {
        type: String,
        required: false,
        default: ""
    },
    document: {
        type: PFRDocumentSchema,
        required: true
    },
    isNeedSubmit: {
        type: Boolean,
        required: true,
        default: true
    },
    isNeedVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: false,
        default: ""
    },
    auth: {
        userId: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        }
    }
})

PostFlightReportSchema.pre('save', async function (next) {
    const pfr = this

    if (!pfr.isNew) {
        return next()
    }

    try {
        const sequenceName = 'postFlightReportId'
        const counter = await CounterModel.findById(sequenceName)

        if (!counter) {
            const newCounter = new CounterModel({
                _id: sequenceName,
                seq: 1
            })

            await newCounter.save()
            pfr._id = "PFR" + String(newCounter.seq).padStart(6, "0")
        } else {
            const sequenceDocument = await CounterModel.findByIdAndUpdate(
                sequenceName,
                { $inc: { seq: 1 } },
                { new: true }
            )

            pfr._id = "PFR" + String(sequenceDocument.seq).padStart(6, "0")
        }

        next()
    } catch (error) {
        next(error)
    }
})

export const PostFlightReportModel = mongoose.model("postFlightReports", PostFlightReportSchema)