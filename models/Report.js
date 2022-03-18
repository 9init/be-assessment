const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    status: { type: String, required: true },
    availability: { type: String, required: true },
    outages: { type: Number, required: true },
    verified: { type: Boolean, required: true },
})

module.exports = mongoose.model('User', UserSchema)