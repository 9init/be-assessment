const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: "<user>",
        pass: "<pass>"
    }
})

function sendVerification(email, token, callback) {
    const link = `http://localhost:8080/${token}`
    message = {
        from: "example@email.com",
        to: email,
        subject: "Email Verification",
        text: `Hi,\n\nYou registered an account on [customer portal], before being able to use your account you need to verify that this is your email address by clicking here: ${link}\n\nKind Regards, [company]`
    }

    transporter.sendMail(message, callback)
}

module.exports = {
    sendVerification: sendVerification
}