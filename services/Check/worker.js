const { Worker } = require('worker_threads')

function runService(WorkerData, script) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(script, { WorkerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`stopped with  ${code} exit code`));
        })
    })
}

module.exports = { runService }