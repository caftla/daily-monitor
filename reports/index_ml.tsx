import query from './sql-api'

const fs = require('fs');
const R = require('ramda');
import * as React from "react";
import * as ReactDOMServer from 'react-dom/server'

const path = require('path');

import makeChangedAffiliates from './changed-affiliates/index_ml'
import makeChangedHandles from './changed-handles/index_ml'

import signature from './hash'

const send = require('../send-api.js');

const trace = (x, y) => {
    console.log(x);
    return y
};
const trace_ = x => trace(x, x);

const timeZoneOffset = -2;

const dateFrom = new Date(new Date().valueOf() - 90 * 1000 * 3600 * 24 - timeZoneOffset * 1000 * 3600).toISOString().split('T')[0];
const dateTo = new Date(new Date().valueOf() - timeZoneOffset * 1000 * 3600).toISOString().split('T')[0];
const yesterday = new Date(new Date().valueOf() - 1000 * 3600 * 24 - timeZoneOffset * 1000 * 3600).toISOString().split('T')[0];

// configuration of the magic link lifetime, here set to 7 days
const expiry_ts = new Date().valueOf() + 7 * 1000 * 3600 * 24 - timeZoneOffset * 1000 * 3600;

const dateParams = {
    dateFrom: `${dateFrom}T00:00:00`,
    dateTo: `${dateTo}T00:00:00`,
    timeZoneOffset,
    frequency: 'daily'
};

const changedAffiliatesParams = {
    ...dateParams,
    page: 'country_code',
    section: 'affiliate_id',
    filter: ''
};

const changedHandlesParams = {
    ...dateParams,
    page: 'country_code',
    section: 'handle_name',
    filter: ''
};

const write = fileName => x => new Promise((resolve, reject) => {
    fs.writeFileSync(path.resolve(__dirname, fileName), x, 'utf8');
    resolve(x);
});

const getAffiliatesMap = () => query(process.env.jewel_connection_string, `select * from affiliate_mapping`, {})
    .then((x: { rows: [any] }) => x.rows)
    .then(R.pipe(
        R.map(x => [x.affiliate_id, x.affiliate_name])
        , R.fromPairs
        , x => {
            x['null'] = 'Unknown';
            return x
        }
    ));

const sendMock = (x, y, z) => {
    console.info('sendMock: ', 'Subject:', x, 'To:', z)
};

const sequenceP = xs => {
    if (xs.length == 0) {
        return Promise.resolve([])
    } else {
        const p1 = R.head(xs)();
        return p1.then(y1 => sequenceP(R.tail(xs)).then(ys => [y1].concat(ys)))
    }
};

const getGetHandleUrl = () => query(process.env.jewel_connection_string, `SELECT
      substring(p.landing_page_url, 0, charindex('?', p.landing_page_url)) as handle_url
    , p.handle as handle_name
    , p.country as country_code
    , count(*) as icount
    from pacman p WHERE  landing_page_url is not null 
      and creation_datetime > '$dateFrom$' 
      and creation_datetime < '$dateTo$' 
      and event_type = 'impression' 
    group by country_code, handle_name, handle_url
    order by country_code, handle_name, handle_url`, dateParams,
)
    .catch(_ => require('../data/handles.json')) // fallback
    .then((x: { rows: [any] }) => x.rows)
    .then(R.sortBy(x => x.icount))
    .then(R.pipe(
        R.map(x => [`${x.country_code}$${x.handle_name}`, x.handle_url])
        , R.fromPairs
        , m => {
            return (country_code, handle_name) => m[`${country_code}$${handle_name}`] || null
        }
    ));

async function goDaily() {
    const affiliatesMap = await getAffiliatesMap();
    const getHandleUrl = await getGetHandleUrl();
    const {changedCountries, changedAffiliates} = await makeChangedAffiliates(changedAffiliatesParams, {affiliatesMap});
    const {changedHandles} = await makeChangedHandles(changedHandlesParams, {affiliatesMap, getHandleUrl});

    const subject = `Daily Campaign Monitor - ${yesterday}`;

    const Daily = username => <div style={{
        backgroundColor: 'white', color: 'black',
        fontFamily: 'Osaka, CONSOLAS, Monaco, Courier, monospace, sans-serif',
        fontSize: '14px',
        maxWidth: '1200px',
        margin: `1em 1em`
    }}>
        <h3>{subject}
            <span style={{fontSize: '80%', paddingLeft: '2em'}}> (
            <a style={{color: 'black'}}
               href={`http://sigma.sam-media.com/daily_reports_archive/${yesterday}/?username=${username}&exp_ts=${expiry_ts}&hash=${signature(username, expiry_ts)(process.env.secret)}`}>
                view the full report online
            </a>)
          </span>
        </h3>
        {
            [
                changedCountries,
                changedAffiliates,
                changedHandles
            ].map(c => <div
                style={{marginBottom: '3em', paddingBottom: '0.1em', borderBottom: 'solid 1px silver'}}>{c}</div>)
        }
    </div>;

    R.pipe(
        R.split(',')
        , R.map(entry => entry.trim())
        , R.map(username => ({content: ReactDOMServer.renderToStaticMarkup(Daily(username)), username, yesterday}))
        , R.map(({content, username, yesterday}) => async () => {
            await write(`./../test_daily_emails/${yesterday}_${username}.html`)(content); //for testing
            // return sendMock(subject, content, username) //<- this function mocks "send" function
            return send(subject, content, username) // <- the actual send function
        })
        , sequenceP
    )(fs.readFileSync('emails.txt', 'utf8'));

    return {content: ReactDOMServer.renderToStaticMarkup(Daily('homam@sam-media.com')), yesterday}
}

goDaily()
// .then(trace_)
    .then(({content}) => write('./../../gh-pages/archive/test.html')(content))
    .catch(console.error);
