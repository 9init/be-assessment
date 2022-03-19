const router = require("express").Router()
const passport = require("passport")

// Passport.js
router.use(passport.initialize())
router.use(passport.session())

// Routers

// Urls that require no auth
const noAuthLink = ["login", "register", "verify"]

function isLoggedIn(req, res, next) {
    const url = req.url.split("/", 2)[1] || ""
    if (req.isAuthenticated() || noAuthLink.includes(url)) { return next() }
    res.redirect("/login")
}

const service = require("./service")

router.use(isLoggedIn)
router.post("/login", service.PostLogin, (req, res) => { res.send({ state: "LOGGED IN" }) })
router.post("/register", service.PostRegister)
router.get("/login", service.GetLogin)
router.get("/verify/:token", service.GetVerify)

module.exports = router