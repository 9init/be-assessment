const router = require("express").Router()

// Route Services
const checkRoutService = require("./checkRoutService")
const reportRoutService = require("./reportRoutService")

// Check routes
router.put("/check", checkRoutService.PutCheck)
router.delete("/delete", checkRoutService.DeleteCheck)
router.get("/check", checkRoutService.GetCheck)
router.get("/checks", checkRoutService.GetChecks)

// Report routes
router.get("/report/:reportId", reportRoutService.getReport)
router.get("/reports", reportRoutService.getReports)
router.get("/reportByTag", reportRoutService.getReportsByTag)

module.exports = router