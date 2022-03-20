const Worker = require("./worker")
const { resolve } = require("path")

async function runCheckWorker(check) {
    await Worker.runService(check, "./services/Check/background_job")
}

module.exports = { runCheckWorker }