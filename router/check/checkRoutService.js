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
            res.send({ state: "We will notify you when check is ready" })
            CheckService.runCheckWorker(newCheck)
        })
    })
}

function getChecks(req, res) {
    Checks.find({ owner_id: req.user.id }, null, null, (err, result) => {
        if (err) return res.state(500).send({ state: "ERROR" })
        res.send({ check: result })
    })
}

function getCheck(req, res) {
    Checks.findOne({ owner_id: req.user.id, _id: req.body.id }, null, null, (err, result) => {
        if (err) return res.state(500).send({ state: "ERROR" })
        res.send({ check: result })
    })
}

function deleteCheck(req, res) {
    Checks.findOneAndRemove({ owner_id: req.user.id, _id: req.body.id }, (err, doc, db_res) => {
        if (err || !doc) return res.send({ state: "ERROR" })
        return res.send({ state: "DELETED" })
    })
}

module.exports = {
    PutCheck: putCheck,
    DeleteCheck: deleteCheck,
    GetCheck: getCheck,
    GetChecks: getChecks
}