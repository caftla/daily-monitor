const R = require('ramda');
const detectAnomalies = require('../anomaly-detection/index');
const Bluebird = require('bluebird');

export default async function (_data) {
    const trace = (x, y) => {
        console.log(x);
        return y
    };
    const trace_ = x => trace(x, x);

    const data = _data.filter(d => d.page == 'QA');

    const summableProps = ['views', 'leads', 'sales', 'uniquesales', 'uniqueleads', 'pixels', 'paid_sales',
        'firstbillings', 'uniquesales', 'optout_24', 'total_optouts', 'cost'];
    const props = summableProps.concat(['cr', 'cq', 'resubs', 'releads', 'pixels_ratio', 'ecpa', 'active24']);

    const safediv = (a, b) => b == 0 ? (a == 0 ? 0 : 1) : a / b;

    const ratios = d => ({
        cr: safediv(d.sales, d.views)
        , cq: safediv(d.firstbillings, d.sales)
        , resubs: safediv(d.sales, d.uniquesales)
        , releads: safediv(d.leads, d.uniqueleads)
        , pixels_ratio: safediv(d.pixels, d.sales)
        , ecpa: safediv(d.cost, d.sales)
        , active24: safediv(d.sales - d.optout_24, d.sales)
    });

    const makePredictionsForAllProps = async (props: string[], stats) => {
        const promises = R.map(async prop => ({
            prop: prop,
            anomalies: await detectAnomalies(
                R.map(s => ({
                    time: s.row.split('T')[0],
                    value: s[prop],
                }))(stats)
            )
        }))(props);
        return await Promise.all(promises);
    };

    // anomaly detection per country
    const aggregatedDataPerCountryPerDay = R.pipe(
        R.groupBy(d => d.page),
        R.map(R.groupBy(d => d.row)),
        R.toPairs,
        R.map(([country, dailyStats]) => [country, R.pipe(
            R.toPairs,
            R.map(([day, stats]) => {
                const output = {
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


    const aggregateDataWithAnomalies = async (data) => {
        const aggregatedData = await Bluebird.map(R.toPairs(data), ([country, stats]) => {
            return new Promise((resolve, reject) => {
                makePredictionsForAllProps(props, stats).then((propsAnomalies) => {
                    propsAnomalies.forEach(function (propAnomalies) {
                        const prop = propAnomalies['prop'];
                        const anoms = propAnomalies['anomalies'];
                        stats = R.map(s => {
                            const a = R.find(a => a.ds == new Date(s.row).valueOf())(anoms);
                            if (a) {
                                if (s['anomalies'] == undefined) {
                                    s['anomalies'] = {}
                                }
                                s['anomalies'][prop] = [a]
                            }
                            return s
                        })(stats)
                    });
                    resolve([country, stats]);
                }).catch(reject)
            })
        });
        return R.fromPairs(aggregatedData)
    };

    const aggregatedData = await aggregateDataWithAnomalies(aggregatedDataPerCountryPerDay);

    // anomaly detection per country per affiliate
    //...

    return aggregatedData
}
