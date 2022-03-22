require("dotenv").config()
const { wrapper } = require("axios-cookiejar-support")
const { CookieJar } = require("tough-cookie")
const jar = new CookieJar();
const axiosInstance = wrapper(require("axios").default.create({ jar }))

const User = require("../models/User")
const Checks = require("../models/Checks")
const Report = require("../models/Report")
const mongoose = require("mongoose")

// Constants
const host = process.env.HOST
const port = process.env.PORT
const dbUrl = process.env.DB_HOST

const hostUrl = `http://${host}:${port}`
const registerUrl = hostUrl + "/register"
const loginUrl = hostUrl + "/login"
const homeUrl = hostUrl + "/home"

it("Connect to database", (done) => {
    mongoose.connect(dbUrl, (err) => {
        if (err) throw err
        expect(true).toBe(true)
        done()
    })
})

let testOwnerId = "-1"
let testCheckId = "-1"
let testReportId = "-1"

it("Deleting user", (done) => {
    User.findOneAndDelete({ email: "test@gmail.com" }, null, (err, user) => {
        if (err) throw err
        testOwnerId = user.id
        expect(true).toBe(true)
        done()
    })
})

it("Deleting old reports", (done) => {
    Checks.findOneAndDelete({ owner_id: testOwnerId }, null, (err, report) => {
        if (err) throw err
        expect(true).toBe(true)
        done()
    })
})

it("Registering", () => {
    return axiosInstance.post(registerUrl, {
        name: "Ahmed-Hesham",
        email: "test@gmail.com",
        password: "123456"
    }).then((res) => {
        expect(res.status).toBe(200)
    }).catch((err) => {
        expect(err.response.status).toBe(200)
    })
})

it("Email Verification", (done) => {
    User.findOneAndUpdate({ email: "test@gmail.com" }, { verified: true }, null, (err, user) => {
        if (err) throw err
        testOwnerId = user.id
        expect(true).toBe(true)
        done()
    })
})

it("Logging in", () => {
    return axiosInstance
        .post(loginUrl, {
            email: "test@gmail.com",
            password: "123456"
        })
        .then((res) => {
            expect(res.status).toBe(200)
        })
        .catch((err) => {
            expect(err.response.status).toBe(200)
        })
})

it("Logged in", () => {
    return axiosInstance
        .get(homeUrl)
        .then((res) => {
            expect(res.status).toBe(200)
        })
        .catch((err) => {
            expect(err.response.status).toBe(200)
        })
})

it("Put check", () => {
    let checkBody = {
        "url": "www.speedtest.com",
        "protocol": "http",
        "path": "/",
        "tags": [{ "tag": "test" }, { "tag": "speed" }]
    }
    return axiosInstance.put(hostUrl + "/check", checkBody)
        .then((res) => {
            expect(res.status).toBe(200)
        })
        .catch((err) => {
            expect(err.response.status).toBe(200)
        })
})

it("Edit check", (done) => {
    //Getting check id
    Checks.findOne({ owner_id: testOwnerId }, null, null, (err, check) => {
        try {
            if (err) throw err
            testCheckId = check.id
            let checkId = check.id
            let newCheckBody = {
                "url": "www.speedtest.com",
                "protocol": "http",
                "path": "/",
                "tags": [{ "tag": "test" }, { "tag": "ssss" }]
            }
            axiosInstance.post(hostUrl + "/update/check/" + checkId, newCheckBody)
                .then((res) => {
                    expect(res.status).toBe(200)
                    done()
                })
                .catch((err) => {
                    console.log(err)
                    expect(err.response.status).toBe(200)
                    done()
                })
        } catch (error) {
            expect(error).toBe(undefined)
            done()
        }

    })
})

it("Pause check", () => {
    return axiosInstance.post(hostUrl + "/pause/check/" + testCheckId)
        .then((res) => {
            expect(res.status).toBe(200)
        })
        .catch((err) => {
            expect(err.response.status).toBe(200)
        })
})

it("Start check", () => {
    return axiosInstance.post(hostUrl + "/start/check/" + testCheckId)
        .then((res) => {
            expect(res.status).toBe(200)
        })
        .catch((err) => {
            expect(err.response.status).toBe(200)
        })
})

it("Get checks", () => {
    return axiosInstance
        .get(hostUrl + "/checks")
        .then((res) => {
            expect(res.status).toBe(200)
        })
        .catch((err) => {
            expect(err.response.status).toBe(200)
        })
})

it("Get check by id", () => {
    return axiosInstance
        .get(hostUrl + "/check/" + testCheckId)
        .then((res) => {
            expect(res.status).toBe(200)
        })
        .catch((err) => {
            expect(err.response.status).toBe(200)
        })
})

it("Get reports", () => {
    return axiosInstance
        .post(hostUrl + "/reports")
        .then((res) => {
            expect(res.status).toBe(200)
        })
        .catch((err) => {
            expect(err.response.status).toBe(200)
        })
})

it("Get report by id", (done) => {
    Report.findOne({ check_id: testCheckId }, null, null, (err, report) => {
        if (err) throw err
        testReportId = report.id
        axiosInstance
            .post(hostUrl + "/report/" + testReportId)
            .then((res) => {
                expect(res.status).toBe(200)
                done()
            })
            .catch((err) => {
                expect(err.response.status).toBe(200)
                done()
            })
    })
})

it("Get report by tags", () => {
    return axiosInstance
        .post(hostUrl + "/reportByTag", {
            "tags": [{
                "tag": "test"
            }]
        })
        .then((res) => {
            expect(res.status).toBe(200)
        })
        .catch((err) => {
            expect(err.response.status).toBe(200)
        })
})

Report.findOneAndRemove({ owner_id: testOwnerId })