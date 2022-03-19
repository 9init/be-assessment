const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: "<user>",
        pass: "<pass>"
    }
})

function sendVerification(email, token) {
    const link = `http://localhost:8080/${token}`
    const content = `Hi,\n\nYou registered an account on [customer portal], before being able to use your account you need to verify that this is your email address by clicking here: ${link}\n\nKind Regards, [company]`
    const subject = "Email Verification"
    sendEmail(email, subject, content)
}

function sendEmail(email, subject, content) {
    message = {
        from: "example@email.com",
        to: email,
        subject: subject,
        text: content
    }
    transporter.sendMail(message)
}

module.exports = {
    sendEmail: sendEmail,
    sendVerification: sendVerification
}