const mongoose = require("mongoose")

const ReportSchema = new mongoose.Schema({
    owner_id: { type: String, required: true },
    check_id: { type: String, required: true },
    status: { type: String, required: true, enum: ["Up", "Down"], default: "Down" },
    availability: { type: String, required: true, default: 0 },
    outages: { type: Number, required: true, default: 0 },
    downtime: { type: Number, required: true, default: -1 },
    uptime: { type: Number, required: true, default: -1 },
    reaches: { type: Number, required: true, default: 0 },
    responseTime: { type: String, required: true, default: 0 },
    responseTimes: { type: [Number], required: true, default: [] },
    history: { type: [String], required: true, default: [] },
})

module.exports = mongoose.model('Report', ReportSchema)