const runCatching = require("./../../utils/runCatching")
const setIntervalX = require("./../../utils/interval")
const axios = require("./../../utils/axios")
const { workerData, parentPort } = require("worker_threads")
const { handleWorker } = require("./helper")

runCatching(() => {
    const check = JSON.parse(workerData)

    // define url that will be monitored
    const { port, protocol, url, timeout, interval } = check
    const URL = !port ? `${String(protocol).toLowerCase()}://${url}` : `${String(protocol).toLowerCase()}://${url}:${port}`

    setIntervalX(interval + timeout, (intervalObj) => {
        axios
            .get(URL)
            .then((response) =>
                handleWorker(response, check, intervalObj, interval)
            )
            .catch((err) => {
                err.error = true
                handleWorker(err, check, intervalObj, interval)
            })
    })
})