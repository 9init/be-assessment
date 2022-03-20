const User = require("../../models/User")
const Check = require("./../../models/Checks")
const Report = require("./../../models/Report")


function getReport(req, res) {
    const reportId = req.params.reportId
    Report.findOne({ owner_id: User.id, _id: reportId }, null, null, (err, report) => {
        if (err) return res.status(500).send("Internal server error.")
        res.send(report)
    })
}

function getReports(req, res) {
    Report.find({ owner_id: User.id }, (err, reports) => {
        if (err) return res.status(500).send("Internal server error.")
        res.send({ reports: reports })
    })
}

function getReportsByTag(req, res) {
    const tagsList = req.body.tags
    Check.find({ $or: tagsList }, (err, checks) => {
        if (err) return res.status(500).send("Internal server error.")
        const checksIdArray = []
        checks.forEach(check => {
            checksIdArray.push({ check_id: check.id })
        })
        if (checksIdArray.length == 0) return res.send({ reports: [] })
        Report.find({ $or: checksIdArray }, (err, reports) => {
            if (err) return res.status(500).send("Internal server error.")
            res.send({ reports: reports })
        })
    })
}

module.exports = {
    getReport,
    getReports,
    getReportsByTag
}