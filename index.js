const express = require("express")
const mongoose = require("mongoose")

// Connect to database
mongoose.connect('mongodb://localhost:27017/test')

// Continue old process in any case like server error or shutdown
const Checks = require("./models/Checks")
const CheckService = require("./services/Check/service")

Checks.find((err, checks) => {
    if (err) return
    checks.forEach((check) => {
        CheckService.runCheckWorker(check)
    })
})

// Routs
const routers = require("./router/router")

const app = express()
app.use(routers)
app.listen(8080, () => console.log("Listening on port 8080"))