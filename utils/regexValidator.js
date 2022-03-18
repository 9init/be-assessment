const nameRegex = /^[a-zA-Z\-]+$/
const usernameRegex = /^[a-zA-Z0-9_\.]+$/
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function isValidUserName(username) {
    return usernameRegex.test(username)
}

function isValidName(name) {
    return nameRegex.test(name)
}

function isValidEmail(email) {
    return emailRegex.test(email)
}

module.exports = {
    isValidName: isValidName,
    isValidUserName: isValidUserName,
    isValidEmail: isValidEmail
}