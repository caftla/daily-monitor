import * as React from "react";
import d3Format = require('d3-format')

const R = require('ramda');
import {
    A, TABLE, THEAD
    , ChangeSymbol, positiveColorScale, negativeColorScale, neutralColorScale
    , makeColumn
    , newMakeUrl
} from '../presentation-utils-ml'

export default function (results: any, params: any, {affiliatesMap, getHandleUrl}) {
    console.log('presenting handles ...');
    // console.log(JSON.stringify(results));
    const cqFormat = d3Format.format('0.0%');
    const crFormat = d3Format.format('0.1%');
    const intFormat = d3Format.format(',.0f');
    const bigIntFormat = d3Format.format(',.2s');
    const cpaFormat = d3Format.format(',.1f');
    const rateFormat = R.pipe(d3Format.format(',.1f'), x => `${x}×`);

    const metricsLabels = value => ({
        'views': 'Views',
        'sales': 'Sales',
        'active24': 'Active 24',
        'cr': 'CR',
        'cq': 'CQ',
        'resubs': 'Re-Subs',
        'pixels_ratio': 'Pixels',
        'ecpa': 'eCPA',
        'total_optouts': 'Unsubs'
    })[value] || value;

    const column = makeColumn(metricsLabels);

    const {dateFrom, dateTo} = params;

    const {makeUrl, makeCountrySummaryUrl, makeHandleSummaryUrl} = newMakeUrl({dateFrom, dateTo});

    const sectionName = s => !s.section || s.section == 'null' ? 'Unknown' : s.section;

    const columns = [
        column('views', positiveColorScale, bigIntFormat),
        column('sales', positiveColorScale, intFormat),
        column('cr', positiveColorScale, crFormat),
        column('cq', positiveColorScale, cqFormat),
        column('resubs', negativeColorScale, rateFormat),
        column('releads', negativeColorScale, rateFormat),
        column('active24', positiveColorScale, cqFormat),
        column('pixels_ratio', neutralColorScale, cqFormat),
        column('ecpa', negativeColorScale, cpaFormat)
    ];

    const makeHandleUrl = (country_code, handle_name) => {
        const b = getHandleUrl(country_code, handle_name);
        return !b ? '' : `${b}?offer=1&device=smart`
    };

    const anomalousHandles = (r) => {
        return <TABLE>
            <colgroup>
                <col span="1" style={{width: '5%'}}/>
                <col span="1" style={{width: '10%'}}/>
            </colgroup>
            {
                columns.map(c => !!c.colgroup ? c.colgroup() : [])
            }
            <THEAD style={{backgroundColor: '#8c564b'}}>
            {
                [<th></th>, <th>Handle</th>].concat(columns.map(c => c.th()))
            }
            </THEAD>
            <tbody>
            {
                R.pipe(
                    R.chain(p => p.sections.map(s => R.merge(s, {country: p.country}))),
                    R.filter(p => p.metrics.sales.prediction && p.metrics.sales.prediction > 0),
                    R.reduce(({list, country}, a) => ({
                        list: list.concat([R.merge(a, {isNew: a.country != country})]),
                        country: a.country
                    }), {list: [], country: null}),
                    R.prop('list')
                )(r).map(s =>
                    <tr style={R.merge({borderBottom: 'solid 1px silver'}, s.isNew ? {borderTop: 'solid 2px #7f7f7f'} : {})}>
                        <td style={{paddingLeft: '0.3em'}}>
                            <A target="_blank" href={makeCountrySummaryUrl(s.country)}>{s.country}</A>
                        </td>
                        <td style={{paddingLeft: '0.3em'}}>
                            <A target="_blank" href={makeHandleSummaryUrl(s.country, s.section)}
                               title={s.section}>{affiliatesMap[s.section] || s.section}
                            </A>
                        </td>
                        {
                            columns.map(c => {
                                return c.td(s, {ignoreBgColor: !['sales', 'pixels_ratio', 'releads'].some(v => v == c.value)});
                            })
                        }
                    </tr>
                )
            }
            </tbody>
        </TABLE>
    };

    const MakeChange = (title, component) => <div>
        <h3>{title}</h3>
        <div>{component}</div>
    </div>;

    let countryMetrics = R.map(c => c.value)(columns);

    const filterCountriesWithoutAnomalies = (d) => {
        return R.pipe(
            R.toPairs,
            R.find(([m, v]) => {
                return countryMetrics.includes(m) && Object.keys(v).length > 1
            })
        )(d.metrics)
    };

    const anomalousHandlesHtml = (handleAnomalies) => {
        return <TABLE>
            <colgroup>
                <col span="1" style={{width: '5%'}}/>
                <col span="1" style={{width: '10%'}}/>
            </colgroup>
            {
                columns.map(c => !!c.colgroup ? c.colgroup() : [])
            }
            <THEAD style={{backgroundColor: '#8c564b'}}>
            {
                [<th></th>,
                    <th>Handle</th>].concat(columns.map(c => c.th()))
            }
            </THEAD>
            <tbody>
            {
                R.pipe(
                    R.chain(p => p.sections.map(s => R.merge(s, {country: p.country}))),
                    //R.filter(p => p.metrics.sales.prediction && p.metrics.sales.prediction > 0),
                    R.reduce(({list, country}, a) => ({
                        list: list.concat([R.merge(a, {isNew: a.country != country})]),
                        country: a.country
                    }), {list: [], country: null}),
                    R.prop('list')
                )(handleAnomalies).map(s =>
                    <tr style={R.merge({borderBottom: 'solid 1px silver'}, s.isNew ? {borderTop: 'solid 2px #7f7f7f'} : {})}>
                        <td style={{paddingLeft: '0.3em'}}>
                            <A target="_blank" href={makeCountrySummaryUrl(s.country)}>{s.country}</A>
                        </td>
                        <td style={{paddingLeft: '0.3em'}}>
                            <A target="_blank" href={makeHandleSummaryUrl(s.country, s.section)}
                               title={s.section}>{affiliatesMap[s.section] || s.section}
                            </A>
                        </td>
                        {
                            columns.map(c => {
                                return c.td(s, {ignoreBgColor: !['sales', 'pixels_ratio', 'releads'].some(v => v == c.value)});
                            })
                        }
                    </tr>
                )
            }
            </tbody>
        </TABLE>;
    };

    return {
        changedHandles: MakeChange(
            'Anomalies in Handles',
            anomalousHandlesHtml(results.handleAnomalies)
        )
    }
}
