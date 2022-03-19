const router = require("express").Router()

// Routes
const checkService = require("./checkService")

router.put("/check", checkService.PutCheck)
router.delete("/delete", checkService.DeleteCheck)
router.get("/check", checkService.GetCheck)
router.get("/checks", checkService.GetChecks)

module.exports = router