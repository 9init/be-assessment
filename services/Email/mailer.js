const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.MAILER_AUTH_USER,
        pass: process.env.MAILER_AUTH_PASS
    }
})

function sendVerification(email, token) {
    const host = process.env.host
    const port = process.env.host

    const link = `http://${host}:${port}/${token}`
    const content = `Hi,\n\nYou registered an account on [customer portal], before being able to use your account you need to verify that this is your email address by clicking here: ${link}\n\nKind Regards, [company]`
    const subject = "Email Verification"
    sendEmail(email, subject, content)
}

function sendEmail(email, subject, content, callback) {
    message = {
        from: process.env.MAILER_SENDER_EMAIL,
        to: email,
        subject: subject,
        text: content
    }
    return transporter.sendMail(message, (err, info) => {
        if (err) return
    })
}

module.exports = {
    sendEmail: sendEmail,
    sendVerification: sendVerification
}