const Worker = require("./worker")
const { resolve } = require("path")

async function runCheckWorker(checkId) {
    await Worker.runService(checkId, "./services/Check/background_job")
}

module.exports = { runCheckWorker }