const fetch = require('node-fetch')
export const fetch_json = url =>
  fetch(url)
  .then(x => x.json())
  .catch(x => {
  	console.error(`Error in ${url} \n`, x)
  	throw x
  })

export const fetch_daily_countries = date =>
  fetch_json(`http://127.0.0.1:4081/apis/projects/575422b0156bf736d3b6fb59/documents/qfcTt2z/execute/1/query?date=${date}`)

export const fetch_daily_top_affiliates = date =>
  fetch_json(`http://127.0.0.1:4081/apis/projects/575422b0156bf736d3b6fb59/documents/qfx8HNL/execute/1/query?date=${date}`)

export const fetch_daily_top_handles = date =>
  fetch_json(`http://127.0.0.1:4081/apis/projects/575422b0156bf736d3b6fb59/documents/qfxSxD1/execute/1/query?date=${date}`)
