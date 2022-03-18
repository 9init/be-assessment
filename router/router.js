const bodyParser = require("body-parser")
const express = require("express")
const session = require("express-session")
const router = require("express").Router()
const authRoute = require("./auth/route")
const checkRoute = require("./check/route")

// Required Middleware
router.use(express.static(__dirname + "/public"))
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.use(session({
    secret: "8462e9228075d59280f62a713152892de3caa6e939e765a8a012da6d723a91d2",
    resave: false,
    saveUninitialized: true
}))

// Combine all routes together
router.use(authRoute) // for authentication and check accessability
router.use(checkRoute) // for check routs, (Auth Routes are needed)


module.exports = router