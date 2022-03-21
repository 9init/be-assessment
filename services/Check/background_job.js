const { workerData, parentPort } = require("worker_threads")
const https = require("https")
const CancelToken = require("axios").default.CancelToken
const setIntervalX = require("./../../utils/interval")
const axios = require("./../../utils/axios")
const Checks = require("./../../models/Checks")
const { handleWorker } = require("./helper")

const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/test')

const { timeout, interval, _id } = JSON.parse(workerData)

setIntervalX(interval + timeout, (intervalObj) => {
    Checks.findById(_id, null, null, (err, check) => {
        if (err || !check || !check.isRunning) return clearInterval(intervalObj)

        // define url that will be monitored
        const { port, protocol, url, authentication, httpHeaders, ignoreSSL } = check
        const URL = !port ? `${String(protocol).toLowerCase()}://${url}` : `${String(protocol).toLowerCase()}://${url}:${port}`

        // adding headers
        var headersToBeSent = {}

        if (authentication)
            headersToBeSent.authorization = "Basic " + Buffer.from(authentication.username + ":" + authentication.password).toString("base64")
        if (httpHeaders)
            headersToBeSent = {...headersToBeSent, ...httpHeaders }

        // setting https agent
        const agent = new https.Agent({
            rejectUnauthorized: ignoreSSL
        })

        // making the request
        axios
            .get(URL, {
                headers: headersToBeSent,
                timeout: timeout,
                httpsAgent: agent
            })
            .then((response) =>
                handleWorker(response, check, intervalObj, interval)
            )
            .catch((err) => {
                err.error = true
                handleWorker(err, check, intervalObj, interval)
            })
    })

})