const R = require('ramda')

export default function(data, {dateTo, timeZoneOffset}) {
const trace = (x, y) => { console.log(x); return y }
  const trace_ = x => trace(x, x)
  
  const todayPred = x => new Date(dateTo + `+0${(-1 * timeZoneOffset)}:00`).valueOf() - new Date(x.row).valueOf() <= 24 * 3600 * 1000
  
  const baseDefaults = {count: 0, sum: 0, mean: 0, vari: 0, sigma: 0}
  const statsp = props => R.reduce( 
      (acc, a) => R.pipe(R.map(p => {
        const {count, sum, mean, vari} = acc[p]
        const x = a[p]
        const k = 1 / (count + 1)
        const mean_ = mean + k * (x - mean)
        const ssr_ = (count - 1) * vari + k * count * (x - mean) * (x - mean)
        const vari_ = ssr_ / Math.max(1, count)
        return [p, {count: count + 1, sum: sum + x, mean: mean_, vari: vari_, sigma: Math.sqrt(vari_)}]
      }), R.fromPairs)(props)
      , R.pipe(R.map(p => [p, baseDefaults]), R.fromPairs)(props)
    )
  
  const summableProps = ['total', 'delivered', 'pending', 'failed', 'refunded', 'unknown', 'uniquesales']
  const props = summableProps.concat(['deliveredRate', 'failedRate', 'pendingRate'])

  const change = (t, b) => b == 0 ? (t == 0 ? 0 : 1) : (t - b) / b
  const stdChange = (t, {sigma, mean}) => sigma == 0 ? ((t - mean) == 0 ? 0: 1) : (t - mean) / sigma 
  
  const nvl = (n, v) => typeof n == 'undefined' ? v : n
  const todayNvl = today => nvl(today, R.pipe(R.map(p => [p, 0]), R.fromPairs)(props))
  const baseNvl = base => nvl(base, R.pipe(R.map(p => [p, baseDefaults]), R.fromPairs)(props))
  
  const share = (s, p, prop, today) => s.metrics[prop][today ? 'value' : 'mean'] / p.metrics[prop][today ? 'value' : 'mean']
  
  const safediv = (a, b) => b == 0 ? (a == 0 ? 0 : 1) : a / b
  
  const ratios = d => R.merge(d, { 
      deliveredRate: safediv(d.delivered, d.total - d.pending)
    , failedRate: safediv(d.failed, d.total - d.pending) 
    , pendingRare: safediv(d.pending, d.sales) 
  })
  
  const sumAll = R.pipe(statsp(summableProps), R.map(x => x.sum))
  
  const pages = R.pipe(
    R.groupBy(x => x.page)
  , R.map(R.groupBy(x => x.row))
  , R.map(R.pipe(
      R.map(sumAll)
    , R.toPairs
    , R.map(([row, metrics]) => R.merge({row}, ratios(metrics)))
    , R.applySpec({
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
    ))
  )(data)
  
  
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
      share_of_total_base: share(s, p, 'total', false)
    , share_of_total_today: share(s, p, 'total', true)
    }))(p.sections)
  }))
  
  , R.sortBy(R.prop('page'))
  
  )(data)
}