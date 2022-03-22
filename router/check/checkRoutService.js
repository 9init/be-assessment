const Checks = require("./../../models/Checks")
const Report = require("./../../models/Report")
const CheckService = require("./../../services/Check/service")

function generateCheckFromRequest(req) {
    return new Checks({
        owner_id: req.user._id,
        name: req.body.name,
        url: req.body.url,
        protocol: req.body.protocol,
        path: req.body.path,
        port: req.body.port,
        timeout: req.body.timeout,
        interval: req.body.interval,
        threshold: req.body.threshold,
        authentication: req.body.authentication,
        httpHeaders: req.body.httpHeaders,
        assert: req.body.assert,
        tags: req.body.tags,
        ignoreSSL: req.body.ignoreSSL,
    })
}

function putCheck(req, res) {
    const newCheck = generateCheckFromRequest(req)
    newCheck.save((err) => {
        if (err) return res.status(500).send(`Internal server error. ${err}`)
        newReport = new Report({
            check_id: newCheck.id,
            owner_id: newCheck.owner_id
        })
        newReport.save((err) => {
            if (err) return res.status(500).send(`Internal server error. ${err}`)
            res.send({ message: "We will notify you when check is ready" })
            CheckService.runCheckWorker(newCheck)
        })
    })
}

function getChecks(req, res) {
    Checks.find({ owner_id: req.user.id }, { __v: 0 }, null, (err, result) => {
        if (err) return res.status(500).send({ message: "ERROR" })
        res.send({ checks: result })
    })
}

function getCheck(req, res) {
    Checks.findOne({ owner_id: req.user.id, _id: req.params.checkId }, { __v: 0 }, null, (err, result) => {
        if (err) return res.status(500).send({ message: "ERROR" })
        res.send({ check: result })
    })
}

function postUpdateCheck(req, res) {
    const newCheck = generateCheckFromRequest(req).toJSON()
    delete newCheck._id
    Checks.findOneAndUpdate({ owner_id: req.user.id, _id: req.params.checkId }, newCheck, null, (err, oldCheck, db_res) => {
        if (err || !oldCheck) return res.status(500).send({ message: "ERROR", error: err })
        res.send({ message: "UPDATED" })
    })

}

function postStartCheck(req, res) {
    startOrPause(req, res, true, "RUNNING")
}

function postPauseCheck(req, res) {
    startOrPause(req, res, false, "PAUSED")
}

function startOrPause(req, res, runIt, message) {
    Checks.findOneAndUpdate({ owner_id: req.user.id, _id: req.params.checkId }, { isRunning: runIt }, null, (err, check, db_res) => {
        if (err || !check) return res.status(500).send({ message: "ERROR DOC" })
        if (!check.isRunning && runIt) CheckService.runCheckWorker(check)
        res.send({ message: message })
    })
}

function deleteCheck(req, res) {
    Checks.findOneAndRemove({ owner_id: req.user.id, _id: req.params.checkId }, (err, check, db_res) => {
        if (err || !check) return res.send({ message: "ERROR" })
        Report.findOneAndRemove({ check_id: check.id })
        return res.send({ message: "DELETED" })
    })
}

module.exports = {
    PutCheck: putCheck,
    DeleteCheck: deleteCheck,
    PostStartCheck: postStartCheck,
    PostPauseCheck: postPauseCheck,
    PostUpdateCheck: postUpdateCheck,
    GetCheck: getCheck,
    GetChecks: getChecks
}