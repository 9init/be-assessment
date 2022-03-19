const Worker = require("./worker")

async function runCheckWorker(check) {
    await Worker.runService(check, "./background_job.js")
}