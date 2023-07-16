import mongoose from "mongoose"

const AreaType = Object.freeze({
    MILITARY: "military",
    KKOP: "kkop",
    OBVITNAS: "obvitnas",
})

const DangerAreaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(AreaType),
        required: true
    },
    radius: {
        type: Number,
        required: true
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    created: {
        type: Date,
        default: Date.now
    }
})

export const DangerAreaModel = mongoose.model("dangerArea", DangerAreaSchema)