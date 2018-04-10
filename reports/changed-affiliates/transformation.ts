const R = require('ramda');
const detectAnomalies = require('../anomaly-detection/index');
const Bluebird = require('bluebird');
const os = require('os');

export default async function (data) {
    let trace = (x, y) => {
        console.log(x);
        return y
    };
    let trace_ = x => trace(x, x);
    let log_free_memory = () => console.log((os.freemem() / Math.pow(10, 9)).toFixed(2) + ' GB is free');

    // let data = _data.filter(d => d.page == 'ZA' || d.page == 'AE' || d.page == 'QA');

    let summableProps = ['views', 'leads', 'sales', 'uniquesales', 'uniqueleads', 'pixels', 'paid_sales', 'firstbillings', 'uniquesales', 'optout_24', 'total_optouts', 'cost'];
    let props = summableProps.concat(['cr', 'cq', 'resubs', 'releads', 'pixels_ratio', 'ecpa', 'active24']);

    let safediv = (a, b) => b == 0 ? (a == 0 ? 0 : 1) : a / b;
    let ratios = d => ({
        cr: safediv(d.sales, d.views),
        cq: safediv(d.firstbillings, d.sales),
        resubs: safediv(d.sales, d.uniquesales),
        releads: safediv(d.leads, d.uniqueleads),
        pixels_ratio: safediv(d.pixels, d.sales),
        ecpa: safediv(d.cost, d.sales),
        active24: safediv(d.sales - d.optout_24, d.sales)
    });

    let aggregatedDataPerCountry = R.pipe(
        R.groupBy(d => d.page),
        R.map(R.groupBy(d => d.row)),
        R.toPairs,
        R.map(([country, dailyStats]) => [country, R.pipe(
            R.toPairs,
            R.map(([day, stats]) => {
                let output = {
                    row: day,
                    page: country,
                };
                summableProps.forEach(function (sp) {
                    output[sp] = R.sum(R.map(s => s[sp])(stats))
                });
                Object.assign(output, ratios(output));
                return output
            }),
        )(dailyStats)]),
        R.filter(([country, stats]) => country != 'null'),
        R.fromPairs,
    )(data);

    let todayDataPerCountry = R.pipe(
        R.toPairs,
        R.map(([country, stats]) => [
            country,
            R.filter(d => d.row.split('T')[0] == new Date().toISOString().split('T')[0])(stats)[0]
        ]),
        R.fromPairs
    )(aggregatedDataPerCountry);

    return await Bluebird.map(R.toPairs(aggregatedDataPerCountry), ([country, stats]) => {
        return new Promise((resolve, reject) => {
            detectAnomalies(props, country, stats).then((propsAnomalies) => {
                let anomaliesWithData = R.pipe(
                    R.toPairs,
                    R.map(([prop, anomaly]) => [
                        prop,
                        R.merge(
                            anomaly,
                            {
                                "actual":
                                    todayDataPerCountry[country] != undefined &&
                                    todayDataPerCountry[country][prop] != undefined ? todayDataPerCountry[country][prop] : null
                            }
                        )
                    ]),
                    R.fromPairs
                )(propsAnomalies);
                resolve({
                    page: country,
                    metrics: anomaliesWithData,
                    sections: {}
                });
            }).catch(reject)
        })
    });
}
