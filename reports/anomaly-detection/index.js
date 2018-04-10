var PythonShell = require('python-shell');

module.exports = (metrics, country, stats) => new Promise((resolve, reject) => {
    const pyshell = new PythonShell('forecast_and_detect_anomalies.py', {
        mode: 'json',
        scriptPath: __dirname
    });

    pyshell.send({
        'metrics': metrics,
        'country': country,
        'stats': stats
    });

    pyshell.on('message', function (message) {
        resolve(message)
    });

    pyshell.end(function (err) {
        if (err) {
            reject(err)
        }
    });
})
