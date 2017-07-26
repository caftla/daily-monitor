import * as React from "react";
import d3 from 'd3'
const d3Scale = require('d3-scale')
import d3Format = require('d3-format')
import * as ReactDOMServer from 'react-dom/server'
const R = require('ramda')
import { A, TABLE, THEAD
    , ChangeSymbol, positiveColorScale, negativeColorScale, neutralColorScale
    , makeColumn
    , newMakeUrl
  } from '../presentation-utils'

export default function(results: any, params: any, {affiliatesMap}) {
  
  const valueToLabel = value => ({ 'total': 'Total', 'delivered': 'Delivered', 'failed': 'Failed', 'deliveredRate': 'Delivey Rate', 'failedRate': 'Failure Rate', 'pending': 'Pending' })[value] || value

  const column = makeColumn(valueToLabel)
  
  const {dateFrom, dateTo} = params

  const { makeUrl, makeCountrySummaryUrl, makeAffiliateSummaryUrl } = newMakeUrl({dateFrom, dateTo})
  
  const cqFormat = d3Format.format('0.0%') 
  const crFormat = d3Format.format('0.2%') 
  const intFormat = d3Format.format(',.0f')
  const bigIntFormat = d3Format.format(',.2s')
  const cpaFormat = d3Format.format(',.2f')
  
  const pagesSummaryPred = _ => true
  
  const pagesPred = s =>
          (s.share_of_total_today > 0.05 || s.share_of_total_base >  0.05) 
      &&  (
                Math.abs(s.metrics.failed.stdChange) > 5
            ||  (Math.abs(s.metrics.total.stdChange) > 2.2 && s.metrics.total.value > 1000)
            || (
                  Math.abs(s.metrics.failedRate.stdChange) > 2.2
                  && Math.abs(s.metrics.failedRate.change) > 0.2 
                  && s.metrics.total.value > 1000
               )
            // ||  (Math.abs(s.metrics.cr.stdChange) > 2.5 && (s.metrics.views.mean > 1000 || s.metrics.views.value > 1000 || s.metrics.sales.mean > 20 || s.metrics.sales.value > 20))
          )
  
  const columns = [
    column('total', positiveColorScale, bigIntFormat)  
  , column('delivered', positiveColorScale, bigIntFormat)  
  , column('failed', negativeColorScale, bigIntFormat)
  , column('deliveredRate', positiveColorScale, cqFormat)
  , column('failedRate', negativeColorScale, cqFormat)
  , column('pending', negativeColorScale, bigIntFormat)
  ]
  
  const pagesSummarycolumns = columns
  
  const PagesSummary = 
    <TABLE>
      <colgroup>
        <col span="1" style={ { width: '5%', minWidth: '60px' } } />
      </colgroup> 
      {
        pagesSummarycolumns.map(c => !!c.colgroup ? c.colgroup() : [])
      }
      <THEAD>{ [<th></th>].concat(pagesSummarycolumns.map(c => c.th())) }</THEAD>
      <tbody>
        { results.filter(pagesSummaryPred).map(s =>
          <tr style={ { borderBottom: 'solid 1px silver' } }>
            <td style={ { paddingLeft: '0.3em' } }><A href={makeCountrySummaryUrl(s.page)}>{ s.page }</A></td>
            {
              pagesSummarycolumns.map(c => c.td(s))
            }
          </tr>
        )}
      </tbody>
    </TABLE>
    
  const Pages = 
    <TABLE>
      <colgroup> 
        <col span="1" style={ { width: '5%', minWidth: '60px' } } />
        <col span="1" style={ { width: '10%', minWidth: '60px' } } />
      </colgroup> 
      {
        pagesSummarycolumns.map(c => !!c.colgroup ? c.colgroup() : [])
      }
      <THEAD style={ { backgroundColor: '#9467bd' } }>{ [<th></th>,<th>Gateway</th>].concat(pagesSummarycolumns.map(c => c.th())) }</THEAD>
      <tbody>
        { R.pipe(R.chain(p => p.sections.map(s => R.merge(s, {page: p.page})) ), R.filter(pagesPred))(results).map(s =>
          <tr style={ { borderBottom: 'solid 1px silver' } }>
            <td style={ { paddingLeft: '0.3em' } }>{ s.page }</td> { /*TODO: add links */ }
            <td style={ { paddingLeft: '0.3em' } }>{ s.section }</td>
            {
              pagesSummarycolumns.map(c => c.td(s))
            }
          </tr>
        )}
      </tbody>
    </TABLE>

  return <div>
      <h3>Changed Gateway Transactions</h3>
      { Pages }
    </div>
  
  // */
}