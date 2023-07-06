import mongoose from "mongoose"
import { CounterModel } from "./Counter.js"

const StatusVerification = Object.freeze({
    ACCEPTED: "accepted",
    REVISION: "revision",
    WAITING: "waiting",
})

const CompleteFlightStatus = Object.freeze({
    NONE: "none",
    ACTIVE: "active",
    FAILED: "failed",
    SUCCESS: "success"
})

const LiveCoordinatesSchema = new mongoose.Schema({
    longitude: {
        type: Number,
        required: true,
        default: 0.0
    },
    latitude: {
        type: Number,
        required: true,
        default: 0.0
    },
    altitude: {
        type: Number,
        required: true,
        default: 0.0
    },
    groundSpeed: {
        type: Number,
        required: true,
        default: 0.0
    },
    checkResponse: {
        code: {
            type: Number,
            default: 200
        },
        message: {
            type: String,
            default: "-"
        },
        data: {
            status: {
                type: String,
                default: "-"
            },
            message:{
                type: String,
                default: "-"
            },
            area_name:{
                type: String,
                default: "-"
            }
        },
    },
    createdAt: {
        type: Date,
        required: false
    },
})

const KMLSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId()
    },
    name: {
        type: String,
        required: false,
        default: ""
    },
    coordinates: {
        type: Array,
        required: false,
    },
    kmlFile: {
        type: String,
        required: true
    }
})

const FlightPilotSchema = new mongoose.Schema({
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

const FlightDocumentSchema = new mongoose.Schema({
    kml: {
        type: KMLSchema,
        required: true
    },
    airspaceAssessment: {
        type: String,
        required: true
    },
    dnpPermit: {
        type: String,
        required: true
    },
    militaryPermit: {
        type: String,
    },
    authorityPermit: {
        type: String,
    }
})

const DetailDroneSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
})

const DetailChecklistSchema = new mongoose.Schema({
    idPreparation: {
        type: String,
        required: false,
        default: ""
    },
    idLanding: {
        type: String,
        required: false,
        default: ""
    },
    isCompleteChecklist: {
        type: Boolean,
        required: false,
        default: false
    },
})

const FlightSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    detailDrone: {
        type: DetailDroneSchema,
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
    flightStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    completeFlightStatus: {
        type: String,
        enum: Object.values(CompleteFlightStatus),
        required: true,
        default: CompleteFlightStatus.NONE
    },
    flightDate: {
        type: Date,
        required: true
    },
    departure: {
        type: Date,
        required: false,
        default: ""
    },
    arrival: {
        type: Date,
        required: false,
        default: ""
    },
    takeOffPoint: {
        type: String,
        required: true
    },
    landingPoint: {
        type: String,
        required: true
    },
    pilot: {
        type: [FlightPilotSchema],
        required: true
    },
    document: {
        type: FlightDocumentSchema,
        required: true
    },
    liveFlight: {
        type: [LiveCoordinatesSchema],
        required: false,
        default: []
    },
    isNeedSubmit: {
        type: Boolean,
        required: true,
        default: false
    },
    isNeedVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    detailChecklist: {
        type: DetailChecklistSchema,
        required: false,
        default: {
            idPreparation: "",
            idLanding: "",
            isCompleteChecklist: false,
        }
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

FlightSchema.pre('save', async function (next) {
    const flight = this

    if (!flight.isNew) {
        return next()
    }

    try {
        const sequenceName = 'flightId'
        const counter = await CounterModel.findById(sequenceName)

        if (!counter) {
            const newCounter = new CounterModel({
                _id: sequenceName,
                seq: 1
            })

            await newCounter.save()
            flight._id = "F" + String(newCounter.seq).padStart(6, "0")
        } else {
            const sequenceDocument = await CounterModel.findByIdAndUpdate(
                sequenceName,
                { $inc: { seq: 1 } },
                { new: true }
            )

            flight._id = "F" + String(sequenceDocument.seq).padStart(6, "0")
        }

        next()
    } catch (error) {
        next(error)
    }
})

export const FlightModel = mongoose.model("flights", FlightSchema)