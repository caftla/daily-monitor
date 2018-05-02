var PythonShell = require('python-shell');

module.exports = (data, section) => new Promise((resolve, reject) => {
    const pyshell = new PythonShell('forecast_and_detect_anomalies.py', {
        mode: 'json',
        scriptPath: __dirname
    });

    pyshell.send({
        'data': data,
        'section': section
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
