const R = require('ramda');
const detectAnomalies = require('../anomaly-detection/index');

export default async function (data) {
    let trace = (x, y) => {
        console.log(x);
        return y
    };
    let trace_ = x => trace(x, x);

    return detectAnomalies(data);
}
