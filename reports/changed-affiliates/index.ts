import query from './../sql-api'
import present from './presentation_ml'

const detectAnomalies = require('../anomaly-detection/index');

const fs = require('fs');
const path = require('path');

const write = path => x => {
    fs.writeFileSync(path, x, 'utf8');
    return x;
};

export default (params, {affiliatesMap}) => query(process.env.jewel_connection_string, fs.readFileSync(path.resolve(__dirname, './index.sql'), 'utf8'), params)
    .then((x: { rows: [any] }) => {
        console.log('detecting anomalies...');
        let anomalies = require('../anomaly-detection/anomalies.json');
        return anomalies;
        // return detectAnomalies(x.rows);
    })
    .then((x: any) => present(x, params, {affiliatesMap}))
