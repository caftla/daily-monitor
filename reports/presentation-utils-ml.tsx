import * as React from 'react';

const d3Scale = require('d3-scale');
const R = require('ramda');
import d3Format = require('d3-format')

export const A = ({href, children, style}) => <a style={R.merge({color: 'black'}, style)} href={href}>{children}</a>;

export const TABLE = ({children}) => <table width="100%" style={{
    backgroundColor: 'white',
    tableLayout: 'fixed',
    minWidth: '1000px',
    maxWidth: '1200px',
    borderCollapse: 'collapse'
}}>
    {children}
</table>;

export const THEAD = ({children, style}) => <thead>
<tr style={R.merge({color: '#eee', textAlign: 'left', backgroundColor: 'black', height: '4ex'}, style)}>
    {children}
</tr>
</thead>;

export const newColumn = (value, cols) => ({
    value,
    td: (s, options?) => R.pipe(
        R.chain(c => c.cols),
        R.map(c => <td style={{height: '4ex'}} title={c.title(s)}>{c.content(s, options)}</td>)
    )(cols),
    th: () => cols.map(c => <th>{c.label}</th>),
    colgroup: () => <colgroup>
        {
            R.pipe(
                R.chain(c => c.cols),
                R.addIndex(R.map)((c, i) => <col span="1" style={c.style}/>)
            )(cols)
        }
    </colgroup>
});

function ColorLuminance(lum) {
    let hex = '11FF11';
    if (lum < 0) {
        hex = 'FF1111';
    }
    lum = Math.abs(lum);
    let rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}

let title = (metric, format) => s => {
    let metric_params = s.metrics[metric];
    if (metric_params && metric_params.prediction && metric_params.change)
        return `
Prediction: ${format(metric_params.prediction)}
Change: ${d3Format.format('0.1f')(metric_params.std_change)} σ
Change: ${d3Format.format('0.0%')(metric_params.change)}`;
};

export const makeColumn = metricToLabel => (metric, scale, format) => newColumn(
    metric,
    [
        {
            label: metricToLabel(metric), cols: [
                {
                    style: {width: '10%'},
                    title: title(metric, format),
                    content: (s, options) => ChangeSymbol(
                        s.metrics[metric],
                        format(s.metrics[metric].actual),
                        scale,
                        options
                    )
                }
            ]
        }
    ]
);

export const newMakeUrl = ({dateFrom, dateTo}) => {
    /* TODO: links here should follow this format to allow authentication:
     http://sigma.sam-media.com/daily_reports_archive/${yesterday}/?username=${username}&exp_ts=${tomorrow}&hash=${signature(username,tomorrow)(process.env.secret)}

     the signature function can be imported from ./hash.ts
     username can be passed as props (best case scenario)
    */
  const makeUrl = (filter, breakdown) => `http://sigma.sam-media.com/user_sessions/+0.0/${dateFrom}/${dateTo}/${filter}/${breakdown}/`;
    return {
        makeUrl,
        makeCountrySummaryUrl: (country_code) => makeUrl(`country_code=${country_code}`, `-/-/day`),
        makeAffiliateSummaryUrl: (country_code, affiliate_id) => makeUrl(`country_code=${country_code},affiliate_id=${affiliate_id}`, `-/-/day`),
        makeHandleSummaryUrl: (country_code, handle_name) => makeUrl(`country_code=${country_code},handle_name=${handle_name}`, `-/-/day`)
    }
};

const getSevirityLevel = (function () {
    const t = y => Math.log(y + 1) / Math.log(2);

    const levelf = (a, b) => (s, r) => Math.pow((s - 1) / (a - 1), 2) + Math.pow(t(r / b), 2) > 1;

    const as = [0, 2.3, 3, 4, 5, 6];
    const bs = [0, 2.8, 3.2, 4.0, 5.0, 6.0];
    const severity = [1, 2, 3, 4, 5, 6];

    const levels = R.pipe(R.map(([a, b, severity]) => ({
        severity,
        f: levelf(a, b)
    })), R.reverse)(R.zipWith((xs, x) => xs.concat([x]), R.zip(as, bs), severity));

    return (s, r) =>
        Math.abs(s) <= 1 ? 0 : levels.find(lev => lev.f(Math.abs(s), r == -1 ? 1000 : r < 0 ? 1 / (1 - Math.abs(r)) : r)).severity
})();

export const {ChangeSymbol, positiveColorScale, negativeColorScale, neutralColorScale} = (function () {
    const colorScale = (domain, colors) => v => v == 0 ? 'white' : d3Scale.scaleQuantize().domain(domain).range(colors)(Math.abs(v));

    const greens = colorScale([1, 5], ['#CBE7C1', '#BBDFB3', '#A5D19C', '#77BD65', '#54AE3D']);
    const reds = colorScale([1, 5], ['#F7BBBB', '#F7A5A9', '#F4777D', '#EE4B4C', '#E22124']);
    const positiveColorScale = v => v < 0 ? reds(v) : greens(v);
    const negativeColorScale = v => v < 0 ? greens(v) : reds(v);
    const neutralColorScale = colorScale(R.range(2, 7), ['#FAD1BD', '#FFCAAF', '#FAA27C', '#EF8656', '#FB6123']);

    const ChangeSymbolSpan = ({style, children}) => <span style={R.merge({
        display: 'inline-block',
        overflow: 'hidden',
        minWidth: '4em',
        maxWidth: '100%',
        float: 'left',
        padding: '0.15em 0em'
    }, style)}>&nbsp;{children}&nbsp;</span>;

    const ChangeSymbol = (params, content, scale, options = {ignoreBgColor: false}) => {
        let bgColor = '';
        if (!options.ignoreBgColor && params && params.change != undefined && params.std_change != undefined) {
            let severity = getSevirityLevel(params.std_change, params.change);
            bgColor = scale(severity * (params.std_change > 0 ? 1 : -1));
        }
        let textColor = 'black';
        if (bgColor == '#54AE3D' || bgColor == '#77BD65' || bgColor == '#E22124' || bgColor == '#EE4B4C') {
            textColor = 'white';
        }

        if (params.image_path) {
            let base_url = 'http://localhost:63342/';
            let image_path = params.image_path.replace(params.image_path.substring(0, params.image_path.lastIndexOf('/images/')), 'monitoring');
            return <ChangeSymbolSpan style={{
                backgroundColor: bgColor,
                color: textColor,
                borderRadius: '0.5em'
            }}>
                <a href={base_url + image_path}
                   target="_blank">
                    {content}
                </a>
            </ChangeSymbolSpan>;
        } else {
            return <ChangeSymbolSpan style={{
                backgroundColor: bgColor,
                color: textColor,
                borderRadius: '0.5em'
            }}>
                {content}
            </ChangeSymbolSpan>;
        }
    };

    return {ChangeSymbol, positiveColorScale, negativeColorScale, neutralColorScale}
})();
