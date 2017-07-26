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

export default function(results: any, params: any, {affiliatesMap, getHandleUrl}) {
  
  const cqFormat = d3Format.format('0.0%') 
  const crFormat = d3Format.format('0.1%') 
  const intFormat = d3Format.format(',.0f')
  const bigIntFormat = d3Format.format(',.2s')
  const cpaFormat = d3Format.format(',.1f')
  
  
  const valueToLabel = value => ({ 'views': 'Views', 'sales': 'Sales', 'active24': 'Active 24', 'cr': 'CR', 'cq': 'CQ', 'resubs': 'Re-Subs', 'pixels_ratio': 'Pixels', 'ecpa': 'eCPA', 'total_optouts': 'Unsubs' })[value] || value

  const column = makeColumn(valueToLabel)
  
  const {dateFrom, dateTo} = params

  const { makeUrl, makeCountrySummaryUrl, makeHandleSummaryUrl } = newMakeUrl({dateFrom, dateTo})

  const sectionName = s => !s.section || s.section == 'null' ? 'Unknown' : s.section
  
  
  
  const pagesPred = p =>
      (p.metrics.sales.value > 0 || p.metrics.sales.mean > 10 || p.metrics.sales.sum > 50)
  
  const sectionsPred = s => 
        (s.share_of_sales_today > 0.05 || s.share_of_sales_base >  0.1) 
    &&  (
              ( Math.abs(s.metrics.sales.stdChange) > 2.2 && (s.metrics.sales.value > 10 || s.metrics.sales.mean > 10))
          ||  (Math.abs(s.metrics.cr.stdChange) > 2.5 && (s.metrics.views.value > 1000 || s.metrics.sales.mean > 20 || s.metrics.sales.value > 20))
    )
    
    const allPred = s => (s.share_of_sales_today > 0.05 || s.share_of_sales_base >  0.1)
    
  
  
  const columns = [
    column('views', positiveColorScale, bigIntFormat)  
  , column('sales', positiveColorScale, intFormat)  
  , column('cr', positiveColorScale, crFormat)
  , column('cq', positiveColorScale, cqFormat, { col0: '10%' })
  , column('resubs', negativeColorScale, cqFormat)
  , column('active24', positiveColorScale, cqFormat)
  , column('pixels_ratio', neutralColorScale, cqFormat)
  , column('ecpa', negativeColorScale, cpaFormat)
  ]
  
  const makeHandleUrl = (country_code, handle_name) => {
    const b = getHandleUrl(country_code, handle_name)
    return !b ? '' : `${b}?offer=1&device=smart`
  }

  const Page = (r) => 
    <TABLE>
      <colgroup>
        <col span="1" style={ { width: '5%' } } />
        <col span="1" style={ { width: '10%' } } />
      </colgroup> 
      {
        columns.map(c => !!c.colgroup ? c.colgroup() : [])
      }
      <THEAD style={ { backgroundColor: '#678e8d' } }>{ [<th style={ { paddingLeft: '0.3em' } } colSpan="2"><A style={ { color: 'white' } } href={makeCountrySummaryUrl(r.page)}>{ r.page }</A></th>]
        .concat(columns.map(c => c.th())) }</THEAD>
      <tbody>
        { r.sections.filter(allPred).map(s =>
          <tr style={ { borderBottom: 'solid 1px silver' } }>
            <td style={ { paddingLeft: '0.3em' } }><A href={ makeHandleSummaryUrl(r.page, s.section) }>{ r.page }</A></td>
            <td><A href={ makeHandleUrl(r.page, s.section) }>{ sectionName(s) }</A></td>
            {
              columns.map(c => c.td(s))
            }
          </tr>
        )}
      </tbody>
      <tfoot>
        <tr style={ { borderBottom: 'solid 2px silver', fontWeight: 'bold', height: '5ex' } }>
          <td colSpan="2" style={ { paddingLeft: '0.3em' } }><A href={makeCountrySummaryUrl(r.page)}>{ r.page }</A></td>
          {
            columns.map(c => c.td(r))
          }
        </tr>
      </tfoot>
    </TABLE>
    

  const pagesSummarycolumns =  [
    column('views', positiveColorScale, bigIntFormat)
  , column('sales', positiveColorScale, intFormat)  
  , column('cr', positiveColorScale, crFormat)
  , column('cq', positiveColorScale, cqFormat)
  , column('resubs', negativeColorScale, cqFormat)
  , column('active24', positiveColorScale, cqFormat)
  , column('pixels_ratio', neutralColorScale, cqFormat)
  , column('ecpa', negativeColorScale, cpaFormat)
  ]
  
  
  const PagesAll = results.filter(pagesPred).map((r, i) => 
    <div style={ { marginTop: `${i > 0 ? 1 : 0}em` } }>
      { Page(r) }
    </div>)
    
  const Pages = 
    <TABLE>
      <colgroup>
        <col span="1" style={ { width: '5%' } } />
        <col span="1" style={ { width: '10%' } } />
      </colgroup> 
      {
        columns.map(c => !!c.colgroup ? c.colgroup() : [])
      }
      <THEAD style={ { backgroundColor: '#17becf' } }>{ [<th></th>,<th>Handle</th>].concat(pagesSummarycolumns.map(c => c.th())) }</THEAD>
      <tbody>
        { R.pipe(R.chain(p => p.sections.filter(sectionsPred).map(s => R.merge(s, {page: p.page})) ), R.filter(pagesPred))(results).map(s =>
          <tr style={ { borderBottom: 'solid 1px silver' } }>
            <td style={ { paddingLeft: '0.3em' } }><A href={makeHandleSummaryUrl(s.page, s.section)}>{ s.page }</A></td>
            <td style={ { paddingLeft: '0.3em' } }><A href={makeHandleUrl(s.page, s.section)}>{ sectionName(s) }</A></td>
            {
              pagesSummarycolumns.map(c => c.td(s))
            }
          </tr>
        )}
      </tbody>
    </TABLE>


  const MakeChange = (title, component) => <div>
      <h3>{ title }</h3>
      <div>{ component }</div>
    </div>
 
  
  return {
      changedHandles: MakeChange('Top Changed Handles', Pages)
    , topHandles: MakeChange('Top Handles', PagesAll)
  }
  
  
  // */
}