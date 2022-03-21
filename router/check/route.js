const router = require("express").Router()

// Route Services
const checkRoutService = require("./checkRoutService")
const reportRoutService = require("./reportRoutService")

// Check routes
router.post("/update/check/:checkId", checkRoutService.PostUpdateCheck)
router.post("/start/check/:checkId", checkRoutService.PostStartCheck)
router.post("/pause/check/:checkId", checkRoutService.PostPauseCheck)
router.delete("/delete", checkRoutService.DeleteCheck)
router.put("/check", checkRoutService.PutCheck)
router.get("/check/:checkId", checkRoutService.GetCheck)
router.get("/checks", checkRoutService.GetChecks)

// Report routes
router.get("/report/:reportId", reportRoutService.getReport)
router.get("/reports", reportRoutService.getReports)
router.get("/reportByTag", reportRoutService.getReportsByTag)

module.exports = router