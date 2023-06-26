import mongoose from "mongoose"
import { CounterModel } from "./Counter.js"

const PilotSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    nik: {
        type: String,
        required: true,
        unique: true
    },
    ktpPicture: {
        type: String,
        required: true,
    },
    flightStatus: {
        type: Boolean,
        required: true,
        default: false,
    },
    certificateExpiredDate: {
        type: Date,
        required: true,
    },
    certificate: {
        type: String,
        required: true,
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

PilotSchema.pre('save', async function (next) {
    const pilot = this

    if (!pilot.isNew) {
        return next()
    }

    try {
        const sequenceName = 'pilotId'
        const counter = await CounterModel.findById(sequenceName)

        if (!counter) {
            const newCounter = new CounterModel({
                _id: sequenceName,
                seq: 1
            })

            await newCounter.save()
            pilot._id = "P" + String(newCounter.seq).padStart(6, "0")
        } else {
            const sequenceDocument = await CounterModel.findByIdAndUpdate(
                sequenceName,
                { $inc: { seq: 1 } },
                { new: true }
            )

            pilot._id = "P" + String(sequenceDocument.seq).padStart(6, "0")
        }

        next()
    } catch (error) {
        next(error)
    }
})

export const PilotModel = mongoose.model("pilots", PilotSchema)