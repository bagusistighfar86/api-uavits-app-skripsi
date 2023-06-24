import mongoose from "mongoose"

const ContactSchema = new mongoose.Schema({
    header: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    background: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
      }
})

export const ContactModel = mongoose.model("contacts", ContactSchema)