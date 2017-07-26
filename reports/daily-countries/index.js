// @flow

const d3Lib = require('../../utils/d3.js')
const table = require('../../plottables/table.js')
const R = require('ramda')
const { fetch_daily_countries } = require('../../utils/fetch.js')

const make_daily_countries_report = ({date}) => (window : any, d3, timeFormat, view : any, rdata : Array<any>) => {
  const formatter = require('./format.js')
  const data = formatter(rdata)

  view.append('h3')
  .styles({
    'font-weight': 'bold',
    'font-family': 'Osaka, CONSOLAS, monospace',
    'margin-top': '2em'
  })
  .text(timeFormat.timeFormat("%d %B %Y")(new Date(date)))

  const tableContainer = view.append('div')

  table(window, d3, tableContainer, data, {
    cell: function (view : HTMLElement, name : string, value: string) {
      view.style.fontFamily = 'Osaka, CONSOLAS, monospace'
      view.style.padding = '0.3em 0.7em 0.3em 0.7em'
      view.style.border = '0'
      view.style.color = 'black'
      view.style.borderBottom = 'solid 1px #ddd'
      view.style.margin = '0'
      view.innerHTML = value
    },
    cells: {},
    colsOrder: [],
    cols: null
  })

  d3.selectAll('table thead tr td').styles({
    'font-weight': 'bold',
    'font-family': 'Osaka, CONSOLAS, monospace',
    'padding': '0.2em 0.7em 0.7em 0.7em',
    'margin': '0',
    'min-width': '100px',
    'max-width': '100px',
    'overflow': 'hidden',
    'border': 0,
    'border-bottom': 'solid 1px #ddd',
    'color': 'black'
  })

  d3.selectAll('table').each(function() {
    this.setAttribute('cellpadding', '0')
    this.setAttribute('cellspacing', '0')
    this.setAttribute('border', '0')
    this.style.backgroundColor = 'white'
  })

  d3.selectAll('table tbody tr').each(function(d, i) {
    this.style.backgroundColor = (i % 2) == 0 ? '#f0f0f0' : ''
  })

  return view
}

const daily_countries_report = (date: string) : Promise<string> =>
  fetch_daily_countries(date)
  .then(data => d3Lib(make_daily_countries_report({date: date}), data))

module.exports = daily_countries_report
