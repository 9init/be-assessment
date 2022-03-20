function runCatching(func) {
    try {
        func()
    } catch (err) {
        throw err
    }
}

module.exports = runCatching