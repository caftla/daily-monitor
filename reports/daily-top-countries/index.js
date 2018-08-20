// @flow

const d3 = require('d3-format')
const timeFormat = require('d3-time-format')
const R = require('ramda')

const ReactDOMServer = require('react-dom/server')
const React = require('react')
import {TD, TH, TABLE, tr_th_style} from '../../plottables/styled_table.js'

const { fetch_daily_top_affiliates } = require('../../utils/fetch.js')

const change_sign = (change) => {
  const r = Math.round(Math.abs(change) - 1.5)
  const sign = r > 0 ? R.repeat(change > 0 ? '+' : '-', r).join('') : ''
  return sign.substr(0, 4)
}

const format_float = x => d3.format(x < 1 ? '0.2f' : '0.1f')(x)

const Country = ({data, date}) => {
  const date_from = new Date(new Date(date).valueOf() - 1000 * 3600 * 24 * 15).toISOString().split('T')[0]
  const date_to = new Date(new Date(date).valueOf() + 1000 * 3600 * 24 * 2).toISOString().split('T')[0]

  return <TABLE width={600}>
    <thead>
      <tr style={tr_th_style}>
        <TH width='80' style={{ paddingLeft: '0.7em' }} />
        <TH width='120' value="Sales" />
        <TH width='120' value="Sales AVG" />
        <TH width='120' value="Sales Change" />
        <TH width='120' value="Sales Change σ" />
      </tr>
    </thead>
    <tbody>{
      data.map((x, i) => <tr key={i}>
        <TD width='80' link={ `http://sigma.sam-media.com/user_sessions/+0.0/${date_from}/${date_to}/country_code=${x.country_code}/country_code/country_code/day?username=sam-media&hash=37b90bce2765c2072c` } value={x.country_code} style={{ paddingLeft: '0.7em' }}  />
        <TD width='120'  value={d3.format(',')(+x.sales) + change_sign(+x.sales_change)} />
        <TD width='120'  value={d3.format(',.0f')(+x.sales_avg)} />
        <TD width='120'  value={d3.format('+.0%')(+x.sales_abs_change)} />
        <TD width='120'  value={d3.format('+.1f')(+x.sales_change) + ' σ'} />
      </tr>)
    }
    </tbody>
  </TABLE>
}


  const render_all = (date, d) =>
    <div style={ { backgrounColor: 'white', fontFamily: 'Osaka, CONSOLAS, monospace' } }>
      <a style={ { color: 'red' } } href={`http://sigma.sam-media.com/daily_reports_archive/${date}/?username=sam-media&hash=37b90bce2765c2072c`}>View full version of this report online</a>
      <h3 style={ { fontWeight: 'bold'  } }>
        Top Changed Countries comparing to the last 7 days
      </h3>
      <Country date={date} data={d} />
    </div>

const plot = (date, res) => {

  const sorter = x => -1 * (
      Math.abs(x.cr_change) 
    + 3 * Math.abs(x.sales_change) 
    + 2 * Math.abs(x.ecpa_change) 
    + Math.abs(x.pixels_ratio_change)
    // + Math.abs(x.cq_change)
  )
  res = R.pipe(
      R.sortBy(sorter)
    , R.filter(x => (x.data || []).length > 0)
    , R.map(c => R.merge(c, { data: R.pipe(R.sortBy(sorter), R.filter(x => x.country_sales_ratio > 0.05 || x.sales > 10))(c.data || []) }))
  )(res)
  
  res = R.pipe(
      R.map(x => ({country_code: x.country_code, sales: x.sales, sales_avg: x.sales_avg, sales_change: x.sales_change, sales_abs_change: x.sales_abs_change}))
    , R.sortBy(x =>  x.sales_change)
    , R.filter(x => Math.abs(x.sales_change) > 2.2 && Math.abs(x.sales_abs_change) > 0.3 && (x.sales > 10 || x.sales_avg > 20))
  )(res)

  return ReactDOMServer.renderToString(render_all(date, res))
}

const daily_top_countries = (date : string) : Promise<string> =>
  fetch_daily_top_affiliates(date)
  .then(data => plot(date, data))

module.exports = daily_top_countries
