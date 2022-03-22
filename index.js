require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const host = process.env.HOST
const port = process.env.PORT

// Connect to database
mongoose.connect(process.env.DB_HOST)

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
app.listen(port, host, () => console.log(`Listening on port ${port}`))