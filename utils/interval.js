module.exports = async(interval, cb) => {
    if (typeof cb == "function") cb(null)
    await new Promise(r => setTimeout(r, interval));

    const intervalObj = setInterval(() => {
        if (typeof cb == "function") cb(intervalObj)
    }, interval)
}