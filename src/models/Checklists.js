import mongoose from "mongoose"

const ChecklistType = Object.freeze({
    PREPARATION: "preparation",
    LANDING: "landing",
})

const DetailChecklistSchema = new mongoose.Schema({
    step: {
        type: String,
        required: true
    },
    timeStep: {
        type: Date,
        required: false,
        default: ""
    },
    isCheck: {
        type: Boolean,
        required: false,
        default: false
    },
    
})

const ChecklistSchema = new mongoose.Schema({
    detailChecklist: {
        type: [DetailChecklistSchema],
        required: true,
    },
    isComplete: {
        type: Boolean,
        required: false,
        default: false
    },
    type: {
        type: String,
        enum: Object.values(ChecklistType),
        required: true
    },
    flightId: {
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

export const ChecklistModel = mongoose.model("checklists", ChecklistSchema)