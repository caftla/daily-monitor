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

const Country = ({date, data}) => {
  const date_from = new Date(new Date(date).valueOf() - 1000 * 3600 * 24 * 15).toISOString().split('T')[0]
  const date_to = new Date(new Date(date).valueOf() + 1000 * 3600 * 24 * 2).toISOString().split('T')[0]
  return <TABLE width={930}>
    <thead>
      <tr style={tr_th_style}>
        <TH width={60} style={{ paddingLeft: '0.7em' }} />
        <TH width={150} />
        <TH width={90} value="Views" />
        <TH width={90} value="Share%" />
        <TH width={90} value="Sales" />
        <TH width={90} value="CR%" />
        <TH width={90} value="Pixels%" />
        <TH width={90} value="eCPA" />
        <TH width={90} value="CQ%" />
        <TH width={90} value="Active24%" />
      </tr>
    </thead>
    <tbody>{
      data.data.map((x, i) => <tr key={i}>
        <TD width={60}  value={x.country_code} link={ `http://sigma.sam-media.com/user_sessions/${date_from}/${date_to}/+0.0/country_code=${x.country_code}/country_code/country_code/day?username=sam-media&hash=37b90bce2765c2072c` } style={{ paddingLeft: '0.7em' }}  />
        <TD width={150} value={x.affiliate_name} link={ `http://sigma.sam-media.com/user_sessions/${date_from}/${date_to}/+0.0/country_code=${x.country_code},affiliate_name=${x.affiliate_name}/country_code/affiliate_id/day?username=sam-media&hash=37b90bce2765c2072c` } />
        <TD width='90'  value={d3.format(',')(+x.views) + change_sign(+x.views_change)} />
        <TD width={90}  value={d3.format('0.0f')(100 * +x.country_sales_ratio)} />
        <TD width={90}  value={d3.format(',')(+x.sales) + change_sign(+x.sales_change)} />
        <TD width={90}  value={d3.format('0.2f')(100 * +x.cr) + change_sign(+x.cr_change)} />
        <TD width={90}  value={d3.format('0.0f')(100 * +x.pixels_ratio) + change_sign(+x.pixels_ratio_change)} />
        <TD width={90}  value={format_float(+x.ecpa) + change_sign(+x.ecpa_change)} />
        <TD width={90}  value={d3.format('0.0f')(100 * +x.cq) + change_sign(+x.cq_change)} />
        <TD width={90}  value={d3.format('0.0f')(100 * +x.active24) + change_sign(+x.active24_change * 0.5)} />
      </tr>)
    }
      <tr>
        <TD width={60}  value={data.country_code} style={{ paddingLeft: '0.7em' }}  />
        <TD width={150} value="" />
        <TD width='90'  style={ { fontWeight: 'bold' } } value={d3.format(',')(+data.views) + change_sign(+data.views_change)} />
        <TD width={90}  value="" />
        <TD width={90}  style={ { fontWeight: 'bold' } } value={d3.format(',')(+data.sales) + change_sign(+data.sales_change)} />
        <TD width={90}  style={ { fontWeight: 'bold' } } value={d3.format('0.2f')(100 * +data.cr) + change_sign(+data.cr_change)} />
        <TD width={90}  style={ { fontWeight: 'bold' } } value={d3.format('0.0f')(100 * +data.pixels_ratio) + change_sign(+data.pixels_ratio_change)} />
        <TD width={90}  style={ { fontWeight: 'bold' } } value={d3.format('0.1f')(+data.ecpa) + change_sign(+data.ecpa_change)} />
        <TD width={90}  style={ { fontWeight: 'bold' } } value={d3.format('0.0f')(100 * +data.cq) + change_sign(+data.cq_change)} />
        <TD width={90}  style={ { fontWeight: 'bold' } } value={d3.format('0.0f')(100 * +data.active24) + change_sign(+data.active24_change * 0.5)} />
      </tr>
    </tbody>
  </TABLE>
}


const render_all = (date, d) =>
  <div style={ { backgrounColor: 'white', fontFamily: 'Osaka, CONSOLAS, monospace' } }>
    <h3 style={ { fontWeight: 'bold'  } }>Top affiliates in each country for {timeFormat.timeFormat("%d %B %Y")(new Date(date))}</h3>
    <div style={ { backgroundColor: '#f1f1f1', padding: '1em', margin: '1em 0 2em 0' } }>
      Share: Share of total sales in the country.<br />
      CR%: Conversion rate = sales / visits.<br/>
      Pixels%: Ratio of pixels over sales.<br />
      eCPA: Effective cost per acquisition. How much we paid per sale on average.<br/>
      CQ%: Confirmation quality. The ratio of subscribers which their first time billing was successful.<br/>
      Active24%: Ratio of subscribers that did not unsubscribe in the first 24 hours after subscription.<br/><br/>
      Click on the country name or affiliate to get the breakdown details.
    </div>
    {d.map((x,i) => <Country key={i} date={date} data={x} />)}
    <div style={ { marginTop: '2em' } }>
      Top affiliates are partners that have more than 2% of the sales in each country.<br />
      The number of - or + signs indicates how the metric has changed comparing to the past 7 days.<br/>
      = round(|(value - mean) / sigma - 1.5|)
    </div>
  </div>

const plot = (date, res) => {

  const sorter = x => -1 * (
      Math.abs(x.cr_change)
    + 3 * Math.abs(x.sales_change)
    + 2 * Math.abs(x.ecpa_change) * Math.log(x.sales || 1)
    + Math.abs(x.pixels_ratio_change)
    // + Math.abs(x.cq_change)
  )
  res = R.pipe(
      R.sortBy(sorter)
    , R.filter(x => (x.data || []).length > 0)
    , R.map(c => R.merge(c, { data: R.pipe(R.sortBy(sorter), R.filter(x => x.country_sales_ratio > 0.05 || x.sales > 10))(c.data || []) }))
  )(res)

  return ReactDOMServer.renderToString(render_all(date, res))
}

const daily_top_affiliates_report = (date : string) : Promise<string> =>
  fetch_daily_top_affiliates(date)
  .then(data => plot(date, data))

module.exports = daily_top_affiliates_report
