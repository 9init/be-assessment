async function runCatching(func) {
    try {
        await func()
    } catch (err) {
        console.error(err)
    }
}

module.exports = runCatching