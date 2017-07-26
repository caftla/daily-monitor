// @flow

const d3 = require('d3-format')
const timeFormat = require('d3-time-format')
const R = require('ramda')

const ReactDOMServer = require('react-dom/server')
const React = require('react')

const { fetch_daily_top_handles } = require('../../utils/fetch.js')

const handle_templates = {
    IT: "http://n.frogstargames.com/it/"
  , FR: "http://n.apptips.me/fr/"
  , VN: "http://w.vn-mozzi.biz/vn/"
  , IE: "http://n.mobzones.com/ie/"
  , BE: "http://n.mobiworld.biz/be/"
  , TR: "http://n.mobfun.me/tr/"
  , AE: "http://w1.buz2mobile.com/ae/"
  , DE: "http://n.mobiworld.biz/de/"
  , TH: "http://t.buz2mobile.com/th/"
  , ZA: "http://n.frogstargames.com/za/"
  , PT: "http://w1.mozzi.com/pt/"
  , QA: "http://w1.mozzi.com/qa/"
  , SG: "http://w.mozzi.biz/sg/"
  , IQ: "http://n.mobihouze.com/iq/"
  , TW: "http://w.mozzi.biz/tw/"
  , MY: "http://w1.buz2mobile.biz/my/"
  , KE: "http://w1.mozzi.com/ke/"
  , ES: "http://n.teletube.tv/es/"
  , AU: "http://m.videoflux.tv/au/"
  , GH: "http://w1.mozzi.com/gh/"
  , SK: "http://w1.mozzi.com/sk/"
  , RS: "http://n.mobiworld.biz/rs/"
  , BH: "http://w1.buz2mobile.com/bh/"
  , NL: "http://n.mobisexxx.com/nl/"
  , PL: "http://w1.buz2mobile.com/pl/"
  , EE: "http://w1.mozzi.com/ee/"
  , UK: "http://n.mobiworld.biz/uk/"
  , GR: "http://n.frogstargames.com/gr/"
}


const change_sign = (change) => {
  const r = Math.round(Math.abs(change) - 1.5)
  const sign = r > 0 ? R.repeat(change > 0 ? '+' : '-', r).join('') : ''
  return sign.substr(0, 4)
}

const format_float = x => d3.format(x < 1 ? '0.2f' : '0.1f')(x)

const TD = ({value, width, style}) => <td style={ { textAlign: 'left', width: `${width}px`, borderBottom: 'solid 1px #ddd', overflow: 'hidden', padding: '0.3em 0 0.3em 0', ...(style || {}) } }>{value}</td>
const TH = ({value, width, style}) => <th style={ { textAlign: 'left', width: `${width}px`, fontWeight: 'bold', backgroundColor: '#f0f0f0', fontSize: '0.9em', padding: '0.5em 0', ...(style || {}) } }>{value}</th>
const ATD = ({value, country, width, style}) => <td style={ { textAlign: 'left', width: `${width}px`, borderBottom: 'solid 1px #ddd', overflow: 'hidden', padding: '0.3em 0 0.3em 0', ...(style || {}) } }>
  <a style={ { textDecoration: 'none' } } target="_blank" href={ `${handle_templates[country]}${value}?offer=1&device=smart` }>{value}</a>
</td>

const Country = ({data}) => <table style={ { width: '900px', backgroundColor: 'white', marginBottom: '2em', color: 'black', fontFamily: 'Osaka, CONSOLAS, monospace' } } cellSpacing="0" cellPadding="0">
  <thead>
    <tr>
      <TH width='60' style={{ paddingLeft: '0.7em' }} />
      <TH width='150' />
      <TH width='90' value="Share%" />
      <TH width='90' value="Sales" />
      <TH width='90' value="CR%" />
      <TH width='90' value="Pixels%" />
      <TH width='90' value="eCPA" />
      <TH width="90" value="CQ%" />
      <TH width="90" value="Active24%" />
    </tr>
  </thead>
  <tbody>{
    data.data.map((x, i) => <tr key={i}>
      <TD width='60'  value={x.country_code} style={{ paddingLeft: '0.7em' }}  />
      <ATD width='150' value={x.handle_name} country={x.country_code}  />
      <TD width='90'  value={d3.format('0.0f')(100 * +x.country_sales_ratio)} />
      <TD width='90'  value={d3.format(',')(+x.sales) + change_sign(+x.sales_change)} />
      <TD width='90'  value={d3.format('0.2f')(100 * +x.cr) + change_sign(+x.cr_change)} />
      <TD width='90'  value={d3.format('0.0f')(100 * +x.pixels_ratio) + change_sign(+x.pixels_ratio_change)} />
      <TD width='90'  value={format_float(+x.ecpa) + change_sign(+x.ecpa_change)} />
      <TD width="90"  value={d3.format('0.0f')(100 * +x.cq) + change_sign(+x.cq_change)} />
      <TD width="90"  value={d3.format('0.0f')(100 * +x.active24) + change_sign(+x.active24_change * 0.5)} />
    </tr>)
  }
    <tr>
      <TD width='60'  value={data.country_code} style={{ paddingLeft: '0.7em' }}  />
      <TD width='150' value="" />
      <TD width='90'  value="" />
      <TD width='90'  style={ { fontWeight: 'bold' } } value={d3.format(',')(+data.sales) + change_sign(+data.sales_change)} />
      <TD width='90'  style={ { fontWeight: 'bold' } } value={d3.format('0.2f')(100 * +data.cr) + change_sign(+data.cr_change)} />
      <TD width='90'  style={ { fontWeight: 'bold' } } value={d3.format('0.0f')(100 * +data.pixels_ratio) + change_sign(+data.pixels_ratio_change)} />
      <TD width='90'  style={ { fontWeight: 'bold' } } value={d3.format('0.1f')(+data.ecpa) + change_sign(+data.ecpa_change)} />
      <TD width="90"  style={ { fontWeight: 'bold' } } value={d3.format('0.0f')(100 * +data.cq) + change_sign(+data.cq_change)} />
      <TD width="90"  style={ { fontWeight: 'bold' } } value={d3.format('0.0f')(100 * +data.active24) + change_sign(+data.active24_change * 0.5)} />
    </tr>
  </tbody>
</table>


const render_all = (date, d) =>
  <div style={ { backgrounColor: 'white', fontFamily: 'Osaka, CONSOLAS, monospace' } }>
    <h3 style={ { fontWeight: 'bold'  } }>Top handles in each country for {timeFormat.timeFormat("%d %B %Y")(new Date(date))}</h3>
    {d.map((x,i) => <Country key={i} date={date} data={x} />)}
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
    , R.map(c => R.merge(c, { data: R.sortBy(x => x.country_sales_ratio * -1)(c.data) }))
  )(res)

  return ReactDOMServer.renderToString(render_all(date, res))
}

const daily_top_handles_report = (date : string) : Promise<string> =>
  fetch_daily_top_handles(date)
  .then(data => plot(date, data))

module.exports = daily_top_handles_report
