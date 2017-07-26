const request = require('request')
const fs = require('fs')

const R = require('ramda')

const send = email => () => new Promise((resolve, reject) => request.post('https://api.elasticemail.com/v2/email/send', {form:{
      apikey: process.env.elasticemail_api_key
    , subject: 'Daily Campaign Monitor - ' + new Date(new Date() - 1 * 1000 * 3600 * 24).toISOString().split('T')[0]

    , from: 'homam@sam-media.com'
    , to: email
    , bodyHtml: fs.readFileSync('./test.html', 'utf8')
    , isTransactional: 'true'
    }}, function(err, httpResponse, body) {
        console.log(email, err, body);
        if(!!err)
            return reject(err)
        else 
            return resolve(body)
    })
)

const send1 = email => () => new Promise((resolve, reject) => resolve(email))

const sequence1 = (ps, res) => ps.length == 0
    ? res
    : ps[0]().then(r => sequence1(R.tail(ps), res.concat([r])))


R.pipe(
  R.split(',')
, R.map(x => x.trim())
, R.map(x => send(x))
, xs => sequence1(xs, []).then(x => console.log('done')).catch(console.log)
)(fs.readFileSync('emails.txt', 'utf8'))
