const axios = require('axios').default

// creating axios instance
const instance = axios.create()

// append request start time to request headers in ms
instance.interceptors.request.use((config) => {
    config.headers['request-startTime'] = Date.now()
    return config
})

// append request duration to response headers in ms
instance.interceptors.response.use((response) => {
    const start = response.config.headers['request-startTime']
    const endMilliseconds = Date.now() - start
    response.headers['request-duration'] = endMilliseconds
    return response
})

module.exports = instance