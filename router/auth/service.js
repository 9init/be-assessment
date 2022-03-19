const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const CustomStrategy = require("passport-custom")
const passport = require("passport")
const validator = require("./../../utils/validator")
const Mailer = require("./../../services/Email/mailer")
const User = require("./../../models/User")
const { send } = require("process")

// Passport.js

passport.use("stateless", new CustomStrategy((req, done) => {
    const { email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (err) return done(err)
        if (!user) return done(null, false, { message: "Incorrect information." })
        if (!user.verified) return done(null, false, { message: "Account need to be verified." })
            // User found, lets validate
        bcrypt.compare(password, user.password, (err, res) => {
            if (err) return done(err)
            if (res === false) return done(null, false, { message: "Incorrect information" })
            return done(null, user, { message: "Login complete" })
        })
    })
}))


passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

// Methods

const postRegister = async(req, res) => {
    const { name, email, password } = req.body
    if (!(validator.isValidName(name) && validator.isValidEmail(email) && password != "")) {
        res.status(403).send("Complete the form")
        return
    }
    const exist = await User.exists({ email: email })
    if (exist) {
        res.status(403).send("User already exist.")
        return
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) return res.status(500).send("Internal server error")
            const token = crypto.randomBytes(64).toString("hex")
            const newUser = new User({
                name: name.replace("-", " ").trim(),
                email: email,
                password: hash,
                verified: false,
                verifiedToken: token
            })

            newUser.save((err) => {
                if (err) return res.status(500).send("Internal server error")
                Mailer.sendVerification(email, token, (err, info) => {
                    if (err) {
                        newUser.delete()
                        res.status(500).send(`Internal server error: ${err}`)
                        return
                    }
                    res.send("Verify your email, check your inbox.")
                })
            })

        })
    })
}

const postLogin = passport.authenticate("stateless", {
    failureRedirect: "/login",
    failureMessage: true
})

const getLogin = (req, res) => {
    res.writeHead(403)
    res.write("Login required\n")
    const m = req.session.messages
    if (m != undefined) res.write(`Message: ${m[0]}`)
    res.end()
}

const getLoggedIn = (req, res) => {
    res.send({ state: "OK" })
}

const getVerify = (req, res) => {
    var token = req.params.token
    User.findOne({ verifiedToken: token }, function(err, user) {
        if (user.verifiedToken == token) {
            User.findOneAndUpdate({ email: user.email }, { verified: true }, function(err, resp) {
                if (err) return res.status(500).send("Internal server error.")
                res.send("Email verified")
            })
        } else {
            res.status(403).send("Invalid token.")
        }
    })
}

module.exports = {
    PostLogin: postLogin,
    GetLogin: getLogin,
    GetLoggedIn: getLoggedIn,
    PostRegister: postRegister,
    GetVerify: getVerify
}