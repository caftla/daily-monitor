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
    const cqFormat = d3Format.format('0.0%');
    const crFormat = d3Format.format('0.1%');
    const intFormat = d3Format.format(',.0f');
    const bigIntFormat = d3Format.format(',.2s');
    const cpaFormat = d3Format.format(',.1f');
    const rateFormat = R.pipe(d3Format.format(',.1f'), x => `${x}×`);

    const metricsLabels = metric => ({
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

    const column = makeColumn(metricsLabels);

    const {dateFrom, dateTo} = params;

    const isHourly = params.frequency == 'hourly';

    const {makeUrl, makeCountrySummaryUrl, makeAffiliateSummaryUrl} = newMakeUrl({dateFrom, dateTo});

    const pagesPred = p =>
        (p.metrics.sales.actual > 0 || p.metrics.sales.sum > 14);

    const selectTopChangedCountries = p => {
        return (pagesPred(p) &&
                ((Math.abs(p.metrics.sales.stdChange) > 2.3 && (p.metrics.cost.actual > 400 || p.metrics.sales.actual > 500))
                    || (p.metrics.sales.change < -0.5)
                )
            ) ||
            (
                (p.metrics.total_optouts.change > 0.5 || p.metrics.total_optouts.stdChange > 3) &&
                (
                    p.metrics.total_optouts.actual > 10 &&
                    p.metrics.total_optouts.actual > 500
                )
            )
            || (Math.abs(p.metrics.resubs.stdChange) > 2.3 && p.metrics.resubs.actual > 1.5 && p.metrics.sales.actual > 20)
            || (Math.abs(p.metrics.releads.stdChange) > 2.3 && p.metrics.releads.actual > 2 && p.metrics.leads.actual > 20);
    };

    const selectTopChangedAffiliatesAndTopAffiliates = s => {
        return (
                (s.share_of_sales_today > 0.05 || s.share_of_sales_base > 0.1) &&
                (s.metrics.sales.actual > 5) &&
                (
                    (Math.abs(s.metrics.sales.stdChange) > 2.3 && (s.metrics.sales.actual > 10)) ||
                    (Math.abs(s.metrics.cq.stdChange) > 3 && s.metrics.sales.actual > 10) ||
                    (Math.abs(s.metrics.cr.stdChange) > 3 && (s.metrics.views.actual > 1000 || s.metrics.sales.actual > 20))
                )
            ) ||
            (Math.abs(s.metrics.resubs.stdChange) > 2.2 && s.metrics.resubs.actual > 1.5 && s.metrics.sales.actual > 20) ||
            (Math.abs(s.metrics.releads.stdChange) > 2.2 && s.metrics.releads.actual > 2 && s.metrics.leads.actual > 20);
    };

    const selectTopAffiliates = s => {
        return (s.share_of_sales_today > 0.05 || s.share_of_sales_base > 0.1) ||
            (Math.abs(s.metrics.resubs.stdChange) > 2.3 && s.metrics.resubs.actual > 1.5 && s.metrics.sales.actual > 20) ||
            (Math.abs(s.metrics.releads.stdChange) > 2.3 && s.metrics.releads.actual > 2 && s.metrics.leads.actual > 20);
    };

    let columns = [
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

    const Page = (r) =>
        <TABLE>
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
            {r.sections.filter(selectTopAffiliates).map(s =>
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

    let topChangedAffiliatesColumn = (isHourly ? [column('views', positiveColorScale, bigIntFormat)] : []).concat([
        column('sales', positiveColorScale, intFormat),
        column('cr', positiveColorScale, crFormat),
        column('cq', positiveColorScale, cqFormat),
        column('resubs', negativeColorScale, rateFormat),
        column('releads', negativeColorScale, rateFormat),
        column('active24', positiveColorScale, cqFormat),
        column('pixels_ratio', neutralColorScale, cqFormat)
    ]).concat(!isHourly ? [column('ecpa', negativeColorScale, cpaFormat)] : []);

    const topChangedCountriesColumn = [column('views', positiveColorScale, bigIntFormat)].concat(topChangedAffiliatesColumn).concat([
        column('total_optouts', negativeColorScale, intFormat)
    ]);

    const changedCountries =
        <TABLE>
            <colgroup>
                <col span="1" style={{width: '5%'}}/>
            </colgroup>
            {
                topChangedCountriesColumn.map(c => !!c.colgroup ? c.colgroup() : [])
            }
            <THEAD style={{backgroundColor: '#1f77b4'}}>{[
                <th></th>].concat(topChangedCountriesColumn.map(c => c.th()))}</THEAD>
            <tbody>
            {results.filter(selectTopChangedCountries).map(s =>
                <tr style={{borderBottom: 'solid 1px silver'}}>
                    <td style={{paddingLeft: '0.3em'}}><A href={makeCountrySummaryUrl(s.page)}>{s.page}</A></td>
                    {
                        topChangedCountriesColumn.map(c => c.td(s))
                    }
                </tr>
            )}
            </tbody>
        </TABLE>;

    let topAffiliates = () => results.filter(pagesPred).map((r, i) =>
        <div style={{marginTop: `${i > 0 ? 1 : 0}em`}}>
            {Page(r)}
        </div>);

    let topChangedAffiliates = () =>
        <TABLE>
            <colgroup>
                <col span="1" style={{width: '5%'}}/>
                <col span="1" style={{width: '10%'}}/>
            </colgroup>
            {
                topChangedAffiliatesColumn.map(c => !!c.colgroup ? c.colgroup() : [])
            }
            <THEAD style={{backgroundColor: '#8c564b'}}>{[<th></th>,
                <th>Affiliate</th>].concat(topChangedAffiliatesColumn.map(c => c.th()))}</THEAD>
            <tbody>
            {R.pipe(
                R.chain(p => p.sections.filter(selectTopChangedAffiliatesAndTopAffiliates).map(s => R.merge(s, {page: p.page})))
                , R.filter(pagesPred)
                , R.reduce(({list, page}, a) => ({
                    list: list.concat([R.merge(a, {isNew: a.page != page})]),
                    page: a.page
                }), {list: [], page: null})
                , R.prop('list')
            )(results).map(s =>
                <tr style={R.merge({borderBottom: 'solid 1px silver'}, s.isNew ? {borderTop: 'solid 2px #7f7f7f'} : {})}>
                    <td style={{paddingLeft: '0.3em'}}><A target="_blank"
                                                          href={makeCountrySummaryUrl(s.page)}>{s.page}</A></td>
                    <td style={{paddingLeft: '0.3em'}}><A target="_blank"
                                                          href={makeAffiliateSummaryUrl(s.page, s.section)}
                                                          title={s.section}>{affiliatesMap[s.section] || s.section}</A>
                    </td>
                    {
                        topChangedAffiliatesColumn.map(c => c.td(s, {ignoreBgColor: !['sales', 'pixels_ratio', 'releads'].some(v => v == c.value)}))
                    }
                </tr>
            )}
            </tbody>
        </TABLE>;

    const MakeChange = (title, component) => <div>
        <h3>{title}</h3>
        <div>{component}</div>
    </div>;

    return {
        changedCountries: MakeChange('Top Changed Countries', changedCountries),
        changedAffiliates: '',
        topAffiliates: ''
        // changedAffiliates: MakeChange('Top Changed Affiliates', topChangedAffiliates()),
        // topAffiliates: MakeChange('Top Affiliates', topAffiliates())
    }
}
