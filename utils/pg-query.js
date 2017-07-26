// @flow
const pg = require('pg')
const R = require('ramda')

const query = (connectionString: string, query_template: string, params: any) => new Promise((resolve, reject) => {

  R.keys(params).forEach(key => {
    const reg = new RegExp("\\$#{key}\\$", 'g')
    query = query.replace(reg, params[key])
  })

  var query = query_template.replace(/\$\[(.*)\]\$/ig, (_, match) => {
    return eval(match)
  })

  const client = new pg.Client(connectionString)

  client.connect((err, conn, done) => {
    if(err) {
      client.end();
      reject(err)
    }
    client.query(query)
    .then(x =>  { client.end(); resolve(x) })
    .catch(x => { client.end(); reject(x) })
  })
})

module.exports = query
