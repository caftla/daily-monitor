const fs = require('fs')
const R = require('ramda')
const send = require('./send-api')

const subject = 'Daily Campaign Monitor - ' + new Date(new Date() - 1 * 1000 * 3600 * 24).toISOString().split('T')[0]
const message = fs.readFileSync('./test.html', 'utf8')
const emails = R.pipe(
  R.split(',')
, R.map(x => x.trim())
)(fs.readFileSync('emails.txt', 'utf8'))

send(subject, message, emails)
.then(x => console.log('done'))
.catch(err => console.error('Error ', err))

