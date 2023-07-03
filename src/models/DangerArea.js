import mongoose from "mongoose"

const AreaType = Object.freeze({
    MILITARY: "military",
    KKOP: "kkop",
    OBVITNAS: "obvitnas",
})

const DangerAreaSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        enum: Object.values(AreaType),
        required: true
    },
    radius: {
        type: Number,
    },
    coordinates: {
        latitude: Number,
        longitude: Number
    },
    created: {
        type: Date,
        default: Date.now
    }
})

export const DangerAreaModel = mongoose.model("dangerArea", DangerAreaSchema)