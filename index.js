const express = require("express")
const mongoose = require("mongoose")

// Connect to database
mongoose.connect('mongodb://localhost:27017/test')

// Routs
const routers = require("./router/router")

const app = express()
app.use(routers)
app.listen(8080, () => console.log("Listening on port 8080"))