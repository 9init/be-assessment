const Check = require("./../../models/Checks")
const Report = require("./../../models/Report")

function getReport(req, res) {
    const reportId = req.params.reportId
    Report.findOne({ owner_id: req.user.id, _id: reportId }, { _id: 0, __v: 0 }, null, (err, report) => {
        if (err) return res.status(500).send("Internal server error.")
        res.send(report)
    })
}

function getReports(req, res) {
    Report.find({ owner_id: req.user.id }, { _id: 0, __v: 0 }, null, (err, reports) => {
        if (err) return res.status(500).send("Internal server error.")
        res.send({ reports: reports })
    })
}

function getReportsByTag(req, res) {
    const tagsList = req.body.tags
    Check.find({ owner_id: req.user.id, $or: tagsList }, (err, checks) => {
        if (err) return res.status(500).send("Internal server error.")
        const checksIdArray = []
        checks.forEach(check => {
            checksIdArray.push({ check_id: check.id })
        })
        if (checksIdArray.length == 0) return res.send({ reports: [] })
        Report.find({ $or: checksIdArray }, { _id: 0, __v: 0 }, null, (err, reports) => {
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