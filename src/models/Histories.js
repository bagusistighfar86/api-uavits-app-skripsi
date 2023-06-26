import mongoose from "mongoose"
import { CounterModel } from "./Counter.js"

const CompleteFlightStatus = Object.freeze({
    NONE: "none",
    ACTIVE: "active",
    FAILED: "failed",
    SUCCESS: "success"
})

const HistoryCoordinatesSchema = new mongoose.Schema({
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
})

const HistoryPilotSchema = new mongoose.Schema({
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

const HistoryDroneDetailSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    droneName: {
        type: String,
        required: true
    },
    droneSerialNumber: {
        type: String,
        required: true
    },
    transponderName: {
        type: String,
        required: true
    },
    transponderImei: {
        type: String,
        required: true
    },
    dronePicture: {
        type: String,
        required: true
    }
})

const HistoryFlightDetailSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    takeOffPoint: {
        type: String,
        required: true
    },
    landingPoint: {
        type: String,
        required: true
    },
    flightDate: {
        type: Date,
        required: true
    },
    departure: {
        type: Date,
        required: true,
    },
    arrival: {
        type: Date,
        required: true
    },
    pilot: {
        type: [HistoryPilotSchema],
        required: true
    },
    completeFlightStatus: {
        type: String,
        enum: Object.values(CompleteFlightStatus),
        required: true
    },
})

const HistorySchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    historyFlightDetail: {
        type: HistoryFlightDetailSchema,
        required: true
    },
    historyDroneDetail: {
        type: HistoryDroneDetailSchema,
        required: true
    },
    historyCoordinates: {
        type: [HistoryCoordinatesSchema],
        required: false,
        default: []
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

HistorySchema.pre('save', async function (next) {
    const history = this

    if (!history.isNew) {
        return next()
    }

    try {
        const sequenceName = 'historyId'
        const counter = await CounterModel.findById(sequenceName)

        if (!counter) {
            const newCounter = new CounterModel({
                _id: sequenceName,
                seq: 1
            })

            await newCounter.save()
            history._id = "H" + String(newCounter.seq).padStart(6, "0")
        } else {
            const sequenceDocument = await CounterModel.findByIdAndUpdate(
                sequenceName,
                { $inc: { seq: 1 } },
                { new: true }
            )

            history._id = "H" + String(sequenceDocument.seq).padStart(6, "0")
        }

        next()
    } catch (error) {
        next(error)
    }
})

export const HistoryModel = mongoose.model("histories", HistorySchema)