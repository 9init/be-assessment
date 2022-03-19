const express = require("express")
const mongoose = require("mongoose")

// Connect to database
mongoose.connect('mongodb://localhost:27017/test')

async function x() {

    const interval = 100
    startTime = Date.now()
    const x = setInterval(function inter() {
        const now = Date.now();
        console.log(now);
        // if ((now - startTime) > 1000)
        //     clearInterval(x);
        return inter
    }(), interval)
}

x()

// Routs
const routers = require("./router/router")

const app = express()
app.use(routers)
app.listen(8080, () => console.log("Listening on port 8080"))