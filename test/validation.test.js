const validator = require("../utils/validator")

it(("Email validation"), () => {
    const validEmail = "test@gmail.com"
    const invalidEmail = "test.gmail.com"
    expect(validator.isValidEmail(invalidEmail)).toBe(false)
    expect(validator.isValidEmail(validEmail)).toBe(true)
})

it("Name Validation", () => {
    const validUserName = "Ahmed-Hesham"
    const invalidUserName1 = "Ahmed Hesham"
    const invalidUserName2 = "Ahmed Hesham 5"
    expect(validator.isValidName(validUserName)).toBe(true)
    expect(validator.isValidName(invalidUserName1)).toBe(false)
    expect(validator.isValidName(invalidUserName2)).toBe(false)
})

it("URL Validation", () => {
    const validURL = "http://www.google.com"
    const invalidURL = "www.google.com"
    expect(validator.isValidUrl(validURL)).toBe(true)
    expect(validator.isValidUrl(invalidURL)).toBe(false)
})