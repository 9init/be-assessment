const router = require("express").Router()
const passport = require("passport")

// Passport.js
router.use(passport.initialize())
router.use(passport.session())

passport.use("stateless", new CustomStrategy((req, done) => {
    const { email, password } = req.body
    console.log(req.body)
    User.findOne({ email: email }, (err, user) => {
        if (err) return done(err)
        if (!user) return done(null, false, { message: "Incorrect information." })

        // User found, lets validate
        bcrypt.compare(password, user.password, (err, res) => {
            if (err) return done(err)
            if (res === false) return done(null, false, { message: "Incorrect information" })
            return done(null, user)
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