import mongoose from "mongoose"
import { CounterModel } from "./Counter.js"

const TransponderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imei: {
        type: String,
        required: true,
        unique: true
    }
})

const DocumentSchema = new mongoose.Schema({
    dronePicture: {
        type: String,
        required: false
    },
    emergencyProcedure: {
        type: String,
        required: true
    },
    insuranceDocument: {
        type: String,
        required: true
    },
    listOfEquipment: {
        type: String,
        required: true
    },
    droneCertificate: {
        type: String,
        required: true
    }
})

const SpecificationsSchema = new mongoose.Schema({
    maxTakeOffWeight: {
        type: Number,
        required: true
    },
    weightWithoutPayload: {
        type: Number,
        required: true
    },
    maxFlightRange: {
        type: Number,
        required: true
    },
    cruiseSpeed: {
        type: Number,
        required: true
    },
    maxCruiseHeight: {
        type: Number,
        required: true
    },
    operationalPayloadHeight: {
        type: Number,
        required: true
    },
    operationalPayloadWeight: {
        type: Number,
        required: true
    },
    fuselageMaterial: {
        type: String,
        required: true
    },
    wingMaterial: {
        type: String,
        required: true
    },
    proximitySensors: {
        type: String,
        required: true
    },
    precisionLandingMechanism: {
        type: String,
        required: true
    },
    fileSaveSystem: {
        type: String,
        required: true
    },
    operationSystem: {
        type: String,
        required: true
    },
    controlSystem: {
        type: String,
        required: true
    },
    communicationSystem: {
        type: String,
        required: true
    },
})

const DroneSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    specifications: {
        type: SpecificationsSchema,
        required: true,
    },
    document: {
        type: DocumentSchema,
        required: true,
    },
    expiredDate: {
        type: Date,
        required: true,
    },
    flightStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    transponder: {
        type: TransponderSchema,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt:{
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

DroneSchema.pre('save', async function (next) {
    const drone = this

    if (!drone.isNew) {
        return next()
    }

    try {
        const sequenceName = 'droneId'
        const counter = await CounterModel.findById(sequenceName)

        if (!counter) {
            const newCounter = new CounterModel({
                _id: sequenceName,
                seq: 1
            })

            await newCounter.save()
            drone._id = "D" + String(newCounter.seq).padStart(6, "0")
        } else {
            const sequenceDocument = await CounterModel.findByIdAndUpdate(
                sequenceName,
                { $inc: { seq: 1 } },
                { new: true }
            )

            drone._id = "D" + String(sequenceDocument.seq).padStart(6, "0")
        }

        next()
    } catch (error) {
        next(error)
    }
})

DroneSchema.index({ serialNumber: 1 })

export const DroneModel = mongoose.model("drones", DroneSchema)