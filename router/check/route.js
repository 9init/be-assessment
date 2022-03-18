const router = require("express").Router()

// Routes
const { PutCheck } = require("./checkService")
router.put("/check", PutCheck)

module.exports = router