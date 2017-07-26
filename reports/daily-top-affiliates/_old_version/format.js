const d3 = require('d3-format')
const R = require('ramda')

module.exports = res => {
  const change_sign = (change) => {
    const r = Math.round(Math.abs(change) - 1.5) //Math.round( Math.log( Math.abs(diff) / stddev - 1))
    const sign = r > 0 ? R.repeat(change > 0 ? '+' : '-', r).join('') : ''
    return sign.substr(0, 4)
  }

  return R.pipe(
      R.map(R.applySpec({
          country: x => x.country_code
        , affiliate: x => x.affiliate_name
        , 'share%': x => d3.format('0.0f')(100 * +x.country_sales_ratio)
        , subscriptions: x => d3.format(',')(+x.sales) + change_sign(+x.sales_change)
        , 'cr%': x => d3.format('0.2f')(100 * +x.cr) + change_sign(+x.cr_change)
        , 'pixels%': x => d3.format('0.0f')(100 * +x.pixels_ratio) + change_sign(+x.pixels_ratio_change)
        , 'eCPA': x => d3.format('0.1f')(+x.ecpa) + change_sign(+x.ecpa_change)
        , 'cq%': x => d3.format('0.0f')(100 * +x.cq) + change_sign(+x.cq_change)
      }))
    , R.groupBy(x => x.country)
    , R.values
    , R.chain(x => x.concat([R.pipe(R.head, R.map(x => '&nbsp;'))(x)]))
  )(res)
}
