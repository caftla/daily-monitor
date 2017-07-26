// @flow

const d3Lib = require('./utils/d3.js')
const table = require('./plottables/table.js')
const R = require('ramda')
const daily_countries_report = require('./reports/daily-countries')
const daily_top_affiliates_report = require('./reports/daily-top-affiliates')
const daily_top_handles_report = require('./reports/daily-top-handles')
const daily_top_countries_report = require('./reports/daily-top-countries')

const main = async () => {
  try {
    const dates = R.pipe(
      R.map(x => new Date(new Date() - x * 1000 * 3600 * 24).toISOString().split('T')[0])
     )(R.range(1, 5))
    const top_countries_result = await daily_top_countries_report(dates[0])
    const aff_result = await daily_top_affiliates_report(dates[0])
    const handle_result = await daily_top_handles_report(dates[0])
    const countries_result = await Promise.all(dates.map(date => daily_countries_report(date)))

    console.log(
      [top_countries_result, aff_result, handle_result].concat(countries_result).join('\n\n') + '\n<br/>{accountaddress}\n'
    )
  } catch (ex) {
    console.error(ex)
  }
}


main()
