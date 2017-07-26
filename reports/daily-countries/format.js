const d3 = require('d3-format')
const R = require('ramda')

const format_float = x => d3.format(x < 1 ? '0.2f' : '0.1f')(x)

module.exports = res => {
  const change_sign = (val, avg, stddev) => {
    const diff = val - avg
    const r = Math.round(Math.abs(diff) / stddev - 1.5) //Math.round( Math.log( Math.abs(diff) / stddev - 1))
    const sign = r > 0 && !!r ? R.repeat(diff > 0 ? '+' : '-', Math.min(r, 10)).join('') : ''
    return sign.substr(0, 4)
  }
  return R.pipe(
     R.map(R.applySpec({
        country: R.prop('country_code')
      , views: x => d3.format(',')(x.views) + change_sign(x.views, x.views_avg, x.views_stddev)
      , leads: R.compose(d3.format(','), R.prop('leads'))
      , subscribers: x => d3.format(',')(x.sales) + change_sign(x.sales, x.sales_avg, x.sales_stddev)
      , 'cr%': x => x.views == 0 ? '' : d3.format('0.2f')(100 * x.sales / x.views) + change_sign((x.sales / x.views), x.cr_avg, x.cr_stddev)
      , 'pixels%': x => x.sales == 0 ? '' : d3.format('.0f')(100 * x.pixels / x.sales) + change_sign((x.pixels / x.sales), x.pixels_ratio_avg, x.pixels_ratio_stddev)
      , eCPA: x => x.sales == 0 ? '' : format_float(x.cost / x.sales) + change_sign((x.cost / x.sales), x.ecpa_avg, x.ecpa_stddev)
      , 'cq%': x => x.sales == 0 ? '' : d3.format('.0f')(100 * x.firstbillings / x.sales) + change_sign(x.cq, x.cq_avg, x.cq_stddev)
      , 'active48%': x => x.sales == 0 ? '' : d3.format('.0f')(100 * (x.sales - x.optout_48h) / x.sales)
      , revenue: x => d3.format(',.0f')(x.revenue) + change_sign(x.revenue, x.revenue_avg, x.revenue_stddev)
    }))
  )(res)
}
