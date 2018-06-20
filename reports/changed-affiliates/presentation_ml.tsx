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
    console.log('presenting countries & affiliates ...');
    console.log(JSON.stringify(results));
    let cqFormat = d3Format.format('0.0%');
    let crFormat = d3Format.format('0.1%');
    let intFormat = d3Format.format(',.0f');
    let bigIntFormat = d3Format.format(',.2s');
    let cpaFormat = d3Format.format(',.1f');
    let rateFormat = R.pipe(d3Format.format(',.1f'), x => `${x}×`);

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

    let {dateFrom, dateTo} = params;

    let isHourly = params.frequency == 'hourly';

    let {makeUrl, makeCountrySummaryUrl, makeAffiliateSummaryUrl} = newMakeUrl({dateFrom, dateTo});

    let topChangedAffiliatesColumn = [
        column('sales', positiveColorScale, intFormat),
        column('cr', positiveColorScale, crFormat),
        column('cq', positiveColorScale, cqFormat),
        column('resubs', negativeColorScale, rateFormat),
        column('releads', negativeColorScale, rateFormat),
        column('active24', positiveColorScale, cqFormat),
        column('pixels_ratio', neutralColorScale, cqFormat)
    ];
    if (isHourly) {
        topChangedAffiliatesColumn = [column('views', positiveColorScale, bigIntFormat)].concat(topChangedAffiliatesColumn);
    } else {
        topChangedAffiliatesColumn = topChangedAffiliatesColumn.concat([column('ecpa', negativeColorScale, cpaFormat)]);
    }
    let countriesColumns = [column('views', positiveColorScale, bigIntFormat)]
        .concat(topChangedAffiliatesColumn)
        .concat([column('total_optouts', negativeColorScale, intFormat)]);
    let countryMetrics = R.map(c => c.value)(countriesColumns);

    const filterCountriesWithoutAnomalies = (d) => {
        return R.pipe(
            R.toPairs,
            R.find(([m, v]) => {
                return countryMetrics.includes(m) && Object.keys(v).length > 1
            })
        )(d.metrics)
    };

    const anomalousCountriesHtml = (countriesAnomalies) => {
        return <TABLE>
            <THEAD style={{backgroundColor: '#1f77b4'}}>
            {[<th></th>].concat(countriesColumns.map(c => c.th()))}
            </THEAD>
            <tbody>
            {
                countriesAnomalies.filter(filterCountriesWithoutAnomalies).length !== 0 ?
                    countriesAnomalies.filter(filterCountriesWithoutAnomalies).map(s =>
                        <tr style={{borderBottom: 'solid 1px silver'}}>
                            <td style={{paddingLeft: '0.3em'}}>
                                <A href={makeCountrySummaryUrl(s.country)}>{s.country}</A>
                            </td>
                            {countriesColumns.map(c => c.td(s))}
                        </tr>
                    ) :
                    <tr>
                        <td colspan={countriesColumns.length}>-</td>
                    </tr>
            }
            </tbody>
        </TABLE>;
    };

    const anomalousAffiliatesHtml = (anomalousCountries, affiliateAnomalies) => {
        affiliateAnomalies = R.filter(d => d.country.indexOf(anomalousCountries))(affiliateAnomalies);

        return <TABLE>
            <colgroup>
                <col span="1" style={{width: '5%'}}/>
                <col span="1" style={{width: '10%'}}/>
            </colgroup>
            {
                topChangedAffiliatesColumn.map(c => !!c.colgroup ? c.colgroup() : [])
            }
            <THEAD style={{backgroundColor: '#8c564b'}}>
            {
                [<th></th>,
                    <th>Affiliate</th>].concat(topChangedAffiliatesColumn.map(c => c.th()))
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
                )(affiliateAnomalies).map(s =>
                    <tr style={R.merge({borderBottom: 'solid 1px silver'}, s.isNew ? {borderTop: 'solid 2px #7f7f7f'} : {})}>
                        <td style={{paddingLeft: '0.3em'}}>
                            <A target="_blank" href={makeCountrySummaryUrl(s.country)}>{s.country}</A>
                        </td>
                        <td style={{paddingLeft: '0.3em'}}>
                            <A target="_blank" href={makeAffiliateSummaryUrl(s.country, s.section)}
                               title={s.section}>{affiliatesMap[s.section] || s.section}
                            </A>
                        </td>
                        {
                            topChangedAffiliatesColumn.map(c => {
                                return c.td(s, {ignoreBgColor: !['sales', 'pixels_ratio', 'releads'].some(v => v == c.value)});
                            })
                        }
                    </tr>
                )
            }
            </tbody>
        </TABLE>;
    };

    const MakeChange = (title, component) => <div>
        <h3>{title}</h3>
        <div>{component}</div>
    </div>;

    return {
        changedCountries: MakeChange(
            'Anomalies in Countries',
            anomalousCountriesHtml(results.countriesAnomalies)
        ),
        changedAffiliates: MakeChange(
            'Anomalies in Affiliates',
            anomalousAffiliatesHtml(
                R.map(d => d.country)(results.countriesAnomalies.filter(filterCountriesWithoutAnomalies)),
                results.affiliateAnomalies
            )
        ),
    }
}
