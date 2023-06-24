import mongoose from "mongoose"

const CounterSchema = new mongoose.Schema({
    _id: { type: String },
    seq: { type: Number }
})

export const CounterModel = mongoose.model("counter", CounterSchema)