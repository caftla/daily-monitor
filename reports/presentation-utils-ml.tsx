import * as React from 'react';

const d3Scale = require('d3-scale');
const R = require('ramda');

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
    th: () => cols.map(c => <th colSpan={c.cols.length}>{c.label}</th>),
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
σ: ${format(metric_params.change)}`;
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
                        s.metrics[metric] ? format(s.metrics[metric].actual) : 0,
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
    const makeUrl = (filter, breakdown) => `http://sigma.sam-media.com/filter_page_section_row/${dateFrom}/${dateTo}/${filter}/${breakdown}/`;
    return {
        makeUrl,
        makeCountrySummaryUrl: (country_code) => makeUrl(`country_code=${country_code}`, `-/-/day`),
        makeAffiliateSummaryUrl: (country_code, affiliate_id) => makeUrl(`country_code=${country_code},affiliate_id=${affiliate_id}`, `-/-/day`),
        makeHandleSummaryUrl: (country_code, handle_name) => makeUrl(`country_code=${country_code},handle_name=${handle_name}`, `-/-/day`)
    }
};

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

    const ChangeSymbol = (params, content, options = {ignoreBgColor: false}) => {
        let bgColor = '';
        if (!options.ignoreBgColor && params && params.severity != undefined) {
            bgColor = ColorLuminance(params.severity);
        }
        let textColor = 'black';
        if (bgColor == '#54AE3D' || bgColor == '#77BD65' || bgColor == '#E22124' || bgColor == '#EE4B4C') {
            textColor = 'white';
        }

        if (params && params.change && Math.abs(params.change) < 0.075) {
            return <ChangeSymbolSpan>{content}</ChangeSymbolSpan>;
        } else {
            return <ChangeSymbolSpan style={{
                backgroundColor: bgColor,
                color: textColor,
                borderRadius: '0.5em'
            }}>{content}</ChangeSymbolSpan>;
        }
    };

    return {ChangeSymbol, positiveColorScale, negativeColorScale, neutralColorScale}
})();
