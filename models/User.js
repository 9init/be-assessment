const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, required: true, default: false },
    verifiedToken: { type: String, required: true, default: uuidv4() }
})

module.exports = mongoose.model('User', UserSchema)