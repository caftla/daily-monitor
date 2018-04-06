import * as React from "react";
import {
    A,
    makeColumn,
    negativeColorScale,
    neutralColorScale,
    newMakeUrl,
    positiveColorScale,
    TABLE,
    THEAD
} from '../presentation-utils-ml'
import d3Format = require('d3-format');

const R = require('ramda');

export default function (results: any, params: any, {affiliatesMap}) {

    let cqFormat = d3Format.format('0.0%');
    let crFormat = d3Format.format('0.1%');
    let intFormat = d3Format.format(',.0f');
    let bigIntFormat = d3Format.format(',.2s');
    let cpaFormat = d3Format.format(',.1f');
    let rateFormat = R.pipe(d3Format.format(',.1f'), x => `${x}×`);

    let metricToLabel = metric => ({
        'views': 'Views',
        'sales': 'Sales',
        'active24': 'Active 24',
        'cr': 'CR',
        'cq': 'CQ',
        'resubs': 'Re-Subs',
        'releads': 'Re-Leads',
        'pixels_ratio': 'Pixels',
        'ecpa': 'eCPA',
        'total_optouts': 'Unsubs'
    })[metric] || metric;

    let column = makeColumn(metricToLabel);

    let {dateFrom, dateTo} = params;

    let isHourly = params.frequency == 'hourly';

    let {makeUrl, makeCountrySummaryUrl, makeAffiliateSummaryUrl} = newMakeUrl({dateFrom, dateTo});

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

    let topAffiliatesTable = (r) => {
        return <TABLE>
            <colgroup>
                <col span="1" style={{width: '5%'}}/>
                <col span="1" style={{width: '10%'}}/>
            </colgroup>
            {
                columns.map(c => !!c.colgroup ? c.colgroup() : [])
            }
            <THEAD style={{backgroundColor: '#7f7f7f'}}>{[<th style={{paddingLeft: '0.3em'}} colSpan="2"><A
                style={{color: 'white'}} href={makeCountrySummaryUrl(r.page)}>{r.page}</A></th>]
                .concat(columns.map(c => c.th()))}</THEAD>
            <tbody>
            {r.sections.map(s =>
                <tr style={{borderBottom: 'solid 1px silver'}}>
                    <td style={{paddingLeft: '0.3em'}}><A href={makeAffiliateSummaryUrl(r.page, s.section)}>{r.page}</A>
                    </td>
                    <td><A href={makeAffiliateSummaryUrl(r.page, s.section)}>{affiliatesMap[s.section] || 'Unknown'}</A>
                    </td>
                    {
                        columns.map(c => c.td(s))
                    }
                </tr>
            )}
            </tbody>
            <tfoot>
            <tr style={{borderBottom: 'solid 2px silver', fontWeight: 'bold', height: '5ex'}}>
                <td colSpan="2" style={{paddingLeft: '0.3em'}}><A href={makeCountrySummaryUrl(r.page)}>{r.page}</A></td>
                {
                    columns.map(c => c.td(r))
                }
            </tr>
            </tfoot>
        </TABLE>;
    };

    // Top Changed Affiliates
    let pagesColumns = (isHourly ? [column('views', positiveColorScale, bigIntFormat)] : [])
        .concat([
            column('sales', positiveColorScale, intFormat)
            , column('cr', positiveColorScale, crFormat)
            , column('cq', positiveColorScale, cqFormat)
            , column('resubs', negativeColorScale, rateFormat)
            , column('releads', negativeColorScale, rateFormat)
            , column('active24', positiveColorScale, cqFormat)
            , column('pixels_ratio', neutralColorScale, cqFormat)
        ])
        .concat(!isHourly ? [column('ecpa', negativeColorScale, cpaFormat)] : []);

    let topChangedCountriesColumns = [column('views', positiveColorScale, bigIntFormat)]
        .concat(pagesColumns)
        .concat([column('total_optouts', negativeColorScale, intFormat)]);

    let topChangedCountries =
        <TABLE>
            <colgroup>
                <col span="1" style={{width: '5%'}}/>
            </colgroup>
            {topChangedCountriesColumns.map(c => !!c.colgroup ? c.colgroup() : [])}
            <THEAD style={{backgroundColor: '#1f77b4'}}>
            {[<th></th>].concat(topChangedCountriesColumns.map(c => c.th()))}
            </THEAD>
            <tbody>
            {results.map(s =>
                <tr style={{borderBottom: 'solid 1px silver'}}>
                    <td style={{paddingLeft: '0.3em'}}>
                        <A href={makeCountrySummaryUrl(s.page)}>
                            {s.page}
                        </A>
                    </td>
                    {topChangedCountriesColumns.map(c => c.td(s))}
                </tr>
            )}
            </tbody>
        </TABLE>;

    let topAffiliates = () => {
        return results.map((r, i) =>
            <div style={{marginTop: `${i > 0 ? 1 : 0}em`}}>
                {topAffiliatesTable(r)}
            </div>);
    };

    let topChangedAffiliates = () => {
        return <TABLE>
            <colgroup>
                <col span="1" style={{width: '5%'}}/>
                <col span="1" style={{width: '10%'}}/>
            </colgroup>
            {pagesColumns.map(c => !!c.colgroup ? c.colgroup() : [])}
            <THEAD style={{backgroundColor: '#8c564b'}}>{[<th></th>,
                <th>Affiliate</th>].concat(pagesColumns.map(c => c.th()))}</THEAD>
            <tbody>
            {R.pipe(
                R.chain(p => p.sections.map(s => R.merge(s, {page: p.page}))),
                R.reduce(({list, page}, a) => ({
                    list: list.concat([R.merge(a, {isNew: a.page != page})]),
                    page: a.page
                }), {list: [], page: null}),
                R.prop('list')
            )(results).map(s =>
                <tr style={R.merge({borderBottom: 'solid 1px silver'}, s.isNew ? {borderTop: 'solid 2px #7f7f7f'} : {})}>
                    <td style={{paddingLeft: '0.3em'}}>
                        <A target="_blank" href={makeCountrySummaryUrl(s.page)}>{s.page}</A>
                    </td>
                    <td style={{paddingLeft: '0.3em'}}>
                        <A target="_blank" href={makeAffiliateSummaryUrl(s.page, s.section)} title={s.section}>
                            {affiliatesMap[s.section] || s.section}
                        </A>
                    </td>
                    {pagesColumns.map(c => c.td(s, {ignoreBgColor: !['sales', 'pixels_ratio', 'releads'].some(v => v == c.value)}))}
                </tr>
            )}
            </tbody>
        </TABLE>;
    };

    let MakeChange = (title, component) => {
        return <div>
            <h3>{title}</h3>
            <div>{component}</div>
        </div>;
    };

    return {
        changedCountries: MakeChange('Top Changed Countries', topChangedCountries),
        changedAffiliates: '',
        topAffiliates: '',
        // changedAffiliates: MakeChange('Top Changed Affiliates', topChangedAffiliates()),
        // topAffiliates: MakeChange('Top Affiliates', topAffiliates())
    };
}
