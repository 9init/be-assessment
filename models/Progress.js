const { Schema, model, Types } = require("mongoose");

const progressSchema = new Schema({
    check: { type: Types.ObjectId, ref: 'check', required: true },
    progress: { type: Number, required: true, default: 0 },
    status: { type: String, default: "Stopped", enum: ["Stopped", "Running"] },
    responseTime: { type: [Number] },
    history: [String],
    failures: { type: Number, required: true, default: 0 }
}, {
    timestamps: true
})

const Progress = model('progress', schema)

module.exports = Progress