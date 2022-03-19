module.exports = (interval, cb) => {
    const intervalObj = setInterval(function fun() {
        if (typeof cb == "function") cb(intervalObj)
        return fun
    }(), interval)
}