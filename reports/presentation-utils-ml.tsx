import * as React from "react";
import d3Format = require('d3-format');

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
        {R.pipe(R.chain(c => c.cols), R.addIndex(R.map)((c, i) => <col span="1" style={c.style}/>))(cols)}
    </colgroup>
});

const setTitle = (metric) => s => {
    if (
        s.metrics != undefined &&
        s.metrics[metric] != undefined &&
        s.metrics[metric].stdChange != undefined &&
        s.metrics[metric].change != undefined
    ) {
        let stdChange = s.metrics[metric].stdChange;
        let change = s.metrics[metric].change;
        return `
Change: ${d3Format.format('0.1f')(stdChange)} σ
Change: ${d3Format.format('0.0f')(change)}`
    }
    return '-';
};

export const makeColumn = metricToLabel => (metric, scale, format) => {
    return newColumn(
        metric,
        [
            {
                label: metricToLabel(metric),
                cols: [
                    {
                        style: {width: '10%'},
                        title: setTitle(metric),
                        content: (s, options) => ChangeSymbol(scale)(
                            s.metrics.hasOwnProperty(metric) ? s.metrics[metric].stdChange : '',
                            s.metrics.hasOwnProperty(metric) ? s.metrics[metric].change : '',
                            s.metrics.hasOwnProperty(metric) ? format(s.metrics[metric].actual) : '',
                            options
                        )
                    }
                ]
            }
        ]
    );
};

export const newMakeUrl = ({dateFrom, dateTo}) => {
    /* TODO: links here should follow this format to allow authentication:
     http://sigma.sam-media.com/daily_reports_archive/${yesterday}/?username=${username}&exp_ts=${tomorrow}&hash=${signature(username,tomorrow)(process.env.secret)}

     the signature function can be imported from ./hash.ts
     username can be passed as props (best case scenario)
    */
    const makeUrl = (filter, breakdown) => `http://sigma.sam-media.com/filter_page_section_row/${dateFrom}/${dateTo}/${filter}/${breakdown}/`
    return {
        makeUrl,
        makeCountrySummaryUrl: (country_code) => makeUrl(`country_code=${country_code}`, `-/-/day`),
        makeAffiliateSummaryUrl: (country_code, affiliate_id) => makeUrl(`country_code=${country_code},affiliate_id=${affiliate_id}`, `-/-/day`),
        makeHandleSummaryUrl: (country_code, handle_name) => makeUrl(`country_code=${country_code},handle_name=${handle_name}`, `-/-/day`)
    }
};

export const {ChangeSymbol, positiveColorScale, negativeColorScale, neutralColorScale} = (function () {
    let colorScale = (domain, colors) => v => v == 0 ? 'white' : d3Scale.scaleQuantize().domain(domain).range(colors)(Math.abs(v));

    let greens = colorScale([1, 5], ['#CBE7C1', '#BBDFB3', '#A5D19C', '#77BD65', '#54AE3D']);
    let reds = colorScale([1, 5], ['#F7BBBB', '#F7A5A9', '#F4777D', '#EE4B4C', '#E22124']);
    let positiveColorScale = v => v < 0 ? reds(v) : greens(v);
    let negativeColorScale = v => v < 0 ? greens(v) : reds(v);
    let neutralColorScale = colorScale(R.range(2, 7), ['#FAD1BD', '#FFCAAF', '#FAA27C', '#EF8656', '#FB6123']);

    let ChangeSymbolSpan = ({style, children}) => {
        let styles = R.merge({
            display: 'inline-block'
            , overflow: 'hidden'
            , minWidth: '4em'
            , maxWidth: '100%'
            , float: 'left'
            , padding: '0.15em 0em'
        }, style);
        return <span style={styles}>&nbsp;{children}&nbsp;</span>;
    };

    let ChangeSymbol = (scale) => {
        return (stdChange?, change?, content?, options = {ignoreBgColor: false}) => {
            let bgColor = options.ignoreBgColor ? '' : scale(stdChange);
            let textColor = 'black';
            if (bgColor == '#54AE3D' || bgColor == '#77BD65' || bgColor == '#E22124' || bgColor == '#EE4B4C') {
                textColor = 'white';
            }

            return Math.abs(stdChange) < 1 || Math.abs(change) < 0.075 ?
                <ChangeSymbolSpan>{content}</ChangeSymbolSpan> :
                <ChangeSymbolSpan style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    borderRadius: '0.5em'
                }}>{content}</ChangeSymbolSpan>
        };
    };
    return {ChangeSymbol, positiveColorScale, negativeColorScale, neutralColorScale}
})();
