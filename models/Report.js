const mongoose = require("mongoose")

const ReportSchema = new mongoose.Schema({
    statue: { type: String, required: true, enum: ["Up", "Down"] },
    availability: { type: String, required: true, default: 0 },
    outages: { type: Number, required: true, default: 0 },
    downtime: { type: Number, required: true, default: 0 },
    uptime: { type: Number, required: true, default: 0 },
    responseTime: { type: Number, required: true, default: 0 },
    history: { type: [String], required: true, default: [] },
    check_id: { type: String, required: true }
})

module.exports = mongoose.model('Report', ReportSchema)