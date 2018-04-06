const R = require('ramda');
const detectAnomalies = require('../anomaly-detection/index');
const Bluebird = require('bluebird');
const os = require('os');

export default async function (_data) {
    let trace = (x, y) => {
        console.log(x);
        return y
    };
    let trace_ = x => trace(x, x);
    let memory_usage = () => console.log('>>>>>>>>>>>>>> ' + (os.freemem() / Math.pow(10, 9)).toFixed(2) + ' GB is free')

    let data = _data.filter(d => d.page == 'QA');

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

    let makePredictionsForAllProps = async (props: string[], stats) => {
        let promises = R.map(async prop => ({
            prop: prop,
            anomalies: await detectAnomalies(
                R.map(s => ({
                    time: s.row,
                    value: s[prop],
                }))(stats)
            )
        }))(props);
        return await Promise.all(promises);
    };

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
        R.fromPairs,
    )(data);

    // let aggregatedDataPerCountryPerSection = R.pipe(
    //     R.groupBy(d => d.page),
    //     R.map(R.groupBy(d => d.section)),
    //     R.toPairs,
    //     R.map(([country, sectionStats]) => {
    //         let sectionDailyStats = R.map(R.groupBy(ss => ss.row))(sectionStats);
    //         return [country, R.pipe(
    //             R.toPairs,
    //             R.map(([section, dailyStats]) => {
    //                 return [section, R.pipe(
    //                     R.toPairs,
    //                     R.map(([day, stats]) => {
    //                         let output = {
    //                             row: day,
    //                             page: country,
    //                             section: section,
    //                         };
    //                         summableProps.forEach(function (sp) {
    //                             output[sp] = R.sum(R.map(s => s[sp])(stats))
    //                         });
    //                         Object.assign(output, ratios(output));
    //                         return output
    //                     }),
    //                 )(dailyStats)]
    //             }),
    //             R.fromPairs,
    //         )(sectionDailyStats)]
    //     }),
    //     R.fromPairs,
    // )(data);

    let countryMetrics = await Bluebird.map(R.toPairs(aggregatedDataPerCountry), ([country, stats]) => {
        return new Promise((resolve, reject) => {
            makePredictionsForAllProps(props, stats).then((propsAnomalies) => {
                let metrics = {};
                propsAnomalies.forEach(function (propAnomalies) {
                    metrics[propAnomalies['prop']] = propAnomalies['anomalies'][0] || {
                        'actual': '-'
                    };
                });
                resolve({
                    page: country,
                    metrics: metrics,
                    sections: {}
                });
            }).catch(reject)
        })
    });

    // let countrySectionMetrics = await Bluebird.map(R.toPairs(aggregatedDataPerCountryPerSection), async ([country, sectionStats]) => {
    //     return Bluebird.map(R.toPairs(sectionStats), async ([section, stats]) => {
    //         let a = await makePredictionsForAllProps(props, stats)
    //         return new Promise((resolve, reject) => {
    //             makePredictionsForAllProps(props, stats).then((propsAnomalies) => {
    //                 let metrics = {};
    //                 propsAnomalies.forEach(function (propAnomalies) {
    //                     metrics[propAnomalies['prop']] = propAnomalies['anomalies'][0];
    //                 });
    //                 resolve({
    //                     page: country,
    //                     section: section,
    //                     metrics: metrics,
    //                 });
    //             }).catch(reject)
    //         })
    //     })
    // });

    return countryMetrics;
}
