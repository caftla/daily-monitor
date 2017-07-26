// @flow
const R = require('ramda')
const pg = require('pg')
const path = require('path')
const fs = require('fs')

const hashCode = function(str : String) : number {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const query = (connection_string: string, query_template:string, params: any) => new Promise((resolve, reject) => {

  var query = query_template

  const add_date_trunc_params = (param_name : string) => {
      const param_value = params[param_name]
      params[`f_${param_name}`] = (table: string, day_column: string) => 
        (!param_value || param_value == '-') ? `'-'`
        : param_value == 'hour'  ? `date_trunc('hour', CONVERT_TIMEZONE('UTC', '${-1 * parseFloat(params.timezone)}', ${table}.${day_column})) :: timestamp AT TIME ZONE '${-1 * parseFloat(params.timezone)}'`
        : param_value == 'day'   ? `date_trunc('day', CONVERT_TIMEZONE('UTC', '${-1 * parseFloat(params.timezone)}', ${table}.${day_column})) :: timestamp AT TIME ZONE '${-1 * parseFloat(params.timezone)}'`
        : param_value == 'week'  ? `date_trunc('week', CONVERT_TIMEZONE('UTC', '${-1 * parseFloat(params.timezone)}', ${table}.${day_column})) :: timestamp AT TIME ZONE '${-1 * parseFloat(params.timezone)}'`
        : param_value == 'month' ? `date_trunc('month', CONVERT_TIMEZONE('UTC', '${-1 * parseFloat(params.timezone)}', ${table}.${day_column})) :: timestamp AT TIME ZONE '${-1 * parseFloat(params.timezone)}'`
        : `coalesce(${table}.${param_value}, 'Unknown')`

      return params
  }

  params = add_date_trunc_params('page')
  params = add_date_trunc_params('section')
  params = add_date_trunc_params('row')

  params.from_date_tz = `CONVERT_TIMEZONE('${-1 * parseFloat(params.timezone)}', '0', '${params.from_date}')`
  params.to_date_tz = `CONVERT_TIMEZONE('${-1 * parseFloat(params.timezone)}', '0', '${params.to_date}')`

  params.f_filter = (table: string) => (
    x => !x 
    ? 'true' 
    : R.compose(
          R.join(' and ')
        , R.map(([k, v]) => R.compose(
              x => `(${x})`
            , R.join(' or ')
            , R.map(v => `${table}.${k}='${v}'`)
            , R.split(';'))(v)
          )
        , R.splitEvery(2)
        , R.split(',')
      )(x)
    )(params.filter)

  R.keys(params).forEach(key => {
    const reg = new RegExp(`\\$${key}\\$`, 'g')
    query = query.replace(reg, params[key])
  })

  query = query.replace(/\$\[(.*)\]\$/ig, (_, match) => {
    return eval(match)
  })

  const cachedFile = path.resolve(__dirname, `./.cached/${hashCode(query)}.json`)
  const write = x =>
    { fs.writeFileSync(path.resolve(__dirname, cachedFile), JSON.stringify(x), 'utf8'); return x; }

  const fromCache = () => new Promise((resolve, reject) => {
    fs.readFile(cachedFile, 'utf8', (err, res) => {
      if(!!err) {
        return reject(err)
      } 
      resolve(JSON.parse(res))
    })
  })

  const fromDB = () => new Promise((resolve, reject) => {
    const client = new pg.Client(connection_string)

    client.connect((err, conn, done) => {
      if(err) {
        client.end();
        return reject(err)
      }
      console.info('---------', 'conn.processID = ', conn.processID, '---------')
      console.info(query)
      console.info('---------')
      client.query(query)
      .then(x =>  { client.end(); resolve(write(x)) })
      .catch(x => { client.end(); reject(x) })
    })
  })

  if(process.argv.some(a => a == '--cached')) {
      console.warn('Reading from cache ', cachedFile)
      return fromCache()
      .then(x => resolve(x))
      .catch(_ => fromDB()
        .then(x => resolve(x))
        .catch(e => reject(e))
      )
  } else {
    return fromDB()
    .then(x => resolve(x))
    .catch(e => reject(e))
  }
})

export default query