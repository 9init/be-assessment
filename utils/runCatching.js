function runCatching(func) {
    try {
        func()
    } catch (err) {
        console.error(err)
    }
}

module.exports = runCatching