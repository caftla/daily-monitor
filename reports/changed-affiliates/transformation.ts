const R = require('ramda');
const detectAnomalies = require('../anomaly-detection/index');
const Bluebird = require('bluebird');
const os = require('os');

export default async function (data) {
    let trace = (x, y) => {
        console.log(x);
        return y
    };
    let trace_ = x => trace(x, x);
    let log_free_memory = () => console.log((os.freemem() / Math.pow(10, 9)).toFixed(2) + ' GB is free');

    // let data = _data.filter(d => d.page == 'ZA' || d.page == 'AE' || d.page == 'QA');

    let summableProps = ['views', 'leads', 'sales', 'uniquesales', 'uniqueleads', 'pixels', 'paid_sales', 'firstbillings', 'uniquesales', 'optout_24', 'total_optouts', 'cost'];
    let props = summableProps.concat(['cr', 'cq', 'resubs', 'releads', 'pixels_ratio', 'ecpa', 'active24']);

    let safediv = (a, b) => b == 0 ? (a == 0 ? 0 : 1) : a / b;
    let ratios = d => ({
        cr: safediv(d.sales, d.views),
        cq: safediv(d.firstbillings, d.sales),
        resubs: safediv(d.sales, d.uniquesales),
        releads: safediv(d.leads, d.uniqueleads),
        pixels_ratio: safediv(d.pixels, d.sales),
        ecpa: safediv(d.cost, d.sales),
        active24: safediv(d.sales - d.optout_24, d.sales)
    });

    let aggregatedDataPerCountry = R.pipe(
        R.groupBy(d => d.page),
        R.map(R.groupBy(d => d.row)),
        R.toPairs,
        R.map(([country, dailyStats]) => [country, R.pipe(
            R.toPairs,
            R.map(([day, stats]) => {
                let output = {
                    row: day,
                    page: country,
                };
                summableProps.forEach(function (sp) {
                    output[sp] = R.sum(R.map(s => s[sp])(stats))
                });
                Object.assign(output, ratios(output));
                return output
            }),
        )(dailyStats)]),
        R.filter(([country, stats]) => country != 'null'),
        R.fromPairs,
    )(data);

    let todayDataPerCountry = R.pipe(
        R.toPairs,
        R.map(([country, stats]) => [
            country,
            R.filter(d => d.row.split('T')[0] == new Date().toISOString().split('T')[0])(stats)[0]
        ]),
        R.fromPairs
    )(aggregatedDataPerCountry);

    return [
        {
            "page": "AE",
            "metrics": {
                "resubs": {
                    "ds": "2018-04-10",
                    "yhat": 1.043511395,
                    "stdChange": -0.6946799961,
                    "yhat_upper": 1.0613260659,
                    "change": -0.0251386641,
                    "yhat_lower": 1.0251386641,
                    "actual": 1
                },
                "total_optouts": {
                    "ds": "2018-04-10",
                    "yhat": 538.5791320715,
                    "stdChange": -0.0432820312,
                    "yhat_upper": 721.9398591316,
                    "change": -16.2601796056,
                    "yhat_lower": 346.2601796056,
                    "actual": 330
                },
                "optout_24": {
                    "actual": 5
                },
                "ecpa": {
                    "actual": 2.272727272727273
                },
                "leads": {
                    "actual": 389
                },
                "active24": {
                    "ds": "2018-04-10",
                    "yhat": 0.7908544723,
                    "stdChange": -2.0865091337,
                    "yhat_upper": 0.8375641262,
                    "change": -0.1974688173,
                    "yhat_lower": 0.7429233628,
                    "actual": 0.5454545454545454
                },
                "uniqueleads": {
                    "actual": 368
                },
                "pixels": {
                    "actual": 8
                },
                "cq": {
                    "ds": "2018-04-10",
                    "yhat": 0.3348105941,
                    "stdChange": -1.0387682725,
                    "yhat_upper": 0.4107175277,
                    "change": -0.1629448829,
                    "yhat_lower": 0.2538539738,
                    "actual": 0.09090909090909091
                },
                "paid_sales": {
                    "actual": 8
                },
                "cost": {
                    "actual": 25
                },
                "pixels_ratio": {
                    "ds": "2018-04-10",
                    "yhat": 0.4542226565,
                    "stdChange": 1.0580666956,
                    "yhat_upper": 0.5415805643,
                    "change": 0.185692163,
                    "yhat_lower": 0.3660791863,
                    "actual": 0.7272727272727273
                },
                "firstbillings": {
                    "actual": 1
                },
                "sales": {
                    "actual": 11
                },
                "releads": {
                    "actual": 1.0570652173913044
                },
                "uniquesales": {
                    "actual": 11
                },
                "cr": {
                    "actual": 0.00046245690742453545
                },
                "views": {
                    "actual": 23786
                }
            },
            "sections": {}
        },
        {
            "page": "AU",
            "metrics": {
                "uniqueleads": {
                    "actual": 0
                },
                "leads": {
                    "actual": 0
                },
                "cost": {
                    "actual": 0
                },
                "ecpa": {
                    "actual": 0
                },
                "uniquesales": {
                    "actual": 0
                },
                "releads": {
                    "actual": 0
                },
                "views": {
                    "actual": 0
                },
                "resubs": {
                    "actual": 0
                },
                "paid_sales": {
                    "actual": 0
                },
                "active24": {
                    "actual": 0
                },
                "pixels_ratio": {
                    "actual": 0
                },
                "pixels": {
                    "actual": 0
                },
                "sales": {
                    "actual": 0
                },
                "total_optouts": {
                    "ds": "2018-04-10",
                    "yhat_upper": 9.5508578349,
                    "yhat_lower": -0.5460591204,
                    "actual": 10,
                    "stdChange": 0.0444830998,
                    "yhat": 4.5255887842,
                    "change": 0.4491421651
                },
                "cq": {
                    "actual": 0
                },
                "optout_24": {
                    "actual": 0
                },
                "cr": {
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                }
            },
            "sections": {}
        },
        {
            "page": "BH",
            "metrics": {
                "ecpa": {
                    "stdChange": -0.1233541753,
                    "yhat": 1.2200493858,
                    "actual": 0,
                    "yhat_upper": 2.2027124169,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.2418772098,
                    "change": -0.2418772098
                },
                "pixels_ratio": {
                    "stdChange": -0.3911427024,
                    "yhat": 0.4466425381,
                    "actual": 0,
                    "yhat_upper": 0.6892590529,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.1937965445,
                    "change": -0.1937965445
                },
                "optout_24": {
                    "actual": 0
                },
                "cr": {
                    "stdChange": -0.1505290174,
                    "yhat": 0.0001288083,
                    "actual": 0,
                    "yhat_upper": 0.0002303114,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.0000301327,
                    "change": -0.0000301327
                },
                "leads": {
                    "stdChange": -0.8213884215,
                    "yhat": 127.0259883985,
                    "actual": 12,
                    "yhat_upper": 172.2414115504,
                    "ds": "2018-04-10",
                    "yhat_lower": 84.2637953229,
                    "change": -72.2637953229
                },
                "uniquesales": {
                    "stdChange": -0.163728699,
                    "yhat": 10.0964572178,
                    "actual": 0,
                    "yhat_upper": 17.7350687009,
                    "ds": "2018-04-10",
                    "yhat_lower": 2.4952033302,
                    "change": -2.4952033302
                },
                "paid_sales": {
                    "stdChange": -0.0227233307,
                    "yhat": 4.7529260816,
                    "actual": 0,
                    "yhat_upper": 9.2352941998,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.2051939545,
                    "change": -0.2051939545
                },
                "resubs": {
                    "stdChange": -5.3027929401,
                    "yhat": 1.1179607351,
                    "actual": 0,
                    "yhat_upper": 1.2173118817,
                    "ds": "2018-04-10",
                    "yhat_lower": 1.0241733964,
                    "change": -1.0241733964
                },
                "sales": {
                    "stdChange": -0.111079668,
                    "yhat": 11.229402544,
                    "actual": 0,
                    "yhat_upper": 19.9918594857,
                    "ds": "2018-04-10",
                    "yhat_lower": 1.9986767626,
                    "change": -1.9986767626
                },
                "views": {
                    "stdChange": -0.8897774086,
                    "yhat": 92608.1134729705,
                    "actual": 43025,
                    "yhat_upper": 110407.1747031707,
                    "ds": "2018-04-10",
                    "yhat_lower": 74751.03107678,
                    "change": -31726.03107678
                },
                "cq": {
                    "stdChange": -0.2649960528,
                    "yhat": 0.2653547202,
                    "actual": 0,
                    "yhat_upper": 0.4245323724,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.0889326119,
                    "change": -0.0889326119
                },
                "active24": {
                    "stdChange": -4.9157568137,
                    "yhat": 1.0067166101,
                    "actual": 0,
                    "yhat_upper": 1.0993123224,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.9134844804,
                    "change": -0.9134844804
                },
                "uniqueleads": {
                    "stdChange": -1.4908383096,
                    "yhat": 58.5631428904,
                    "actual": 9,
                    "yhat_upper": 71.9586946841,
                    "ds": "2018-04-10",
                    "yhat_lower": 46.6825880649,
                    "change": -37.6825880649
                },
                "firstbillings": {
                    "stdChange": -0.1651470839,
                    "yhat": 2.7524048873,
                    "actual": 0,
                    "yhat_upper": 4.8256879697,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.6839894353,
                    "change": -0.6839894353
                },
                "pixels": {
                    "stdChange": -0.0654175119,
                    "yhat": 4.7529260816,
                    "actual": 0,
                    "yhat_upper": 9.0109115418,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.5532773828,
                    "change": -0.5532773828
                },
                "total_optouts": {
                    "actual": 19
                },
                "releads": {
                    "actual": 1.3333333333333333
                },
                "cost": {
                    "stdChange": -0.0287541422,
                    "yhat": 11.8849673426,
                    "actual": 0,
                    "yhat_upper": 23.4189244093,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.6545694993,
                    "change": -0.6545694993
                }
            },
            "sections": {}
        },
        {
            "page": "DE",
            "metrics": {
                "resubs": {
                    "actual": 0
                },
                "cost": {
                    "actual": 0
                },
                "pixels": {
                    "actual": 0
                },
                "releads": {
                    "actual": 0
                },
                "views": {
                    "yhat_upper": 1272.8586660199,
                    "stdChange": -0.5246257697,
                    "actual": 148,
                    "yhat_lower": 535.0653738042,
                    "change": -387.0653738042,
                    "ds": "2018-04-10",
                    "yhat": 914.6728921645
                },
                "uniquesales": {
                    "actual": 0
                },
                "sales": {
                    "actual": 0
                },
                "optout_24": {
                    "actual": 0
                },
                "total_optouts": {
                    "actual": 7
                },
                "paid_sales": {
                    "actual": 0
                },
                "ecpa": {
                    "actual": 0
                },
                "active24": {
                    "actual": 0
                },
                "cr": {
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                },
                "cq": {
                    "actual": 0
                },
                "leads": {
                    "actual": 0
                },
                "pixels_ratio": {
                    "actual": 0
                },
                "uniqueleads": {
                    "actual": 0
                }
            },
            "sections": {}
        },
        {
            "page": "EE",
            "metrics": {
                "cq": {
                    "actual": 0
                },
                "active24": {
                    "actual": 0
                },
                "paid_sales": {
                    "actual": 0
                },
                "resubs": {
                    "actual": 0
                },
                "sales": {
                    "actual": 0
                },
                "pixels": {
                    "actual": 0
                },
                "uniquesales": {
                    "actual": 0
                },
                "releads": {
                    "actual": 0
                },
                "optout_24": {
                    "actual": 0
                },
                "cost": {
                    "actual": 0
                },
                "cr": {
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                },
                "uniqueleads": {
                    "actual": 0
                },
                "views": {
                    "actual": 283
                },
                "pixels_ratio": {
                    "actual": 0
                },
                "leads": {
                    "actual": 0
                },
                "ecpa": {
                    "actual": 0
                },
                "total_optouts": {
                    "change": -2.9438516488,
                    "actual": 0,
                    "yhat_lower": 2.9438516488,
                    "ds": "2018-04-10",
                    "yhat": 5.8342822337,
                    "stdChange": -0.5015182541,
                    "yhat_upper": 8.813731009
                }
            },
            "sections": {}
        },
        {
            "page": "EG",
            "metrics": {
                "total_optouts": {
                    "actual": null
                },
                "uniquesales": {
                    "actual": null
                },
                "releads": {
                    "actual": null
                },
                "active24": {
                    "actual": null
                },
                "pixels": {
                    "actual": null
                },
                "firstbillings": {
                    "actual": null
                },
                "views": {
                    "actual": null
                },
                "resubs": {
                    "actual": null
                },
                "optout_24": {
                    "actual": null
                },
                "pixels_ratio": {
                    "actual": null
                },
                "cr": {
                    "actual": null
                },
                "cq": {
                    "actual": null
                },
                "cost": {
                    "actual": null
                },
                "sales": {
                    "actual": null
                },
                "uniqueleads": {
                    "actual": null
                },
                "paid_sales": {
                    "actual": null
                },
                "ecpa": {
                    "actual": null
                },
                "leads": {
                    "actual": null
                }
            },
            "sections": {}
        },
        {
            "page": "ES",
            "metrics": {
                "views": {
                    "change": -9747.8351947758,
                    "ds": "2018-04-10",
                    "yhat_upper": 14345.4938941029,
                    "yhat": 13048.1156141477,
                    "actual": 2111,
                    "yhat_lower": 11858.8351947758,
                    "stdChange": -3.920053523
                },
                "uniqueleads": {
                    "change": -1417.3190735948,
                    "ds": "2018-04-10",
                    "yhat_upper": 2373.5359067045,
                    "yhat": 2087.5458424938,
                    "actual": 382,
                    "yhat_lower": 1799.3190735948,
                    "stdChange": -2.4682645856
                },
                "pixels": {
                    "change": -72.5208304824,
                    "ds": "2018-04-10",
                    "yhat_upper": 125.7405479296,
                    "yhat": 106.4330323743,
                    "actual": 16,
                    "yhat_lower": 88.5208304824,
                    "stdChange": -1.9484519351
                },
                "total_optouts": {
                    "change": -48.0141864789,
                    "ds": "2018-04-10",
                    "yhat_upper": 224.8103856901,
                    "yhat": 141.7895084948,
                    "actual": 15,
                    "yhat_lower": 63.0141864789,
                    "stdChange": -0.2967571965
                },
                "ecpa": {
                    "actual": 1
                },
                "cq": {
                    "actual": 0.9404761904761905
                },
                "cost": {
                    "change": -535.1858874578,
                    "ds": "2018-04-10",
                    "yhat_upper": 880.7266101747,
                    "yhat": 745.0312266198,
                    "actual": 84,
                    "yhat_lower": 619.1858874578,
                    "stdChange": -2.04628129
                },
                "releads": {
                    "change": -0.3171513999,
                    "ds": "2018-04-10",
                    "yhat_upper": 3.4848599644,
                    "yhat": 3.2145221869,
                    "actual": 2.654450261780105,
                    "yhat_lower": 2.9716016617,
                    "stdChange": -0.6179177195
                },
                "sales": {
                    "change": -439.803537631,
                    "ds": "2018-04-10",
                    "yhat_upper": 789.472649205,
                    "yhat": 656.1452280795,
                    "actual": 84,
                    "yhat_lower": 523.803537631,
                    "stdChange": -1.6554560484
                },
                "active24": {
                    "actual": 0.9880952380952381
                },
                "resubs": {
                    "change": -0.0137524557,
                    "ds": "2018-04-10",
                    "yhat_upper": 1.104652438,
                    "yhat": 1.0615469052,
                    "actual": 1,
                    "yhat_lower": 1.0137524557,
                    "stdChange": -0.1512921708
                },
                "paid_sales": {
                    "change": -72.5463108421,
                    "ds": "2018-04-10",
                    "yhat_upper": 125.3079424323,
                    "yhat": 106.4330323743,
                    "actual": 16,
                    "yhat_lower": 88.5463108421,
                    "stdChange": -1.9734246742
                },
                "leads": {
                    "change": -5083.7131068254,
                    "ds": "2018-04-10",
                    "yhat_upper": 8181.2959800269,
                    "yhat": 7121.8872177903,
                    "actual": 1014,
                    "yhat_lower": 6097.7131068254,
                    "stdChange": -2.4398900434
                },
                "optout_24": {
                    "actual": 1
                },
                "uniquesales": {
                    "change": -442.6252852135,
                    "ds": "2018-04-10",
                    "yhat_upper": 744.2099860639,
                    "yhat": 638.7273005262,
                    "actual": 84,
                    "yhat_lower": 526.6252852135,
                    "stdChange": -2.0342665798
                },
                "cr": {
                    "change": -0.0045804668,
                    "ds": "2018-04-10",
                    "yhat_upper": 0.0604992571,
                    "yhat": 0.0526752624,
                    "actual": 0.03979156797726196,
                    "yhat_lower": 0.0443720348,
                    "stdChange": -0.2840208164
                },
                "pixels_ratio": {
                    "actual": 0.19047619047619047
                },
                "firstbillings": {
                    "change": -438.2806857858,
                    "ds": "2018-04-10",
                    "yhat_upper": 736.9983497166,
                    "yhat": 630.6152833563,
                    "actual": 79,
                    "yhat_lower": 517.2806857858,
                    "stdChange": -1.9947448828
                }
            },
            "sections": {}
        },
        {
            "page": "FR",
            "metrics": {
                "paid_sales": {
                    "actual": 0
                },
                "sales": {
                    "actual": 0
                },
                "views": {
                    "actual": 8
                },
                "pixels_ratio": {
                    "actual": 0
                },
                "leads": {
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                },
                "cost": {
                    "actual": 0
                },
                "resubs": {
                    "actual": 0
                },
                "pixels": {
                    "actual": 0
                },
                "uniquesales": {
                    "actual": 0
                },
                "releads": {
                    "actual": 0
                },
                "optout_24": {
                    "actual": 0
                },
                "active24": {
                    "actual": 0
                },
                "ecpa": {
                    "actual": 0
                },
                "uniqueleads": {
                    "actual": 0
                },
                "cr": {
                    "actual": 0
                },
                "total_optouts": {
                    "actual": 0
                },
                "cq": {
                    "actual": 0
                }
            },
            "sections": {}
        },
        {
            "page": "GH",
            "metrics": {
                "cq": {
                    "actual": 0.23125
                },
                "resubs": {
                    "yhat_lower": 1.1361972992,
                    "actual": 1.2030075187969924,
                    "stdChange": 0.5596192012,
                    "change": 0.023972699,
                    "yhat": 1.158089885,
                    "ds": "2018-04-10",
                    "yhat_upper": 1.1790348198
                },
                "views": {
                    "yhat_lower": 515788.3195869641,
                    "actual": 128214,
                    "stdChange": -2.9073597031,
                    "change": -387574.3195869641,
                    "yhat": 587241.3318384837,
                    "ds": "2018-04-10",
                    "yhat_upper": 649096.3238117157
                },
                "pixels": {
                    "yhat_lower": 418.3064766929,
                    "actual": 124,
                    "stdChange": -2.4646662742,
                    "change": -294.3064766929,
                    "yhat": 477.7536314976,
                    "ds": "2018-04-10",
                    "yhat_upper": 537.7167513306
                },
                "cr": {
                    "actual": 0.0024958272887516185
                },
                "sales": {
                    "yhat_lower": 1152.2864620368,
                    "actual": 320,
                    "stdChange": -2.6956480131,
                    "change": -832.2864620368,
                    "yhat": 1308.2511986136,
                    "ds": "2018-04-10",
                    "yhat_upper": 1461.0383680672
                },
                "leads": {
                    "yhat_lower": 4878.7223856346,
                    "actual": 1137,
                    "stdChange": -2.9383890692,
                    "change": -3741.7223856346,
                    "yhat": 5490.8205359193,
                    "ds": "2018-04-10",
                    "yhat_upper": 6152.114811713
                },
                "uniquesales": {
                    "yhat_lower": 986.269997564,
                    "actual": 266,
                    "stdChange": -2.5340332077,
                    "change": -720.269997564,
                    "yhat": 1129.6091906605,
                    "ds": "2018-04-10",
                    "yhat_upper": 1270.5085763492
                },
                "cost": {
                    "yhat_lower": 184.7308099341,
                    "actual": 35.65,
                    "stdChange": -2.5928303165,
                    "change": -149.0808099341,
                    "yhat": 213.585875944,
                    "ds": "2018-04-10",
                    "yhat_upper": 242.2281359199
                },
                "optout_24": {
                    "yhat_lower": 60.8731362987,
                    "actual": 13,
                    "stdChange": -1.9509097743,
                    "change": -47.8731362987,
                    "yhat": 72.6086857003,
                    "ds": "2018-04-10",
                    "yhat_upper": 85.4120139696
                },
                "ecpa": {
                    "yhat_lower": 0.1520783126,
                    "actual": 0.11140625,
                    "stdChange": -1.2325461602,
                    "change": -0.0406720626,
                    "yhat": 0.1686026741,
                    "ds": "2018-04-10",
                    "yhat_upper": 0.1850767219
                },
                "firstbillings": {
                    "yhat_lower": 279.5114021345,
                    "actual": 74,
                    "stdChange": -2.1319953907,
                    "change": -205.5114021345,
                    "yhat": 328.4932543732,
                    "ds": "2018-04-10",
                    "yhat_upper": 375.905326359
                },
                "releads": {
                    "actual": 1.03551912568306
                },
                "uniqueleads": {
                    "yhat_lower": 4682.1259765909,
                    "actual": 1098,
                    "stdChange": -3.0437087468,
                    "change": -3584.1259765909,
                    "yhat": 5262.6671316072,
                    "ds": "2018-04-10",
                    "yhat_upper": 5859.6781915959
                },
                "paid_sales": {
                    "yhat_lower": 416.3637885594,
                    "actual": 124,
                    "stdChange": -2.3384974139,
                    "change": -292.3637885594,
                    "yhat": 477.7536314976,
                    "ds": "2018-04-10",
                    "yhat_upper": 541.3858590666
                },
                "active24": {
                    "yhat_lower": 0.9272271418,
                    "actual": 0.959375,
                    "stdChange": 1.3680782566,
                    "change": 0.0185723532,
                    "yhat": 0.9340518719,
                    "ds": "2018-04-10",
                    "yhat_upper": 0.9408026468
                },
                "total_optouts": {
                    "yhat_lower": 285.0135808459,
                    "actual": 38,
                    "stdChange": -2.5011670654,
                    "change": -247.0135808459,
                    "yhat": 334.2747313378,
                    "ds": "2018-04-10",
                    "yhat_upper": 383.7729097452
                },
                "pixels_ratio": {
                    "actual": 0.3875
                }
            },
            "sections": {}
        },
        {
            "page": "GR",
            "metrics": {
                "resubs": {
                    "actual": 1,
                    "yhat": 1.0036657597,
                    "ds": "2018-04-10",
                    "yhat_upper": 1.0036657611,
                    "change": -0.0036657583,
                    "yhat_lower": 1.0036657583,
                    "stdChange": -1314987.5015564845
                },
                "pixels": {
                    "actual": 75,
                    "yhat": 514.52555521,
                    "ds": "2018-04-10",
                    "yhat_upper": 618.0176359126,
                    "change": -333.2660643009,
                    "yhat_lower": 408.2660643009,
                    "stdChange": -1.5888608688
                },
                "active24": {
                    "actual": 0.96,
                    "yhat": 0.9208473471,
                    "ds": "2018-04-10",
                    "yhat_upper": 0.9451563781,
                    "change": 0.0148436219,
                    "yhat_lower": 0.8983390949,
                    "stdChange": 0.3170543212
                },
                "optout_24": {
                    "actual": 3,
                    "yhat": 38.8220173778,
                    "ds": "2018-04-10",
                    "yhat_upper": 48.7917577869,
                    "change": -24.9659317476,
                    "yhat_lower": 27.9659317476,
                    "stdChange": -1.1987967104
                },
                "cq": {
                    "actual": 0.13333333333333333,
                    "yhat": 0.1899199481,
                    "ds": "2018-04-10",
                    "yhat_upper": 0.2259936722,
                    "change": -0.0187481108,
                    "yhat_lower": 0.1520814441,
                    "stdChange": -0.2536537089
                },
                "firstbillings": {
                    "actual": 10,
                    "yhat": 94.7234926772,
                    "ds": "2018-04-10",
                    "yhat_upper": 119.6346242292,
                    "change": -61.6405812314,
                    "yhat_lower": 71.6405812314,
                    "stdChange": -1.2843381674
                },
                "cr": {
                    "actual": 15
                },
                "uniqueleads": {
                    "actual": 119,
                    "yhat": 727.2564013046,
                    "ds": "2018-04-10",
                    "yhat_upper": 883.6045216651,
                    "change": -467.8231337662,
                    "yhat_lower": 586.8231337662,
                    "stdChange": -1.5763223465
                },
                "leads": {
                    "actual": 173,
                    "yhat": 1026.0505582737,
                    "ds": "2018-04-10",
                    "yhat_upper": 1236.7938779336,
                    "change": -649.2139204542,
                    "yhat_lower": 822.2139204542,
                    "stdChange": -1.5659558759
                },
                "ecpa": {
                    "actual": 0.35333333333333333,
                    "yhat": 1.5506386909,
                    "ds": "2018-04-10",
                    "yhat_upper": 1.5801001749,
                    "change": -1.1710807652,
                    "yhat_lower": 1.5244140986,
                    "stdChange": -21.0300463421
                },
                "releads": {
                    "actual": 1.453781512605042
                },
                "uniquesales": {
                    "actual": 75,
                    "yhat": 514.436091319,
                    "ds": "2018-04-10",
                    "yhat_upper": 611.295851513,
                    "change": -337.5781221124,
                    "yhat_lower": 412.5781221124,
                    "stdChange": -1.6987821023
                },
                "total_optouts": {
                    "actual": 28,
                    "yhat": 90.7580342163,
                    "ds": "2018-04-10",
                    "yhat_upper": 104.0166169753,
                    "change": -48.4839460275,
                    "yhat_lower": 76.4839460275,
                    "stdChange": -1.760960501
                },
                "views": {
                    "actual": 5
                },
                "sales": {
                    "actual": 75,
                    "yhat": 514.436091319,
                    "ds": "2018-04-10",
                    "yhat_upper": 616.060757906,
                    "change": -336.3710534928,
                    "yhat_lower": 411.3710534928,
                    "stdChange": -1.6433218
                },
                "paid_sales": {
                    "actual": 75,
                    "yhat": 514.52555521,
                    "ds": "2018-04-10",
                    "yhat_upper": 615.8332454741,
                    "change": -330.2491773629,
                    "yhat_lower": 405.2491773629,
                    "stdChange": -1.5682533837
                },
                "pixels_ratio": {
                    "actual": 1,
                    "yhat": 0.9956172675,
                    "ds": "2018-04-10",
                    "yhat_upper": 0.9978695484,
                    "change": 0.0021304516,
                    "yhat_lower": 0.9935336852,
                    "stdChange": 0.4913558157
                },
                "cost": {
                    "actual": 26.5,
                    "yhat": 797.1571899624,
                    "ds": "2018-04-10",
                    "yhat_upper": 984.394512863,
                    "change": -595.2850018595,
                    "yhat_lower": 621.7850018595,
                    "stdChange": -1.6416695751
                }
            },
            "sections": {}
        },
        {
            "page": "HK",
            "metrics": {
                "paid_sales": {
                    "actual": 0
                },
                "leads": {
                    "yhat_lower": 3.5789386221,
                    "change": -3.5789386221,
                    "stdChange": -0.1427878328,
                    "ds": "2018-04-10",
                    "yhat": 16.0580050554,
                    "yhat_upper": 28.64366965,
                    "actual": 0
                },
                "resubs": {
                    "yhat_lower": 1.0036657584,
                    "change": -1.0036657584,
                    "stdChange": -369878410.7736919,
                    "ds": "2018-04-10",
                    "yhat": 1.0036657597,
                    "yhat_upper": 1.0036657611,
                    "actual": 0
                },
                "uniqueleads": {
                    "yhat_lower": 3.7857954896,
                    "change": -3.7857954896,
                    "stdChange": -0.1626611762,
                    "ds": "2018-04-10",
                    "yhat": 16.0466507225,
                    "yhat_upper": 27.0599139922,
                    "actual": 0
                },
                "cr": {
                    "yhat_lower": 0.0001505502,
                    "change": -0.0001505502,
                    "stdChange": -0.0839724365,
                    "ds": "2018-04-10",
                    "yhat": 0.0010663081,
                    "yhat_upper": 0.0019434033,
                    "actual": 0
                },
                "cost": {
                    "actual": 0
                },
                "sales": {
                    "actual": 0
                },
                "pixels": {
                    "actual": 0
                },
                "releads": {
                    "yhat_lower": 0.9808878274,
                    "change": -0.9808878274,
                    "stdChange": -19.6937583022,
                    "ds": "2018-04-10",
                    "yhat": 1.0082996862,
                    "yhat_upper": 1.0306948684,
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                },
                "views": {
                    "yhat_lower": 2013.9851758362,
                    "change": -1863.9851758362,
                    "stdChange": -0.9182768798,
                    "ds": "2018-04-10",
                    "yhat": 3058.804268484,
                    "yhat_upper": 4043.8578828172,
                    "actual": 150
                },
                "optout_24": {
                    "yhat_lower": 0.3980060576,
                    "change": -0.3980060576,
                    "stdChange": -0.1557675188,
                    "ds": "2018-04-10",
                    "yhat": 1.7016000721,
                    "yhat_upper": 2.9531347565,
                    "actual": 0
                },
                "pixels_ratio": {
                    "yhat_lower": 1.0036657584,
                    "change": -1.0036657584,
                    "stdChange": -381719676.3284115,
                    "ds": "2018-04-10",
                    "yhat": 1.0036657597,
                    "yhat_upper": 1.003665761,
                    "actual": 0
                },
                "uniquesales": {
                    "actual": 0
                },
                "active24": {
                    "yhat_lower": 0.5624068933,
                    "change": -0.5624068933,
                    "stdChange": -2.1169541588,
                    "ds": "2018-04-10",
                    "yhat": 0.70234023,
                    "yhat_upper": 0.8280748536,
                    "actual": 0
                },
                "cq": {
                    "yhat_lower": 0.8657457476,
                    "change": -0.8657457476,
                    "stdChange": -3.0130491182,
                    "ds": "2018-04-10",
                    "yhat": 1.0050063386,
                    "yhat_upper": 1.1530778533,
                    "actual": 0
                },
                "ecpa": {
                    "yhat_lower": 7.836918828,
                    "change": -7.836918828,
                    "stdChange": -27.0694683992,
                    "ds": "2018-04-10",
                    "yhat": 7.9850711637,
                    "yhat_upper": 8.126430196,
                    "actual": 0
                },
                "total_optouts": {
                    "yhat_lower": -1.3535004873,
                    "change": 0.3176558104,
                    "stdChange": 0.1046350668,
                    "ds": "2018-04-10",
                    "yhat": 0.0928828503,
                    "yhat_upper": 1.6823441896,
                    "actual": 2
                }
            },
            "sections": {}
        },
        {
            "page": "ID",
            "metrics": {
                "pixels": {
                    "yhat_lower": 22.4767017046,
                    "stdChange": -0.5086290049,
                    "change": -13.4767017046,
                    "ds": "2018-04-10",
                    "yhat": 36.3660554864,
                    "actual": 9,
                    "yhat_upper": 48.972834593
                },
                "total_optouts": {
                    "yhat_lower": 1601.9439581745,
                    "stdChange": -0.481748246,
                    "change": -1329.9439581745,
                    "ds": "2018-04-10",
                    "yhat": 2998.0534037828,
                    "actual": 272,
                    "yhat_upper": 4362.6057130469
                },
                "cost": {
                    "yhat_lower": 4.5725070011,
                    "stdChange": -0.6606615916,
                    "change": -3.5725070011,
                    "ds": "2018-04-10",
                    "yhat": 7.2401580581,
                    "actual": 1,
                    "yhat_upper": 9.9799758872
                },
                "releads": {
                    "yhat_lower": 1.0036657584,
                    "stdChange": -1368064.6674996484,
                    "change": -0.0036657584,
                    "ds": "2018-04-10",
                    "yhat": 1.0036657597,
                    "actual": 1,
                    "yhat_upper": 1.0036657611
                },
                "cr": {
                    "actual": 0.00025222695381304095
                },
                "active24": {
                    "yhat_lower": 0.8496082809,
                    "stdChange": 0.4721211022,
                    "change": 0.0268512991,
                    "ds": "2018-04-10",
                    "yhat": 0.8797498204,
                    "actual": 0.9333333333333333,
                    "yhat_upper": 0.9064820342
                },
                "firstbillings": {
                    "yhat_lower": 17.1603994991,
                    "stdChange": -0.6607187736,
                    "change": -12.1603994991,
                    "ds": "2018-04-10",
                    "yhat": 26.156458477,
                    "actual": 5,
                    "yhat_upper": 35.5652034574
                },
                "views": {
                    "yhat_lower": 605532.1229828113,
                    "stdChange": -1.9904386408,
                    "change": -367651.1229828113,
                    "ds": "2018-04-10",
                    "yhat": 695783.8383459158,
                    "actual": 237881,
                    "yhat_upper": 790240.7170785648
                },
                "optout_24": {
                    "yhat_lower": 21.2437745372,
                    "stdChange": -0.9967522361,
                    "change": -17.2437745372,
                    "ds": "2018-04-10",
                    "yhat": 29.7861842545,
                    "actual": 4,
                    "yhat_upper": 38.5437352625
                },
                "leads": {
                    "yhat_lower": 171.5285374258,
                    "stdChange": -0.8450860301,
                    "change": -111.5285374258,
                    "ds": "2018-04-10",
                    "yhat": 235.3193005986,
                    "actual": 60,
                    "yhat_upper": 303.5015359841
                },
                "uniqueleads": {
                    "yhat_lower": 174.4132588013,
                    "stdChange": -0.9279290092,
                    "change": -114.4132588013,
                    "ds": "2018-04-10",
                    "yhat": 235.3193005986,
                    "actual": 60,
                    "yhat_upper": 297.7128406291
                },
                "sales": {
                    "yhat_lower": 171.6759206627,
                    "stdChange": -0.8840233502,
                    "change": -111.6759206627,
                    "ds": "2018-04-10",
                    "yhat": 235.8524194489,
                    "actual": 60,
                    "yhat_upper": 298.0028108273
                },
                "uniquesales": {
                    "yhat_lower": 172.3050824559,
                    "stdChange": -0.8838435959,
                    "change": -112.3050824559,
                    "ds": "2018-04-10",
                    "yhat": 235.3193005986,
                    "actual": 60,
                    "yhat_upper": 299.3695121559
                },
                "cq": {
                    "actual": 0.08333333333333333
                },
                "pixels_ratio": {
                    "actual": 0.15
                },
                "paid_sales": {
                    "yhat_lower": 24.547337697,
                    "stdChange": -0.6325527587,
                    "change": -15.547337697,
                    "ds": "2018-04-10",
                    "yhat": 36.3660554864,
                    "actual": 9,
                    "yhat_upper": 49.1260585749
                },
                "resubs": {
                    "yhat_lower": 0.996794515,
                    "stdChange": 0.5576894983,
                    "change": 0.0011476391,
                    "ds": "2018-04-10",
                    "yhat": 0.997745739,
                    "actual": 1,
                    "yhat_upper": 0.9988523609
                },
                "ecpa": {
                    "yhat_lower": 0.0258358414,
                    "stdChange": -0.7794004215,
                    "change": -0.0091691747,
                    "ds": "2018-04-10",
                    "yhat": 0.0317150425,
                    "actual": 0.016666666666666666,
                    "yhat_upper": 0.0376002368
                }
            },
            "sections": {}
        },
        {
            "page": "IE",
            "metrics": {
                "cr": {
                    "actual": null
                },
                "pixels_ratio": {
                    "actual": null
                },
                "optout_24": {
                    "actual": null
                },
                "pixels": {
                    "actual": null
                },
                "cost": {
                    "actual": null
                },
                "cq": {
                    "actual": null
                },
                "total_optouts": {
                    "actual": null
                },
                "ecpa": {
                    "actual": null
                },
                "firstbillings": {
                    "actual": null
                },
                "leads": {
                    "actual": null
                },
                "paid_sales": {
                    "actual": null
                },
                "uniquesales": {
                    "actual": null
                },
                "releads": {
                    "actual": null
                },
                "uniqueleads": {
                    "actual": null
                },
                "resubs": {
                    "actual": null
                },
                "sales": {
                    "actual": null
                },
                "views": {
                    "actual": null
                },
                "active24": {
                    "actual": null
                }
            },
            "sections": {}
        },
        {
            "page": "IN",
            "metrics": {
                "uniqueleads": {
                    "actual": null
                },
                "leads": {
                    "actual": null
                },
                "total_optouts": {
                    "actual": null
                },
                "optout_24": {
                    "actual": null
                },
                "uniquesales": {
                    "actual": null
                },
                "pixels": {
                    "actual": null
                },
                "cq": {
                    "actual": null
                },
                "cost": {
                    "actual": null
                },
                "ecpa": {
                    "actual": null
                },
                "releads": {
                    "actual": null
                },
                "firstbillings": {
                    "actual": null
                },
                "sales": {
                    "actual": null
                },
                "resubs": {
                    "actual": null
                },
                "pixels_ratio": {
                    "actual": null
                },
                "cr": {
                    "actual": null
                },
                "views": {
                    "actual": null
                },
                "active24": {
                    "actual": null
                },
                "paid_sales": {
                    "actual": null
                }
            },
            "sections": {}
        },
        {
            "page": "IQ",
            "metrics": {
                "total_optouts": {
                    "ds": "2018-04-10",
                    "stdChange": -1.6547314469,
                    "actual": 2000,
                    "change": -1401.8964372606,
                    "yhat_upper": 4249.1012449383,
                    "yhat": 3809.8179719921,
                    "yhat_lower": 3401.8964372606
                },
                "optout_24": {
                    "ds": "2018-04-10",
                    "stdChange": -1.4556074488,
                    "actual": 87,
                    "change": -842.3342824449,
                    "yhat_upper": 1508.0165934787,
                    "yhat": 1230.1946036765,
                    "yhat_lower": 929.3342824449
                },
                "leads": {
                    "ds": "2018-04-10",
                    "stdChange": -2.2983486968,
                    "actual": 2266,
                    "change": -11379.4830144299,
                    "yhat_upper": 18596.6390466006,
                    "yhat": 16058.3453839506,
                    "yhat_lower": 13645.4830144299
                },
                "releads": {
                    "ds": "2018-04-10",
                    "stdChange": 1.8178623443,
                    "actual": 1.8758278145695364,
                    "change": 0.4233666296,
                    "yhat_upper": 1.4524611849,
                    "yhat": 1.3331756255,
                    "yhat_lower": 1.2195686169
                },
                "paid_sales": {
                    "ds": "2018-04-10",
                    "stdChange": -1.535815782,
                    "actual": 576,
                    "change": -3756.5251170371,
                    "yhat_upper": 6778.4728414631,
                    "yhat": 5579.5368971109,
                    "yhat_lower": 4332.5251170371
                },
                "firstbillings": {
                    "ds": "2018-04-10",
                    "stdChange": -1.3885446848,
                    "actual": 144,
                    "change": -1506.5190923863,
                    "yhat_upper": 2735.4817218616,
                    "yhat": 2210.2576377991,
                    "yhat_lower": 1650.5190923863
                },
                "pixels": {
                    "ds": "2018-04-10",
                    "stdChange": -1.5140063435,
                    "actual": 576,
                    "change": -3717.3026322342,
                    "yhat_upper": 6748.5780994085,
                    "yhat": 5579.5368971109,
                    "yhat_lower": 4293.3026322342
                },
                "views": {
                    "actual": 48979
                },
                "cr": {
                    "ds": "2018-04-10",
                    "stdChange": -0.7885819341,
                    "actual": 0.013883501092304865,
                    "change": -0.016926582,
                    "yhat_upper": 0.0522746657,
                    "yhat": 0.0416673282,
                    "yhat_lower": 0.0308100831
                },
                "sales": {
                    "ds": "2018-04-10",
                    "stdChange": -1.6299418517,
                    "actual": 680,
                    "change": -4192.482465998,
                    "yhat_upper": 7444.6493575185,
                    "yhat": 6179.6527194982,
                    "yhat_lower": 4872.482465998
                },
                "cost": {
                    "ds": "2018-04-10",
                    "stdChange": -1.3083102977,
                    "actual": 147,
                    "change": -3462.5758777438,
                    "yhat_upper": 6256.177287052,
                    "yhat": 4932.844796997,
                    "yhat_lower": 3609.5758777438
                },
                "cq": {
                    "ds": "2018-04-10",
                    "stdChange": -1.3349839696,
                    "actual": 0.21176470588235294,
                    "change": -0.0952439729,
                    "yhat_upper": 0.3783533353,
                    "yhat": 0.3438147312,
                    "yhat_lower": 0.3070086787
                },
                "ecpa": {
                    "ds": "2018-04-10",
                    "stdChange": -3.5964943845,
                    "actual": 0.2161764705882353,
                    "change": -0.5083254919,
                    "yhat_upper": 0.8658411216,
                    "yhat": 0.7972073,
                    "yhat_lower": 0.7245019625
                },
                "pixels_ratio": {
                    "ds": "2018-04-10",
                    "stdChange": -2.6415801574,
                    "actual": 0.8470588235294118,
                    "change": -0.0496912059,
                    "yhat_upper": 0.9155611965,
                    "yhat": 0.9059245705,
                    "yhat_lower": 0.8967500294
                },
                "uniquesales": {
                    "ds": "2018-04-10",
                    "stdChange": -1.5905500892,
                    "actual": 667,
                    "change": -4215.9331991914,
                    "yhat_upper": 7533.5464856449,
                    "yhat": 6133.4512768376,
                    "yhat_lower": 4882.9331991914
                },
                "resubs": {
                    "ds": "2018-04-10",
                    "stdChange": 1.0380571617,
                    "actual": 1.0194902548725637,
                    "change": 0.0046811017,
                    "yhat_upper": 1.0148091532,
                    "yhat": 1.0124990532,
                    "yhat_lower": 1.0102996696
                },
                "uniqueleads": {
                    "ds": "2018-04-10",
                    "stdChange": -2.486766707,
                    "actual": 1208,
                    "change": -8709.3780483173,
                    "yhat_upper": 13419.6679992308,
                    "yhat": 11624.4502253632,
                    "yhat_lower": 9917.3780483173
                },
                "active24": {
                    "ds": "2018-04-10",
                    "stdChange": 1.7050095972,
                    "actual": 0.8720588235294118,
                    "change": 0.0493022878,
                    "yhat_upper": 0.8227565357,
                    "yhat": 0.8081603762,
                    "yhat_lower": 0.7938404007
                }
            },
            "sections": {}
        },
        {
            "page": "IR",
            "metrics": {
                "cost": {
                    "actual": 0
                },
                "cr": {
                    "ds": "2018-04-10",
                    "yhat_upper": 0.6338973518,
                    "yhat": 0.4168876896,
                    "actual": 1,
                    "yhat_lower": 0.190505904,
                    "stdChange": 0.8256872117,
                    "change": 0.3661026482
                },
                "pixels": {
                    "actual": 0
                },
                "total_optouts": {
                    "ds": "2018-04-10",
                    "yhat_upper": 555.1981464842,
                    "yhat": 455.8488508911,
                    "actual": 123,
                    "yhat_lower": 356.3633977828,
                    "stdChange": -1.173655004,
                    "change": -233.3633977828
                },
                "resubs": {
                    "actual": 1
                },
                "paid_sales": {
                    "actual": 0
                },
                "views": {
                    "actual": 1
                },
                "cq": {
                    "actual": 0
                },
                "ecpa": {
                    "actual": 0
                },
                "sales": {
                    "ds": "2018-04-10",
                    "yhat_upper": 2.8472995214,
                    "yhat": 1.9333270951,
                    "actual": 1,
                    "yhat_lower": 1.0479482708,
                    "stdChange": -0.0266475325,
                    "change": -0.0479482708
                },
                "uniqueleads": {
                    "actual": 0
                },
                "releads": {
                    "actual": 0
                },
                "active24": {
                    "actual": 1
                },
                "pixels_ratio": {
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                },
                "leads": {
                    "actual": 0
                },
                "uniquesales": {
                    "actual": 0
                },
                "optout_24": {
                    "actual": 0
                }
            },
            "sections": {}
        },
        {
            "page": "JO",
            "metrics": {
                "cq": {
                    "actual": null
                },
                "ecpa": {
                    "actual": null
                },
                "optout_24": {
                    "actual": null
                },
                "active24": {
                    "actual": null
                },
                "leads": {
                    "actual": null
                },
                "views": {
                    "actual": null
                },
                "cost": {
                    "actual": null
                },
                "releads": {
                    "actual": null
                },
                "uniqueleads": {
                    "actual": null
                },
                "total_optouts": {
                    "actual": null
                },
                "pixels": {
                    "actual": null
                },
                "resubs": {
                    "actual": null
                },
                "firstbillings": {
                    "actual": null
                },
                "uniquesales": {
                    "actual": null
                },
                "pixels_ratio": {
                    "actual": null
                },
                "sales": {
                    "actual": null
                },
                "paid_sales": {
                    "actual": null
                },
                "cr": {
                    "actual": null
                }
            },
            "sections": {}
        },
        {
            "page": "KE",
            "metrics": {
                "views": {
                    "actual": 54422
                },
                "active24": {
                    "actual": 1
                },
                "sales": {
                    "actual": 1
                },
                "paid_sales": {
                    "actual": 1
                },
                "ecpa": {
                    "actual": 0
                },
                "pixels": {
                    "actual": 1
                },
                "total_optouts": {
                    "stdChange": -1.1506274407,
                    "actual": 6,
                    "yhat_lower": 20.3374687999,
                    "change": -14.3374687999,
                    "yhat_upper": 32.7980344812,
                    "ds": "2018-04-10",
                    "yhat": 26.6966564192
                },
                "cq": {
                    "stdChange": 6.5436655297,
                    "actual": 1,
                    "yhat_lower": 0.0700090005,
                    "change": 0.8067099505,
                    "yhat_upper": 0.1932900495,
                    "ds": "2018-04-10",
                    "yhat": 0.128332697
                },
                "resubs": {
                    "actual": 1
                },
                "cost": {
                    "actual": 0
                },
                "leads": {
                    "actual": 1
                },
                "releads": {
                    "actual": 1
                },
                "uniqueleads": {
                    "actual": 1
                },
                "firstbillings": {
                    "actual": 1
                },
                "cr": {
                    "stdChange": -0.1303753102,
                    "actual": 0.000018374921906581898,
                    "yhat_lower": 0.0000394695,
                    "change": -0.0000210945,
                    "yhat_upper": 0.000201268,
                    "ds": "2018-04-10",
                    "yhat": 0.0001173956
                },
                "pixels_ratio": {
                    "stdChange": 3.6007122806,
                    "actual": 1,
                    "yhat_lower": -0.0865593855,
                    "change": 0.8503873932,
                    "yhat_upper": 0.1496126068,
                    "ds": "2018-04-10",
                    "yhat": 0.03196697
                },
                "uniquesales": {
                    "actual": 1
                },
                "optout_24": {
                    "actual": 0
                }
            },
            "sections": {}
        },
        {
            "page": "KW",
            "metrics": {
                "pixels": {
                    "actual": 13
                },
                "resubs": {
                    "actual": 1.0625
                },
                "pixels_ratio": {
                    "actual": 0.7647058823529411
                },
                "total_optouts": {
                    "ds": "2018-04-10",
                    "stdChange": -0.9705110353,
                    "actual": 2,
                    "yhat_lower": 25.5963504576,
                    "yhat_upper": 49.9096757042,
                    "change": -23.5963504576,
                    "yhat": 37.3860508829
                },
                "releads": {
                    "ds": "2018-04-10",
                    "stdChange": -0.5529149868,
                    "actual": 1.00625,
                    "yhat_lower": 1.0222733129,
                    "yhat_upper": 1.0512530174,
                    "change": -0.0160233129,
                    "yhat": 1.0369448088
                },
                "sales": {
                    "actual": 17
                },
                "optout_24": {
                    "actual": 0
                },
                "ecpa": {
                    "ds": "2018-04-10",
                    "stdChange": 0.1533807907,
                    "actual": 1.588235294117647,
                    "yhat_lower": 0.29042301,
                    "yhat_upper": 1.4156474759,
                    "change": 0.1725878182,
                    "yhat": 0.8796655114
                },
                "leads": {
                    "ds": "2018-04-10",
                    "stdChange": -0.6160820314,
                    "actual": 1610,
                    "yhat_lower": 5699.6252599043,
                    "yhat_upper": 12337.7433213259,
                    "change": -4089.6252599043,
                    "yhat": 8950.6655049991
                },
                "firstbillings": {
                    "ds": "2018-04-10",
                    "stdChange": -0.0146953939,
                    "actual": 4,
                    "yhat_lower": 4.7794107279,
                    "yhat_upper": 57.8171676908,
                    "change": -0.7794107279,
                    "yhat": 31.1841328846
                },
                "uniquesales": {
                    "actual": 16
                },
                "views": {
                    "ds": "2018-04-10",
                    "stdChange": -2.2573366907,
                    "actual": 43230,
                    "yhat_lower": 105185.6522111277,
                    "yhat_upper": 132632.0019148898,
                    "change": -61955.6522111277,
                    "yhat": 119936.2098327371
                },
                "paid_sales": {
                    "actual": 13
                },
                "active24": {
                    "ds": "2018-04-10",
                    "stdChange": 0.1780615893,
                    "actual": 1,
                    "yhat_lower": 0.8804850988,
                    "yhat_upper": 0.9819355682,
                    "change": 0.0180644318,
                    "yhat": 0.9299529978
                },
                "uniqueleads": {
                    "ds": "2018-04-10",
                    "stdChange": -0.6394843908,
                    "actual": 1600,
                    "yhat_lower": 5480.4000415352,
                    "yhat_upper": 11548.4137376003,
                    "change": -3880.4000415352,
                    "yhat": 8508.0305821949
                },
                "cq": {
                    "ds": "2018-04-10",
                    "stdChange": -0.5056860564,
                    "actual": 0.23529411764705882,
                    "yhat_lower": 0.3566450354,
                    "yhat_upper": 0.5966178727,
                    "change": -0.1213509178,
                    "yhat": 0.4792841768
                },
                "cost": {
                    "actual": 27
                },
                "cr": {
                    "actual": 0.0003932454314133703
                }
            },
            "sections": {}
        },
        {
            "page": "LK",
            "metrics": {
                "pixels_ratio": {
                    "actual": 0
                },
                "uniquesales": {
                    "actual": 0
                },
                "resubs": {
                    "actual": 0
                },
                "cr": {
                    "actual": 0
                },
                "cq": {
                    "yhat_lower": 0.4332188953,
                    "ds": "2018-04-10",
                    "actual": 0,
                    "yhat": 0.9991375843,
                    "yhat_upper": 1.5363404262,
                    "change": -0.4332188953,
                    "stdChange": -0.3927209135
                },
                "releads": {
                    "actual": 0
                },
                "paid_sales": {
                    "actual": 0
                },
                "optout_24": {
                    "yhat_lower": 0.412643944,
                    "ds": "2018-04-10",
                    "actual": 0,
                    "yhat": 0.9963285851,
                    "yhat_upper": 1.5770282902,
                    "change": -0.412643944,
                    "stdChange": -0.3543880895
                },
                "total_optouts": {
                    "actual": 1
                },
                "ecpa": {
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                },
                "cost": {
                    "actual": 0
                },
                "sales": {
                    "actual": 0
                },
                "views": {
                    "yhat_lower": 28271.1792936911,
                    "ds": "2018-04-10",
                    "actual": 27906,
                    "yhat": 39131.3108545541,
                    "yhat_upper": 50519.2293516478,
                    "change": -365.1792936911,
                    "stdChange": -0.016413991
                },
                "leads": {
                    "actual": 0
                },
                "active24": {
                    "actual": 0
                },
                "pixels": {
                    "actual": 0
                },
                "uniqueleads": {
                    "actual": 0
                }
            },
            "sections": {}
        },
        {
            "page": "MX",
            "metrics": {
                "cq": {
                    "change": -0.0180542476,
                    "ds": "2018-04-10",
                    "stdChange": -6712967.707696072,
                    "yhat_lower": 1.0036657584,
                    "yhat_upper": 1.0036657611,
                    "actual": 0.9856115107913669,
                    "yhat": 1.0036657597
                },
                "uniquesales": {
                    "change": -166.7776063856,
                    "ds": "2018-04-10",
                    "stdChange": -2.1075422745,
                    "yhat_lower": 305.7776063856,
                    "yhat_upper": 384.9113008323,
                    "actual": 139,
                    "yhat": 346.3903346372
                },
                "cr": {
                    "actual": 0.0011589321149260451
                },
                "resubs": {
                    "change": -0.006270477,
                    "ds": "2018-04-10",
                    "stdChange": -2.0327341817,
                    "yhat_lower": 1.006270477,
                    "yhat_upper": 1.0093552271,
                    "actual": 1,
                    "yhat": 1.0078403479
                },
                "releads": {
                    "actual": 1.5037202380952381
                },
                "views": {
                    "change": -35068.0117789471,
                    "ds": "2018-04-10",
                    "stdChange": -0.238814479,
                    "yhat_lower": 155006.0117789471,
                    "yhat_upper": 301848.078997676,
                    "actual": 119938,
                    "yhat": 228705.2561021507
                },
                "optout_24": {
                    "change": -22.9116370958,
                    "ds": "2018-04-10",
                    "stdChange": -1.8926292697,
                    "yhat_lower": 28.9116370958,
                    "yhat_upper": 41.0173555595,
                    "actual": 6,
                    "yhat": 35.0092309009
                },
                "active24": {
                    "change": 0.0283218221,
                    "ds": "2018-04-10",
                    "stdChange": 0.7815613288,
                    "yhat_lower": 0.8922752186,
                    "yhat_upper": 0.9285127103,
                    "actual": 0.9568345323741008,
                    "yhat": 0.9112395736
                },
                "uniqueleads": {
                    "change": -919.7331209039,
                    "ds": "2018-04-10",
                    "stdChange": -0.9201454511,
                    "yhat_lower": 2263.7331209039,
                    "yhat_upper": 3263.2850067766,
                    "actual": 1344,
                    "yhat": 2775.5808373129
                },
                "pixels": {
                    "change": -28.2941713093,
                    "ds": "2018-04-10",
                    "stdChange": -0.5060321452,
                    "yhat_lower": 109.2941713093,
                    "yhat_upper": 165.2079538219,
                    "actual": 81,
                    "yhat": 137.0855026573
                },
                "ecpa": {
                    "actual": 0.6079136690647482
                },
                "sales": {
                    "change": -160.3780752064,
                    "ds": "2018-04-10",
                    "stdChange": -2.0371445354,
                    "yhat_lower": 299.3780752064,
                    "yhat_upper": 378.104975736,
                    "actual": 139,
                    "yhat": 338.8068918053
                },
                "cost": {
                    "change": -73.8153308281,
                    "ds": "2018-04-10",
                    "stdChange": -0.8608862234,
                    "yhat_lower": 158.3153308281,
                    "yhat_upper": 244.0587529222,
                    "actual": 84.5,
                    "yhat": 201.9452664578
                },
                "paid_sales": {
                    "change": -24.134505843,
                    "ds": "2018-04-10",
                    "stdChange": -0.382382014,
                    "yhat_lower": 105.134505843,
                    "yhat_upper": 168.2507219814,
                    "actual": 81,
                    "yhat": 137.0855026573
                },
                "firstbillings": {
                    "change": -161.3409934123,
                    "ds": "2018-04-10",
                    "stdChange": -2.1111302291,
                    "yhat_lower": 298.3409934123,
                    "yhat_upper": 374.7649824154,
                    "actual": 137,
                    "yhat": 338.8068918053
                },
                "pixels_ratio": {
                    "change": 0.0870399077,
                    "ds": "2018-04-10",
                    "stdChange": 0.5985412285,
                    "yhat_lower": 0.3502738348,
                    "yhat_upper": 0.4956939053,
                    "actual": 0.5827338129496403,
                    "yhat": 0.4260469737
                },
                "leads": {
                    "actual": 2021
                },
                "total_optouts": {
                    "change": -51.9431548657,
                    "ds": "2018-04-10",
                    "stdChange": -1.1189325519,
                    "yhat_lower": 145.9431548657,
                    "yhat_upper": 192.3652155843,
                    "actual": 94,
                    "yhat": 169.6226497862
                }
            },
            "sections": {}
        },
        {
            "page": "MY",
            "metrics": {
                "uniqueleads": {
                    "yhat_lower": 2826.8997326528,
                    "actual": 1594,
                    "change": -1232.8997326528,
                    "stdChange": -0.5869047095,
                    "yhat_upper": 4927.5810062085,
                    "ds": "2018-04-10",
                    "yhat": 3885.7938103869
                },
                "ecpa": {
                    "yhat_lower": 0.8609134403,
                    "actual": 0.48137931034482756,
                    "change": -0.37953413,
                    "stdChange": -2.317923984,
                    "yhat_upper": 1.0246522569,
                    "ds": "2018-04-10",
                    "yhat": 0.9394022226
                },
                "total_optouts": {
                    "actual": 63
                },
                "cr": {
                    "yhat_lower": 0.0007991084,
                    "actual": 0.0005474941757947161,
                    "change": -0.0002516143,
                    "stdChange": -0.4528951479,
                    "yhat_upper": 0.0013546769,
                    "ds": "2018-04-10",
                    "yhat": 0.0010736851
                },
                "cost": {
                    "yhat_lower": 318.9424334828,
                    "actual": 69.8,
                    "change": -249.1424334828,
                    "stdChange": -0.7271922829,
                    "yhat_upper": 661.5511758296,
                    "ds": "2018-04-10",
                    "yhat": 494.0718973777
                },
                "pixels_ratio": {
                    "actual": 0.38620689655172413
                },
                "resubs": {
                    "actual": 1.25
                },
                "views": {
                    "yhat_lower": 398024.6819959699,
                    "actual": 264843,
                    "change": -133181.6819959699,
                    "stdChange": -0.5140007684,
                    "yhat_upper": 657132.6253605179,
                    "ds": "2018-04-10",
                    "yhat": 523604.0973002513
                },
                "pixels": {
                    "yhat_lower": 145.6585673619,
                    "actual": 56,
                    "change": -89.6585673619,
                    "stdChange": -0.5767853042,
                    "yhat_upper": 301.1038720815,
                    "ds": "2018-04-10",
                    "yhat": 223.1746857051
                },
                "cq": {
                    "yhat_lower": 0.1923595474,
                    "actual": 0.04827586206896552,
                    "change": -0.1440836853,
                    "stdChange": -1.4576631484,
                    "yhat_upper": 0.2912052139,
                    "ds": "2018-04-10",
                    "yhat": 0.2417845629
                },
                "releads": {
                    "yhat_lower": 1.1388482576,
                    "actual": 1.396486825595985,
                    "change": 0.0257291292,
                    "stdChange": 0.1109447262,
                    "yhat_upper": 1.3707576964,
                    "ds": "2018-04-10",
                    "yhat": 1.2607650792
                },
                "active24": {
                    "yhat_lower": 0.7662129652,
                    "actual": 0.8344827586206897,
                    "change": 0.0210509757,
                    "stdChange": 0.4458175094,
                    "yhat_upper": 0.8134317829,
                    "ds": "2018-04-10",
                    "yhat": 0.7898544677
                },
                "firstbillings": {
                    "yhat_lower": 78.1980007753,
                    "actual": 7,
                    "change": -71.1980007753,
                    "stdChange": -0.7466937828,
                    "yhat_upper": 173.5490033052,
                    "ds": "2018-04-10",
                    "yhat": 124.5903005898
                },
                "leads": {
                    "yhat_lower": 3727.78882152,
                    "actual": 2226,
                    "change": -1501.78882152,
                    "stdChange": -0.5989463282,
                    "yhat_upper": 6235.173458238,
                    "ds": "2018-04-10",
                    "yhat": 4974.7044087951
                },
                "optout_24": {
                    "yhat_lower": 93.1025237815,
                    "actual": 24,
                    "change": -69.1025237815,
                    "stdChange": -1.6536671785,
                    "yhat_upper": 134.8899672755,
                    "ds": "2018-04-10",
                    "yhat": 114.4107117287
                },
                "sales": {
                    "yhat_lower": 396.5877552117,
                    "actual": 145,
                    "change": -251.5877552117,
                    "stdChange": -0.9105529571,
                    "yhat_upper": 672.8899222127,
                    "ds": "2018-04-10",
                    "yhat": 534.8286548707
                },
                "paid_sales": {
                    "yhat_lower": 147.9595965016,
                    "actual": 56,
                    "change": -91.9595965016,
                    "stdChange": -0.6129513649,
                    "yhat_upper": 297.9871545886,
                    "ds": "2018-04-10",
                    "yhat": 223.1746857051
                },
                "uniquesales": {
                    "yhat_lower": 301.5923637883,
                    "actual": 116,
                    "change": -185.5923637883,
                    "stdChange": -0.7315013395,
                    "yhat_upper": 555.306682219,
                    "ds": "2018-04-10",
                    "yhat": 424.2452904903
                }
            },
            "sections": {}
        },
        {
            "page": "NG",
            "metrics": {
                "leads": {
                    "actual": null
                },
                "uniqueleads": {
                    "actual": null
                },
                "uniquesales": {
                    "actual": null
                },
                "paid_sales": {
                    "actual": null
                },
                "pixels_ratio": {
                    "actual": null
                },
                "pixels": {
                    "actual": null
                },
                "cr": {
                    "actual": null
                },
                "resubs": {
                    "actual": null
                },
                "releads": {
                    "actual": null
                },
                "cost": {
                    "actual": null
                },
                "total_optouts": {
                    "actual": null
                },
                "firstbillings": {
                    "actual": null
                },
                "active24": {
                    "actual": null
                },
                "sales": {
                    "actual": null
                },
                "optout_24": {
                    "actual": null
                },
                "ecpa": {
                    "actual": null
                },
                "views": {
                    "actual": null
                },
                "cq": {
                    "actual": null
                }
            },
            "sections": {}
        },
        {
            "page": "NL",
            "metrics": {
                "pixels_ratio": {
                    "actual": null
                },
                "cr": {
                    "actual": null
                },
                "firstbillings": {
                    "actual": null
                },
                "uniqueleads": {
                    "actual": null
                },
                "pixels": {
                    "actual": null
                },
                "sales": {
                    "actual": null
                },
                "paid_sales": {
                    "actual": null
                },
                "cq": {
                    "actual": null
                },
                "leads": {
                    "actual": null
                },
                "active24": {
                    "actual": null
                },
                "views": {
                    "actual": null
                },
                "resubs": {
                    "actual": null
                },
                "uniquesales": {
                    "actual": null
                },
                "releads": {
                    "actual": null
                },
                "cost": {
                    "actual": null
                },
                "ecpa": {
                    "actual": null
                },
                "optout_24": {
                    "actual": null
                },
                "total_optouts": {
                    "actual": null
                }
            },
            "sections": {}
        },
        {
            "page": "NN",
            "metrics": {
                "cost": {
                    "actual": null
                },
                "firstbillings": {
                    "actual": null
                },
                "uniquesales": {
                    "actual": null
                },
                "sales": {
                    "actual": null
                },
                "uniqueleads": {
                    "actual": null
                },
                "views": {
                    "actual": null
                },
                "pixels_ratio": {
                    "actual": null
                },
                "pixels": {
                    "actual": null
                },
                "paid_sales": {
                    "actual": null
                },
                "resubs": {
                    "actual": null
                },
                "cr": {
                    "actual": null
                },
                "releads": {
                    "actual": null
                },
                "total_optouts": {
                    "actual": null
                },
                "optout_24": {
                    "actual": null
                },
                "active24": {
                    "actual": null
                },
                "ecpa": {
                    "actual": null
                },
                "cq": {
                    "actual": null
                },
                "leads": {
                    "actual": null
                }
            },
            "sections": {}
        },
        {
            "page": "OM",
            "metrics": {
                "active24": {
                    "actual": 1
                },
                "uniquesales": {
                    "actual": 9,
                    "ds": "2018-04-10",
                    "change": -27.9980430793,
                    "yhat_upper": 144.0438641017,
                    "yhat_lower": 36.9980430793,
                    "yhat": 89.7914804484,
                    "stdChange": -0.2615519486
                },
                "resubs": {
                    "actual": 1
                },
                "pixels": {
                    "actual": 9,
                    "ds": "2018-04-10",
                    "change": -28.9004264523,
                    "yhat_upper": 145.5038872302,
                    "yhat_lower": 37.9004264523,
                    "yhat": 90.1547934861,
                    "stdChange": -0.2685826854
                },
                "total_optouts": {
                    "actual": 35
                },
                "sales": {
                    "actual": 9,
                    "ds": "2018-04-10",
                    "change": -28.8990055331,
                    "yhat_upper": 149.0152455373,
                    "yhat_lower": 37.8990055331,
                    "yhat": 90.1547934861,
                    "stdChange": -0.2600790445
                },
                "ecpa": {
                    "actual": 1.1111111111111112,
                    "ds": "2018-04-10",
                    "change": -0.8828170383,
                    "yhat_upper": 2.007258938,
                    "yhat_lower": 1.9939281494,
                    "yhat": 2.0008133389,
                    "stdChange": -66.2239172909
                },
                "optout_24": {
                    "actual": 0
                },
                "views": {
                    "actual": 11705,
                    "ds": "2018-04-10",
                    "change": -8742.6048720395,
                    "yhat_upper": 35382.2001848488,
                    "yhat_lower": 20447.6048720395,
                    "yhat": 27610.446596521,
                    "stdChange": -0.5853928204
                },
                "leads": {
                    "actual": 612,
                    "ds": "2018-04-10",
                    "change": -744.7604070475,
                    "yhat_upper": 3062.6149044154,
                    "yhat_lower": 1356.7604070475,
                    "yhat": 2179.2650181213,
                    "stdChange": -0.436590816
                },
                "releads": {
                    "actual": 1.5612244897959184,
                    "ds": "2018-04-10",
                    "change": -0.0273492223,
                    "yhat_upper": 1.8163218521,
                    "yhat_lower": 1.588573712,
                    "yhat": 1.6980937488,
                    "stdChange": -0.1200853813
                },
                "cost": {
                    "actual": 10,
                    "ds": "2018-04-10",
                    "change": -66.7153838148,
                    "yhat_upper": 291.5933740581,
                    "yhat_lower": 76.7153838148,
                    "yhat": 180.0000512137,
                    "stdChange": -0.3104803044
                },
                "paid_sales": {
                    "actual": 9,
                    "ds": "2018-04-10",
                    "change": -25.4495073078,
                    "yhat_upper": 142.9271947403,
                    "yhat_lower": 34.4495073078,
                    "yhat": 90.1547934861,
                    "stdChange": -0.2346059168
                },
                "cq": {
                    "actual": 0.1111111111111111,
                    "ds": "2018-04-10",
                    "change": -0.0740637618,
                    "yhat_upper": 0.5298166181,
                    "yhat_lower": 0.1851748729,
                    "yhat": 0.3636473455,
                    "stdChange": -0.2149007275
                },
                "cr": {
                    "actual": 0.0007689021785561726,
                    "ds": "2018-04-10",
                    "change": -0.0011922739,
                    "yhat_upper": 0.0049234673,
                    "yhat_lower": 0.001961176,
                    "yhat": 0.0034576731,
                    "stdChange": -0.4024836705
                },
                "uniqueleads": {
                    "actual": 392,
                    "ds": "2018-04-10",
                    "change": -433.4280098365,
                    "yhat_upper": 1954.9760185165,
                    "yhat_lower": 825.4280098365,
                    "yhat": 1371.5761353243,
                    "stdChange": -0.3837180948
                },
                "firstbillings": {
                    "actual": 1,
                    "ds": "2018-04-10",
                    "change": -5.9029676663,
                    "yhat_upper": 32.5332866109,
                    "yhat_lower": 6.9029676663,
                    "yhat": 19.1101503189,
                    "stdChange": -0.2303119083
                },
                "pixels_ratio": {
                    "actual": 1,
                    "ds": "2018-04-10",
                    "change": -0.0036657584,
                    "yhat_upper": 1.0036657611,
                    "yhat_lower": 1.0036657584,
                    "yhat": 1.0036657597,
                    "stdChange": -1338751.017268064
                }
            },
            "sections": {}
        },
        {
            "page": "PL",
            "metrics": {
                "cost": {
                    "actual": 0
                },
                "leads": {
                    "actual": 0
                },
                "pixels": {
                    "actual": 0
                },
                "views": {
                    "yhat_lower": -0.3789828453,
                    "stdChange": 0.7662952138,
                    "actual": 1,
                    "yhat": 7.436e-7,
                    "ds": "2018-04-10",
                    "change": 0.5982623663,
                    "yhat_upper": 0.4017376337
                },
                "paid_sales": {
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                },
                "releads": {
                    "actual": 0
                },
                "optout_24": {
                    "actual": 0
                },
                "resubs": {
                    "actual": 0
                },
                "cq": {
                    "actual": 0
                },
                "sales": {
                    "actual": 0
                },
                "uniquesales": {
                    "actual": 0
                },
                "total_optouts": {
                    "yhat_lower": 3.0430921428,
                    "stdChange": -0.0758366995,
                    "actual": 2,
                    "yhat": 10.1407495228,
                    "ds": "2018-04-10",
                    "change": -1.0430921428,
                    "yhat_upper": 16.797542813
                },
                "pixels_ratio": {
                    "actual": 0
                },
                "active24": {
                    "actual": 0
                },
                "uniqueleads": {
                    "actual": 0
                },
                "cr": {
                    "actual": 0
                },
                "ecpa": {
                    "actual": 0
                }
            },
            "sections": {}
        },
        {
            "page": "PT",
            "metrics": {
                "cq": {
                    "ds": "2018-04-10",
                    "change": 0.2578542943,
                    "stdChange": 0.3230248592,
                    "yhat_lower": -0.3894367003,
                    "actual": 0.6666666666666666,
                    "yhat": 0.0265176671,
                    "yhat_upper": 0.4088123723
                },
                "ecpa": {
                    "ds": "2018-04-10",
                    "change": -1.5767923252,
                    "stdChange": -1.7006857828,
                    "yhat_lower": 2.5767923252,
                    "actual": 1,
                    "yhat": 3.016911008,
                    "yhat_upper": 3.5039432081
                },
                "total_optouts": {
                    "ds": "2018-04-10",
                    "change": -6.2700448351,
                    "stdChange": -0.7272369808,
                    "yhat_lower": 6.2700448351,
                    "actual": 0,
                    "yhat": 10.6845632404,
                    "yhat_upper": 14.8917802531
                },
                "leads": {
                    "actual": 14
                },
                "views": {
                    "actual": 1262
                },
                "uniquesales": {
                    "actual": 3
                },
                "cost": {
                    "actual": 3
                },
                "releads": {
                    "actual": 1.4
                },
                "pixels_ratio": {
                    "ds": "2018-04-10",
                    "change": -0.0036657584,
                    "stdChange": -1390672.241399963,
                    "yhat_lower": 1.0036657584,
                    "actual": 1,
                    "yhat": 1.0036657597,
                    "yhat_upper": 1.0036657611
                },
                "pixels": {
                    "actual": 3
                },
                "optout_24": {
                    "actual": 0
                },
                "resubs": {
                    "ds": "2018-04-10",
                    "change": -0.0036657583,
                    "stdChange": -1333166.6472944098,
                    "yhat_lower": 1.0036657583,
                    "actual": 1,
                    "yhat": 1.0036657597,
                    "yhat_upper": 1.0036657611
                },
                "uniqueleads": {
                    "ds": "2018-04-10",
                    "change": -25.3262963654,
                    "stdChange": -0.4348549815,
                    "yhat_lower": 35.3262963654,
                    "actual": 10,
                    "yhat": 65.0147986647,
                    "yhat_upper": 93.5670833951
                },
                "paid_sales": {
                    "actual": 3
                },
                "cr": {
                    "ds": "2018-04-10",
                    "change": 0.0009928737,
                    "stdChange": 1.4756585054,
                    "yhat_lower": 0.000711471,
                    "actual": 0.002377179080824089,
                    "yhat": 0.0010316323,
                    "yhat_upper": 0.0013843053
                },
                "sales": {
                    "actual": 3
                },
                "active24": {
                    "actual": 1
                },
                "firstbillings": {
                    "actual": 2
                }
            },
            "sections": {}
        },
        {
            "page": "QA",
            "metrics": {
                "pixels_ratio": {
                    "ds": "2018-04-10",
                    "yhat_lower": 0.9627101401,
                    "change": 0.0028296977,
                    "yhat_upper": 0.9971703023,
                    "stdChange": 0.0821150416,
                    "actual": 1,
                    "yhat": 0.980651724
                },
                "sales": {
                    "actual": 16
                },
                "optout_24": {
                    "actual": 1
                },
                "firstbillings": {
                    "actual": 4
                },
                "paid_sales": {
                    "actual": 16
                },
                "ecpa": {
                    "ds": "2018-04-10",
                    "yhat_lower": 1.005894269,
                    "change": -0.474644269,
                    "yhat_upper": 1.1773656205,
                    "stdChange": -2.7680674642,
                    "actual": 0.53125,
                    "yhat": 1.0880112353
                },
                "views": {
                    "ds": "2018-04-10",
                    "yhat_lower": 33.2664820953,
                    "change": -22.2664820953,
                    "yhat_upper": 63.5932631673,
                    "stdChange": -0.7342184468,
                    "actual": 11,
                    "yhat": 48.9133877677
                },
                "leads": {
                    "actual": 17
                },
                "cr": {
                    "actual": 1.4545454545454546
                },
                "cost": {
                    "actual": 8.5
                },
                "pixels": {
                    "actual": 16
                },
                "active24": {
                    "actual": 0.9375
                },
                "uniqueleads": {
                    "actual": 17
                },
                "total_optouts": {
                    "actual": 268
                },
                "uniquesales": {
                    "actual": 16
                },
                "releads": {
                    "actual": 1
                },
                "resubs": {
                    "actual": 1
                },
                "cq": {
                    "actual": 0.25
                }
            },
            "sections": {}
        },
        {
            "page": "SA",
            "metrics": {
                "uniqueleads": {
                    "actual": 0
                },
                "optout_24": {
                    "actual": 0
                },
                "leads": {
                    "actual": 0
                },
                "uniquesales": {
                    "actual": 0
                },
                "ecpa": {
                    "actual": 0
                },
                "releads": {
                    "actual": 0
                },
                "cr": {
                    "actual": 0
                },
                "cq": {
                    "actual": 0
                },
                "pixels": {
                    "actual": 0
                },
                "views": {
                    "actual": 2
                },
                "cost": {
                    "actual": 0
                },
                "total_optouts": {
                    "actual": 0
                },
                "paid_sales": {
                    "actual": 0
                },
                "sales": {
                    "actual": 0
                },
                "active24": {
                    "actual": 0
                },
                "resubs": {
                    "actual": 0
                },
                "pixels_ratio": {
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                }
            },
            "sections": {}
        },
        {
            "page": "SG",
            "metrics": {
                "ecpa": {
                    "change": -0.6979555241,
                    "yhat_upper": 7.0699385948,
                    "yhat": 5.563955964,
                    "ds": "2018-04-10",
                    "stdChange": -0.223561598,
                    "actual": 3.25,
                    "yhat_lower": 3.9479555241
                },
                "cr": {
                    "change": -0.0002037759,
                    "yhat_upper": 0.001798939,
                    "yhat": 0.0012218268,
                    "ds": "2018-04-10",
                    "stdChange": -0.1708283038,
                    "actual": 0.0004022930705018606,
                    "yhat_lower": 0.000606069
                },
                "optout_24": {
                    "change": -1.3693408831,
                    "yhat_upper": 11.7708502498,
                    "yhat": 6.8315006957,
                    "ds": "2018-04-10",
                    "stdChange": -0.1456511747,
                    "actual": 1,
                    "yhat_lower": 2.3693408831
                },
                "sales": {
                    "change": -5.203237465,
                    "yhat_upper": 33.0858628944,
                    "yhat": 21.5065100239,
                    "ds": "2018-04-10",
                    "stdChange": -0.2178670633,
                    "actual": 4,
                    "yhat_lower": 9.203237465
                },
                "leads": {
                    "change": -177.6659578821,
                    "yhat_upper": 359.5693821531,
                    "yhat": 303.390661844,
                    "ds": "2018-04-10",
                    "stdChange": -1.6465275229,
                    "actual": 74,
                    "yhat_lower": 251.6659578821
                },
                "releads": {
                    "actual": 1.1044776119402986
                },
                "views": {
                    "change": -1467.922709504,
                    "yhat_upper": 21809.3588218092,
                    "yhat": 16855.8212437655,
                    "ds": "2018-04-10",
                    "stdChange": -0.1411676423,
                    "actual": 9943,
                    "yhat_lower": 11410.922709504
                },
                "pixels_ratio": {
                    "actual": 0.5
                },
                "uniqueleads": {
                    "change": -170.4357097271,
                    "yhat_upper": 340.6869374713,
                    "yhat": 286.1012963826,
                    "ds": "2018-04-10",
                    "stdChange": -1.6506894247,
                    "actual": 67,
                    "yhat_lower": 237.4357097271
                },
                "uniquesales": {
                    "change": -8.3920211727,
                    "yhat_upper": 28.3812949873,
                    "yhat": 19.3836953748,
                    "ds": "2018-04-10",
                    "stdChange": -0.4939599693,
                    "actual": 3,
                    "yhat_lower": 11.3920211727
                },
                "active24": {
                    "actual": 0.75
                },
                "paid_sales": {
                    "change": -3.2995878923,
                    "yhat_upper": 13.6547745796,
                    "yhat": 9.3135432234,
                    "ds": "2018-04-10",
                    "stdChange": -0.3949149212,
                    "actual": 2,
                    "yhat_lower": 5.2995878923
                },
                "cost": {
                    "change": -52.9072777173,
                    "yhat_upper": 175.5947323444,
                    "yhat": 119.8779874166,
                    "ds": "2018-04-10",
                    "stdChange": -0.4823457514,
                    "actual": 13,
                    "yhat_lower": 65.9072777173
                },
                "total_optouts": {
                    "change": -44.2884164667,
                    "yhat_upper": 134.943224073,
                    "yhat": 87.96488981,
                    "ds": "2018-04-10",
                    "stdChange": -0.4995602344,
                    "actual": 2,
                    "yhat_lower": 46.2884164667
                },
                "pixels": {
                    "change": -3.0239776875,
                    "yhat_upper": 13.7184961513,
                    "yhat": 9.3135432234,
                    "ds": "2018-04-10",
                    "stdChange": -0.3478027794,
                    "actual": 2,
                    "yhat_lower": 5.0239776875
                },
                "firstbillings": {
                    "change": -0.9159752438,
                    "yhat_upper": 14.2762184411,
                    "yhat": 8.7056512762,
                    "ds": "2018-04-10",
                    "stdChange": -0.0806298974,
                    "actual": 2,
                    "yhat_lower": 2.9159752438
                },
                "resubs": {
                    "change": 0.0705876825,
                    "yhat_upper": 1.2627456509,
                    "yhat": 1.1035078756,
                    "ds": "2018-04-10",
                    "stdChange": 0.229644463,
                    "actual": 1.3333333333333333,
                    "yhat_lower": 0.9553675344
                },
                "cq": {
                    "actual": 0.5
                }
            },
            "sections": {}
        },
        {
            "page": "SK",
            "metrics": {
                "releads": {
                    "actual": 1
                },
                "leads": {
                    "actual": 1
                },
                "views": {
                    "actual": 21
                },
                "sales": {
                    "actual": 0
                },
                "optout_24": {
                    "actual": 0
                },
                "cq": {
                    "actual": 0
                },
                "total_optouts": {
                    "actual": 0,
                    "yhat_lower": 8.099498099,
                    "yhat": 18.6635347669,
                    "yhat_upper": 28.8438403408,
                    "change": -8.099498099,
                    "stdChange": -0.3904437174,
                    "ds": "2018-04-10"
                },
                "pixels_ratio": {
                    "actual": 0
                },
                "active24": {
                    "actual": 0
                },
                "paid_sales": {
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                },
                "uniquesales": {
                    "actual": 0
                },
                "uniqueleads": {
                    "actual": 1
                },
                "pixels": {
                    "actual": 0
                },
                "cr": {
                    "actual": 0
                },
                "ecpa": {
                    "actual": 0
                },
                "cost": {
                    "actual": 0
                },
                "resubs": {
                    "actual": 0
                }
            },
            "sections": {}
        },
        {
            "page": "TH",
            "metrics": {
                "firstbillings": {
                    "stdChange": -1.3323485949,
                    "yhat_lower": 225.4251438039,
                    "yhat_upper": 368.3495590351,
                    "yhat": 297.0831119645,
                    "actual": 35,
                    "change": -190.4251438039,
                    "ds": "2018-04-10"
                },
                "total_optouts": {
                    "actual": 370
                },
                "sales": {
                    "stdChange": -0.7969542087,
                    "yhat_lower": 827.8158972518,
                    "yhat_upper": 1500.1454883692,
                    "yhat": 1173.8139972862,
                    "actual": 292,
                    "change": -535.8158972518,
                    "ds": "2018-04-10"
                },
                "resubs": {
                    "stdChange": -0.7755284637,
                    "yhat_lower": 1.0078229865,
                    "yhat_upper": 1.0179102843,
                    "yhat": 1.0129791017,
                    "actual": 1,
                    "change": -0.0078229865,
                    "ds": "2018-04-10"
                },
                "cq": {
                    "stdChange": -1.3021650296,
                    "yhat_lower": 0.1939711656,
                    "yhat_upper": 0.2508826555,
                    "yhat": 0.2214155619,
                    "actual": 0.11986301369863013,
                    "change": -0.0741081519,
                    "ds": "2018-04-10"
                },
                "uniquesales": {
                    "stdChange": -0.7171641346,
                    "yhat_lower": 802.4692305518,
                    "yhat_upper": 1514.2577959526,
                    "yhat": 1149.7512370496,
                    "actual": 292,
                    "change": -510.4692305518,
                    "ds": "2018-04-10"
                },
                "uniqueleads": {
                    "stdChange": -0.6421480781,
                    "yhat_lower": 777.2339677325,
                    "yhat_upper": 1525.0894610245,
                    "yhat": 1150.3947372158,
                    "actual": 297,
                    "change": -480.2339677325,
                    "ds": "2018-04-10"
                },
                "pixels_ratio": {
                    "stdChange": 0.5949890489,
                    "yhat_lower": 0.9563281168,
                    "yhat_upper": 0.9772673895,
                    "yhat": 0.9675663544,
                    "actual": 0.9897260273972602,
                    "change": 0.0124586379,
                    "ds": "2018-04-10"
                },
                "cr": {
                    "stdChange": -0.547461979,
                    "yhat_lower": 0.0012870979,
                    "yhat_upper": 0.0026851672,
                    "yhat": 0.0019909046,
                    "actual": 0.0005217080578881544,
                    "change": -0.0007653898,
                    "ds": "2018-04-10"
                },
                "cost": {
                    "stdChange": -0.929405723,
                    "yhat_lower": 516.0082165763,
                    "yhat_upper": 946.0230170814,
                    "yhat": 730.1687871649,
                    "actual": 116.35,
                    "change": -399.6582165763,
                    "ds": "2018-04-10"
                },
                "optout_24": {
                    "stdChange": -1.2475471363,
                    "yhat_lower": 250.1968076358,
                    "yhat_upper": 412.2722929985,
                    "yhat": 330.4291648909,
                    "actual": 48,
                    "change": -202.1968076358,
                    "ds": "2018-04-10"
                },
                "releads": {
                    "actual": 1
                },
                "paid_sales": {
                    "stdChange": -0.7298548568,
                    "yhat_lower": 801.6753658473,
                    "yhat_upper": 1504.1100500069,
                    "yhat": 1145.6330757059,
                    "actual": 289,
                    "change": -512.6753658473,
                    "ds": "2018-04-10"
                },
                "active24": {
                    "stdChange": 0.8508832737,
                    "yhat_lower": 0.7526632359,
                    "yhat_upper": 0.7974814066,
                    "yhat": 0.7752115287,
                    "actual": 0.8356164383561644,
                    "change": 0.0381350318,
                    "ds": "2018-04-10"
                },
                "leads": {
                    "stdChange": -0.60926387,
                    "yhat_lower": 750.7415649877,
                    "yhat_upper": 1495.4789232328,
                    "yhat": 1141.8638662583,
                    "actual": 297,
                    "change": -453.7415649877,
                    "ds": "2018-04-10"
                },
                "views": {
                    "actual": 559700
                },
                "ecpa": {
                    "stdChange": -4.9970201724,
                    "yhat_lower": 0.5897961262,
                    "yhat_upper": 0.6280863904,
                    "yhat": 0.6087217127,
                    "actual": 0.398458904109589,
                    "change": -0.1913372221,
                    "ds": "2018-04-10"
                },
                "pixels": {
                    "stdChange": -0.7429286603,
                    "yhat_lower": 801.1557335229,
                    "yhat_upper": 1490.5297756258,
                    "yhat": 1145.6330757059,
                    "actual": 289,
                    "change": -512.1557335229,
                    "ds": "2018-04-10"
                }
            },
            "sections": {}
        },
        {
            "page": "TR",
            "metrics": {
                "leads": {
                    "ds": "2018-04-10",
                    "change": -929.7789178138,
                    "yhat_upper": 3065.0021061379,
                    "stdChange": -0.5468569798,
                    "actual": 435,
                    "yhat": 2213.8654011507,
                    "yhat_lower": 1364.7789178138
                },
                "cq": {
                    "ds": "2018-04-10",
                    "change": 0.0214933,
                    "yhat_upper": 0.2780458706,
                    "stdChange": 0.8085539688,
                    "actual": 0.2995391705069124,
                    "yhat": 0.2646886725,
                    "yhat_lower": 0.2514634768
                },
                "optout_24": {
                    "ds": "2018-04-10",
                    "change": -204.992610457,
                    "yhat_upper": 681.1396625719,
                    "stdChange": -0.549361463,
                    "actual": 103,
                    "yhat": 502.8087196111,
                    "yhat_lower": 307.992610457
                },
                "uniqueleads": {
                    "ds": "2018-04-10",
                    "change": -904.703697782,
                    "yhat_upper": 3022.6859901066,
                    "stdChange": -0.5359675287,
                    "actual": 430,
                    "yhat": 2181.1358352213,
                    "yhat_lower": 1334.703697782
                },
                "cost": {
                    "ds": "2018-04-10",
                    "change": -516.5037933973,
                    "yhat_upper": 2738.0470829495,
                    "stdChange": -0.2506699711,
                    "actual": 161.05,
                    "yhat": 1678.3792159491,
                    "yhat_lower": 677.5537933973
                },
                "active24": {
                    "actual": 0.7626728110599078
                },
                "paid_sales": {
                    "ds": "2018-04-10",
                    "change": -127.6110930254,
                    "yhat_upper": 1059.5782139917,
                    "stdChange": -0.1589244313,
                    "actual": 129,
                    "yhat": 633.8748864568,
                    "yhat_lower": 256.6110930254
                },
                "resubs": {
                    "actual": 1.0187793427230047
                },
                "total_optouts": {
                    "ds": "2018-04-10",
                    "change": -531.1455313814,
                    "yhat_upper": 3703.0669116543,
                    "stdChange": -0.486432028,
                    "actual": 2080,
                    "yhat": 3183.9671728795,
                    "yhat_lower": 2611.1455313814
                },
                "views": {
                    "ds": "2018-04-10",
                    "change": -325015.0574822591,
                    "yhat_upper": 621536.4364191719,
                    "stdChange": -1.7406791983,
                    "actual": 109804,
                    "yhat": 528548.4563107612,
                    "yhat_lower": 434819.0574822591
                },
                "cr": {
                    "actual": 0.003952497176787731
                },
                "releads": {
                    "ds": "2018-04-10",
                    "change": -0.0080031229,
                    "yhat_upper": 1.0240997053,
                    "stdChange": -1.790938534,
                    "actual": 1.0116279069767442,
                    "yhat": 1.0218710458,
                    "yhat_lower": 1.0196310299
                },
                "firstbillings": {
                    "ds": "2018-04-10",
                    "change": -235.3272574617,
                    "yhat_upper": 791.8708565663,
                    "stdChange": -0.5517073939,
                    "actual": 130,
                    "yhat": 587.7550539309,
                    "yhat_lower": 365.3272574617
                },
                "pixels_ratio": {
                    "actual": 0.29723502304147464
                },
                "sales": {
                    "ds": "2018-04-10",
                    "change": -926.8972604621,
                    "yhat_upper": 3128.1680302632,
                    "stdChange": -0.5244794835,
                    "actual": 434,
                    "yhat": 2221.9563566479,
                    "yhat_lower": 1360.8972604621
                },
                "pixels": {
                    "ds": "2018-04-10",
                    "change": -100.0668384926,
                    "yhat_upper": 1025.6455379395,
                    "stdChange": -0.1256207812,
                    "actual": 129,
                    "yhat": 633.8748864568,
                    "yhat_lower": 229.0668384926
                },
                "uniquesales": {
                    "ds": "2018-04-10",
                    "change": -838.6960132987,
                    "yhat_upper": 2916.9257774778,
                    "stdChange": -0.5076146378,
                    "actual": 426,
                    "yhat": 2163.0555640813,
                    "yhat_lower": 1264.6960132987
                },
                "ecpa": {
                    "ds": "2018-04-10",
                    "change": -0.2299272671,
                    "yhat_upper": 0.9249489045,
                    "stdChange": -0.7097863746,
                    "actual": 0.3710829493087558,
                    "yhat": 0.7533442794,
                    "yhat_lower": 0.6010102164
                }
            },
            "sections": {}
        },
        {
            "page": "UK",
            "metrics": {
                "uniquesales": {
                    "actual": 0
                },
                "cq": {
                    "actual": 0
                },
                "paid_sales": {
                    "actual": 0
                },
                "views": {
                    "actual": 1,
                    "stdChange": -0.1470769831,
                    "change": -0.2870470443,
                    "ds": "2018-04-10",
                    "yhat_upper": 3.2387259429,
                    "yhat": 2.1687490379,
                    "yhat_lower": 1.2870470443
                },
                "leads": {
                    "actual": 0
                },
                "pixels": {
                    "actual": 0
                },
                "sales": {
                    "actual": 0
                },
                "resubs": {
                    "actual": 0
                },
                "ecpa": {
                    "actual": 0
                },
                "optout_24": {
                    "actual": 0
                },
                "uniqueleads": {
                    "actual": 0
                },
                "releads": {
                    "actual": 0
                },
                "firstbillings": {
                    "actual": 0
                },
                "active24": {
                    "actual": 0
                },
                "cost": {
                    "actual": 0
                },
                "pixels_ratio": {
                    "actual": 0
                },
                "total_optouts": {
                    "actual": 1
                },
                "cr": {
                    "actual": 0
                }
            },
            "sections": {}
        },
        {
            "page": "VN",
            "metrics": {
                "active24": {
                    "change": 0.4786494098,
                    "yhat_lower": -0.1431927345,
                    "actual": 0.9925558312655087,
                    "yhat": 0.2063321316,
                    "stdChange": 0.7284279785,
                    "ds": "2018-04-10",
                    "yhat_upper": 0.5139064214
                },
                "sales": {
                    "change": 389.4630214453,
                    "yhat_lower": 3.2001143308,
                    "actual": 403,
                    "yhat": 8.4322723472,
                    "stdChange": 37.677095588,
                    "ds": "2018-04-10",
                    "yhat_upper": 13.5369785547
                },
                "uniqueleads": {
                    "change": -0.9771773577,
                    "yhat_lower": 4.9771773577,
                    "actual": 4,
                    "yhat": 22.3438224709,
                    "stdChange": -0.0283846885,
                    "ds": "2018-04-10",
                    "yhat_upper": 39.4033911941
                },
                "optout_24": {
                    "actual": 3
                },
                "cost": {
                    "actual": 0
                },
                "views": {
                    "actual": 70659
                },
                "uniquesales": {
                    "actual": 3
                },
                "total_optouts": {
                    "change": -2.7173317316,
                    "yhat_lower": 3.7173317316,
                    "actual": 1,
                    "yhat": 8.0064507436,
                    "stdChange": -0.3178686366,
                    "ds": "2018-04-10",
                    "yhat_upper": 12.2659314328
                },
                "ecpa": {
                    "actual": 0
                },
                "cq": {
                    "change": -0.0388829646,
                    "yhat_lower": 0.0388829646,
                    "actual": 0,
                    "yhat": 0.1400927777,
                    "stdChange": -0.1879826321,
                    "ds": "2018-04-10",
                    "yhat_upper": 0.2457263529
                },
                "cr": {
                    "change": 0.005627148,
                    "yhat_lower": 0.0000170852,
                    "actual": 0.0057034489590851835,
                    "yhat": 0.0000452355,
                    "stdChange": 95.0278421878,
                    "ds": "2018-04-10",
                    "yhat_upper": 0.000076301
                },
                "releads": {
                    "actual": 1.75
                },
                "resubs": {
                    "change": 127.6488258356,
                    "yhat_lower": 0.8539748908,
                    "actual": 134.33333333333334,
                    "yhat": 3.5114051043,
                    "stdChange": 21.893167304,
                    "ds": "2018-04-10",
                    "yhat_upper": 6.6845074978
                },
                "pixels": {
                    "actual": 4
                },
                "leads": {
                    "change": -19.4876024913,
                    "yhat_lower": 26.4876024913,
                    "actual": 7,
                    "yhat": 42.0100162569,
                    "stdChange": -0.5964031367,
                    "ds": "2018-04-10",
                    "yhat_upper": 59.1628204616
                },
                "pixels_ratio": {
                    "change": -0.1271447487,
                    "yhat_lower": 0.137070307,
                    "actual": 0.009925558312655087,
                    "yhat": 0.4560074824,
                    "stdChange": -0.1871685923,
                    "ds": "2018-04-10",
                    "yhat_upper": 0.8163763122
                },
                "firstbillings": {
                    "actual": 0
                },
                "paid_sales": {
                    "actual": 4
                }
            },
            "sections": {}
        },
        {
            "page": "ZA",
            "metrics": {
                "paid_sales": {
                    "yhat_upper": 398.7601686798,
                    "change": -186.4500445816,
                    "actual": 49,
                    "stdChange": -1.1416931168,
                    "ds": "2018-04-10",
                    "yhat_lower": 235.4500445816,
                    "yhat": 319.0513743952
                },
                "cq": {
                    "yhat_upper": 0.0751224327,
                    "change": -0.00429172,
                    "actual": 0.017543859649122806,
                    "stdChange": -0.0805399419,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.0218355797,
                    "yhat": 0.0481224859
                },
                "views": {
                    "yhat_upper": 186328.6989224784,
                    "change": -92561.7096059739,
                    "actual": 29304,
                    "stdChange": -1.4358891914,
                    "ds": "2018-04-10",
                    "yhat_lower": 121865.7096059739,
                    "yhat": 153091.3055364657
                },
                "uniqueleads": {
                    "yhat_upper": 2393.6285299583,
                    "change": -695.9000251961,
                    "actual": 465,
                    "stdChange": -0.5645201052,
                    "ds": "2018-04-10",
                    "yhat_lower": 1160.9000251961,
                    "yhat": 1756.4148735186
                },
                "pixels": {
                    "yhat_upper": 402.4187838158,
                    "change": -191.1676519962,
                    "actual": 49,
                    "stdChange": -1.1782207609,
                    "ds": "2018-04-10",
                    "yhat_lower": 240.1676519962,
                    "yhat": 319.0513743952
                },
                "uniquesales": {
                    "yhat_upper": 1922.9913866689,
                    "change": -133.7341027266,
                    "actual": 337,
                    "stdChange": -0.0920870594,
                    "ds": "2018-04-10",
                    "yhat_lower": 470.7341027266,
                    "yhat": 1241.6324834446
                },
                "releads": {
                    "actual": 1.6709677419354838
                },
                "ecpa": {
                    "yhat_upper": 1.0644963266,
                    "change": -0.285987584,
                    "actual": 0.32894736842105265,
                    "stdChange": -0.6361480335,
                    "ds": "2018-04-10",
                    "yhat_lower": 0.6149349525,
                    "yhat": 0.8433678625
                },
                "cost": {
                    "yhat_upper": 1575.741799773,
                    "change": -392.3659200797,
                    "actual": 112.5,
                    "stdChange": -0.3663971965,
                    "ds": "2018-04-10",
                    "yhat_lower": 504.8659200797,
                    "yhat": 1044.1973962273
                },
                "resubs": {
                    "yhat_upper": 1.1365998091,
                    "change": -0.0622572595,
                    "actual": 1.0148367952522255,
                    "stdChange": -1.0462393114,
                    "ds": "2018-04-10",
                    "yhat_lower": 1.0770940547,
                    "yhat": 1.1067157908
                },
                "optout_24": {
                    "yhat_upper": 45.2807559372,
                    "change": -0.1516514814,
                    "actual": 8,
                    "stdChange": -0.0040844368,
                    "ds": "2018-04-10",
                    "yhat_lower": 8.1516514814,
                    "yhat": 26.8939468182
                },
                "total_optouts": {
                    "actual": 110
                },
                "leads": {
                    "yhat_upper": 4092.5424717025,
                    "change": -579.9811542126,
                    "actual": 777,
                    "stdChange": -0.21201541,
                    "ds": "2018-04-10",
                    "yhat_lower": 1356.9811542126,
                    "yhat": 2727.8450241063
                },
                "active24": {
                    "actual": 0.9766081871345029
                },
                "pixels_ratio": {
                    "actual": 0.14327485380116958
                },
                "sales": {
                    "yhat_upper": 2156.8425085628,
                    "change": -500.1517370491,
                    "actual": 342,
                    "stdChange": -0.3804329869,
                    "ds": "2018-04-10",
                    "yhat_lower": 842.1517370491,
                    "yhat": 1513.5626163373
                },
                "cr": {
                    "actual": 0.01167076167076167
                },
                "firstbillings": {
                    "actual": 6
                }
            },
            "sections": {}
        }
    ];
    /*return await Bluebird.map(R.toPairs(aggregatedDataPerCountry), ([country, stats]) => {
        return new Promise((resolve, reject) => {
            detectAnomalies(props, country, stats).then((propsAnomalies) => {
                let anomaliesWithData = R.pipe(
                    R.toPairs,
                    R.map(([prop, anomaly]) => [
                        prop,
                        R.merge(
                            anomaly,
                            {
                                "actual":
                                    todayDataPerCountry[country] != undefined &&
                                    todayDataPerCountry[country][prop] != undefined ? todayDataPerCountry[country][prop] : null
                            }
                        )
                    ]),
                    R.fromPairs
                )(propsAnomalies);
                resolve({
                    page: country,
                    metrics: anomaliesWithData,
                    sections: {}
                });
            }).catch(reject)
        })
    });*/
}
