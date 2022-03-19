function runCatching(func) {
    try {
        func()
    } catch (error) {}
}

module.exports = runCatching