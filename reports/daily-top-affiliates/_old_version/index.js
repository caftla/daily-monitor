const d3Lib = require('../utils/d3.js')
const table = require('../plottables/table.js')
const R = require('ramda')
const { fetch_daily_changed_affiliates } = require('../utils/fetch.js')

const make_report = ({date}) => (window, d3, timeFormat, view, rdata) => {
  const formatter = require('./format.js')
  const data = formatter(rdata)

  view.append('h3')
  .styles({
    'font-weight': 'bold',
    'font-family': 'Osaka, CONSOLAS, monospace',
    'margin-top': '2em'
  })
  .text(`Affilites that have significantly changed comparing to past 7 days for ${timeFormat.timeFormat("%d %B %Y")(new Date(date))}`)

  const tableContainer = view.append('div')

  table(window, d3, tableContainer, data, {
    cell: function (view, name, value) {
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
    if(this.childNodes[0].innerHTML.trim() == '&nbsp;') {
      [...this.childNodes].map(c =>
        c.style.borderTop =  'solid 5px #f0f0f0'
      )
    }
  })

  view.append('h3')
  .styles({
    'font-weight': 'bold',
    'font-family': 'Osaka, CONSOLAS, monospace',
    'margin-top': '2em'
  })
  .text('Summary of Countries')

  return view
}

const generate = date =>
  fetch_daily_changed_affiliates(date)
  .then(data => d3Lib(make_report({date: date}), data))

module.exports = generate
