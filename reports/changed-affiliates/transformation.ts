const R = require('ramda');

export default function (data, {dateTo, timeZoneOffset}) {
    const trace = (x, y) => {
        console.log(x);
        return y
    };
    const trace_ = x => trace(x, x);

    // return data

    // return data.filter(x => x.page == 'BH' && x.section == 'RVK')

    const todayPred = x => new Date(dateTo + `+0${(-1 * timeZoneOffset)}:00`).valueOf() - new Date(x.row).valueOf() <= 24 * 3600 * 1000;

    const baseDefaults = {count: 0, sum: 0, mean: 0, vari: 0, sigma: 0};
    const statsp = props => R.reduce(
        (acc, a) => R.pipe(R.map(p => {
            const {count, sum, mean, vari} = acc[p];
            const x = a[p];
            const k = 1 / (count + 1);
            const mean_ = mean + k * (x - mean);
            const ssr_ = (count - 1) * vari + k * count * (x - mean) * (x - mean);
            const vari_ = ssr_ / Math.max(1, count);
            return [p, {count: count + 1, sum: sum + x, mean: mean_, vari: vari_, sigma: Math.sqrt(vari_)}]
        }), R.fromPairs)(props)
        , R.pipe(R.map(p => [p, baseDefaults]), R.fromPairs)(props)
    );

    const summableProps = ['views', 'leads', 'sales', 'uniquesales', 'uniqueleads', 'pixels', 'paid_sales', 'firstbillings', 'uniquesales', 'optout_24', 'total_optouts', 'cost'];
    const props = summableProps.concat(['cr', 'cq', 'resubs', 'releads', 'pixels_ratio', 'ecpa', 'active24']);

    const change = (t, b) => b == 0 ? (t == 0 ? 0 : 1) : (t - b) / b;
    const stdChange: (t: number, {sigma, mean}: { sigma: number, mean: number }) => number
        = (t, {sigma, mean}) => sigma == 0 ? ((t - mean) == 0 ? 0 : 1) : (t - mean) / sigma;

    const nvl = <T>(n: T, v: T) => typeof n == 'undefined' ? v : n;
    const todayNvl = today => nvl(today, R.pipe(R.map(p => [p, 0]), R.fromPairs)(props));
    const baseNvl = base => nvl(base, R.pipe(R.map(p => [p, baseDefaults]), R.fromPairs)(props));

    const share = (s, p, prop, today) => s.metrics[prop][today ? 'value' : 'mean'] / p.metrics[prop][today ? 'value' : 'mean'];

    const safediv = (a, b) => b == 0 ? (a == 0 ? 0 : 1) : a / b;

    const ratios = d => R.merge(d, {
        cr: safediv(d.sales, d.views)
        , cq: safediv(d.firstbillings, d.sales)
        , resubs: safediv(d.sales, d.uniquesales)
        , releads: safediv(d.leads, d.uniqueleads)
        , pixels_ratio: safediv(d.pixels, d.sales)
        , ecpa: safediv(d.cost, d.sales)
        , active24: safediv(d.sales - d.optout_24, d.sales)
    });

    const sumAll = R.pipe(statsp(summableProps), R.map(x => x.sum));

    const pages = R.pipe(
        R.groupBy(x => x.page)
        , R.map(R.groupBy(x => x.row))
        , R.map(R.pipe(
            R.map(sumAll)
            , R.toPairs
            , R.map(([row, metrics]) => R.merge({row}, ratios(metrics)))
            , R.applySpec({
                today: x => R.compose(todayNvl, R.find(todayPred))(x)
                , base: R.compose(baseNvl, statsp(props), R.reject(todayPred))
            })
            , ({today, base}) => R.pipe(
                R.map(p => [p, {
                    value: today[p]
                    , mean: base[p].mean
                    , stdChange: stdChange(today[p], base[p])
                    , change: change(today[p], base[p].mean)
                }])
                , R.fromPairs
            )(props)
        ))
    )(data);


    return R.pipe(
        R.map(ratios)
        , R.groupBy(x => x.page)
        , R.map(R.groupBy(x => x.section))
        , R.map(R.map(R.pipe(
            R.applySpec({
                today: R.compose(todayNvl, R.find(todayPred))
                , base: R.compose(baseNvl, statsp(props), R.reject(todayPred))
            })
            , ({today, base}) => R.pipe(
                R.map(p => [p, {
                    value: today[p]
                    , mean: base[p].mean
                    , stdChange: stdChange(today[p], base[p])
                    , change: change(today[p], base[p].mean)
                }])
                , R.fromPairs
            )(props)
        )))
        , R.map(R.pipe(R.toPairs, R.map(([section, metrics]) => ({section, metrics}))))
        , R.pipe(R.toPairs, R.map(([page, sections]) => ({
            page
            , metrics: pages[page]
            , sections
        })))
        , R.map(p => R.merge(p, {
            sections: R.map(s => R.merge(s, {
                share_of_sales_base: share(s, p, 'sales', false)
                , share_of_sales_today: share(s, p, 'sales', true)
                , share_of_cost_base: share(s, p, 'cost', false)
                , share_of_cost_today: share(s, p, 'cost', true)
                , share_of_views_base: share(s, p, 'views', false)
                , share_of_views_today: share(s, p, 'views', true)
            }))(p.sections)
        }))
    )(data)
}
