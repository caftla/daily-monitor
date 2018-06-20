import query from './../sql-api'

const fs = require('fs');

const path = require('path');

const detectAnomalies = require('../anomaly-detection/index');

const write = path => x => {
    fs.writeFileSync(path, x, 'utf8');
    return x;
};

export default (params, {affiliatesMap, getHandleUrl}) => query(process.env.jewel_connection_string, fs.readFileSync(path.resolve(__dirname, './index.sql'), 'utf8'), params)
    .then(async (x: { rows: [any] }) => {
        console.log('detecting handle anomalies...');
        // return require('../anomaly-detection/handles-anomalies.json');
        return {
            changedHandles: await detectAnomalies(x.rows, 'handles'),
        }
    })
