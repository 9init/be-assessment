const Report = require("./../../models/Report")
const User = require("./../../models/User")
const Mailer = require("./../Email/mailer")
const axios = require("axios").default
const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/test')

// function used when sending email, whether website is down or up
const sendMail = (userID, content) => {
    // getting email of the user
    User.findById(userID, null, null, (err, user) => {
        if (err) return
        const email = user.email
        const subject = "Regarding your check <CheckAPI>"
        Mailer.sendEmail(email, subject, content)
    })
}

// function used to send message to webhook
function sendWebhookMSG(webhookUrl, msg) {
    axios
        .create()
        .post(webhookUrl, { message: msg })
}

// functions used in jobs for reject and resolve the check
async function handleWorker(response, check, interval, intervalPeriod) {
    Report.findOne({ check_id: check._id }, null, null, (db_err, report) => {

        // check if check is exist, otherwise its maybe deleted or invalid id
        if (db_err || !report) return clearInterval(interval)

        // calculate uptime, downtime and outages 
        const upTimeToBeAdded = report.uptime == -1 ? 0 : intervalPeriod + report.uptime
        const newUptime = response.error ? report.uptime : upTimeToBeAdded
        const newDowntime = response.error ? intervalPeriod + report.downtime : report.downtime
        const newOutages = response.error ? report.outages + 1 : report.outages

        // calculate successes, failures and availability
        const newFailures = response.error ? report.failures + 1 : report.failures
        const newSuccesses = response.error ? report.successes : report.successes + 1
        const newAvailability = 100 * newSuccesses / (newSuccesses + newFailures) || 0

        // get duration in millisecond
        const durationMS = response.error ? 0 : response.headers['request-duration']

        // calculate response time
        const newResponseTimes = response.error ? report.responseTimes : [...report.responseTimes, durationMS]
        const newAverageResponseTime = newResponseTimes.reduce((a, b) => a + b, 0) / newResponseTimes.length

        // create log and add it to history

        const status = response.error && response.response ? response.response.status : response.status || 400
        const log = `${new Date(Date.now())} ${response.config.method.toUpperCase()} ${status} ${response.config.url} ${String(check.protocol).toUpperCase()} ${durationMS} ms`
        const logs = [...report.history, log]

        // get url statue
        const newStatus = response.error ? "Down" : "Up"

        Report.updateOne({ check_id: check._id }, {
            status: newStatus,
            availability: newAvailability + "%",
            uptime: newUptime,
            downtime: newDowntime,
            outages: newOutages,
            failures: newFailures,
            successes: newSuccesses,
            responseTimes: newResponseTimes,
            responseTime: newAverageResponseTime + "ms",
            history: logs
        }, null, (err, result) => {
            if (err || !result) return clearInterval(interval)

            // creating content for email and webhook
            const line1 = `Website is ${newStatus} now, you can check report details on : `
            const link = `${process.env.BASE_URL}/report/${report._id}`

            var content =
                `<p>${line1}</p><br />
                 <a href="${link}">${link}</a>`

            // send email alerts and notification on a webhook URL whenever a check goes down or up. 
            if (newStatus == report.status && report.uptime + report.downtime != 0) return

            // sending message to email
            sendMail(check.owner_id, content)

            // sending message to webhook
            if (check.webhook)
                sendWebhookMSG(check.webhook, line1 + link)
        })
    })
}

module.exports = { handleWorker }