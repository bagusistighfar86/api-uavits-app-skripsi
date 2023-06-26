import mongoose from "mongoose"

const OwnershipStatus = Object.freeze({
    ADMIN: 'admin',
    INDIVIDUAL: 'individual',
    COMPANY: 'company',
  })

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(OwnershipStatus),
        required: true
    },
    companyDeed: {
        type: String,
        required: function () {
            return this.role === 'company'
        }
    },
    nik: {
        type: String,
        required: function () {
            return this.role === 'individual'
        }
    },
    identityCard: {
        type: String,
        required: function () {
            return this.role === 'individual'
        }
    },
    created: {
        type: Date,
        default: Date.now
      }
})

export const UserModel = mongoose.model("users", UserSchema)