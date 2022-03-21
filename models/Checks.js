const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const CheckSchema = new mongoose.Schema({
    owner_id: { type: String, required: true },
    name: { type: String, required: true, default: uuidv4() },
    url: { type: String, required: true },
    protocol: { type: String, required: true, default: "http", enum: ["http", "https"] },
    path: { type: String, required: true, default: "/" },
    port: { type: Number, required: false, default: null },
    timeout: { type: Number, required: false, default: 5 * 1000 },
    interval: { type: Number, required: false, default: 1000 * 60 * 0.5 },
    threshold: { type: Number, required: false, default: 1 },
    authentication: { type: Object, required: false, default: null },
    httpHeaders: { type: Object, required: false, default: null },
    assert: { type: Object, required: false, default: null },
    tags: { type: [{ tag: { type: String } }], required: false, default: [] },
    ignoreSSL: { type: Boolean, require: false, default: false },
    isRunning: { type: Boolean, required: false, default: true }
})

module.exports = mongoose.model("Check", CheckSchema)