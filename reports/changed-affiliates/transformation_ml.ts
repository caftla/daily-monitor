const R = require('ramda');
const detectAnomalies = require('../anomaly-detection/index');

export default async function (data) {
    let trace = (x, y) => {
        console.log(x);
        return y
    };
    let trace_ = x => trace(x, x);

    // let data = _data.filter(d => d.page == 'GR' || d.page == 'QA');

    return detectAnomalies(data);
}
