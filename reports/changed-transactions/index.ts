import query from './../sql-api'
const fs = require('fs')
import transform from './transformation'
import present from './presentation'
const path = require('path')

const write = path => x =>
  { fs.writeFileSync(path, x, 'utf8'); return x; }

export default (params, {affiliatesMap}) => query(process.env.jewel_connection_string, fs.readFileSync(path.resolve(__dirname, './index.sql'), 'utf8'), params)
  // .then((x : any) => JSON.stringify(x.rows))
  .then((x : { rows: [any]}) => transform(x.rows, params))
  .then((x : any)  => present(x, params, {affiliatesMap}))
