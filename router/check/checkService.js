const Checks = require("./../../models/Checks")

function putCheck(req, res) {
    console.log("checks")
    const newCheck = new Checks({
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

    newCheck.save((err) => {
        if (err) return res.status(500).send(`Internal server error. ${err}`)
        res.send({ state: "INSERTED" })
    })
}

module.exports = {
    PutCheck: putCheck
}