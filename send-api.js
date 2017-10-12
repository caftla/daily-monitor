const request = require('request')
const fs = require('fs')
const R = require('ramda')
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const readFileP = path => new Promise((resolve, reject) => 
  fs.readFile(path, 'utf8', (err, content) => !!err ? reject(err) : resolve(content))
)

const authorize = (credentials) => new Promise((resolve, reject) =>  {
  const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
  const TOKEN_PATH = './gmail-nodejs-quickstart.json';
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      reject(err)
    } else {
      oauth2Client.credentials = JSON.parse(token);
      resolve(oauth2Client);
    }
  });
})

const getOauth2Client = () => readFileP('./client_secret_.apps.googleusercontent.com.json')
  .then(content => authorize(JSON.parse(content)))

const send = email => () => new Promise((resolve, reject) => {
  
  getOauth2Client().then(oauth2Client => 
    sendMessage(email, oauth2Client)
  )
  .then(resp => { console.log('sent to ', email); resolve(resp)})
  .catch(err => { console.error(err); reject(err)})
})

function makeBody(to, from, subject, message) {
    var str = ["Content-Type: text/html; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
        return encodedMail;
}

const sendMessage = (subject, message, email, auth) => new Promise((resolve, reject) =>  {
    var gmail = google.gmail('v1');
    var raw = makeBody(email, 'homam@sam-media.com', subject, message);
    gmail.users.messages.send({
        auth: auth,
        userId: 'me',
        resource: {
            raw: raw
        }
    }, function(err, response) {
        if(!!err)
          reject(err)
        else
          resolve(response)
          
    });
})


const sequence1 = (ps, res) => ps.length == 0
    ? res
    : ps[0]().then(r => sequence1(R.tail(ps), res.concat([r])))


module.exports = (subject, message, emails) => 
  getOauth2Client().then(oauth2Client => {
    return R.pipe(
      R.map(x => () => sendMessage(subject, message, x, oauth2Client)
      .then(_ => console.log(`Sent email to ${x}`))
      .catch(err => console.error(`Error sending email to ${x}`, err)) 
    )
    , xs => sequence1(xs, [])
    )(emails)
  })
