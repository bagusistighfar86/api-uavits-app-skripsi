import mongoose from "mongoose"

const KMLSchema = new mongoose.Schema({
    key: {
        type: String,
        default: ""
    },
    flightId: {
        type: String,
    },
    radius: {
        type: Number,
    },
    area: {
        name: String,
        coordinates: []
    },
    created: {
        type: Date,
        default: Date.now
    }
})

export const KMLModel = mongoose.model("kml", KMLSchema)