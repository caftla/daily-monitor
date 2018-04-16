const R = require('ramda');
const detectAnomalies = require('../anomaly-detection/index');

export default async function (data) {
    let trace = (x, y) => {
        console.log(x);
        return y
    };
    let trace_ = x => trace(x, x);

    // let data = _data.filter(d => d.page == 'GR' || d.page == 'QA');

    return [{
        "country": "AE",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 124.8342757027234,
                "change": -0.9863721793094504,
                "yhat_lower": 78.55250388851451,
                "actual": 32,
                "severity": 1,
                "yhat_upper": 172.66938760649992
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 78.79262026990929,
                "change": -0.9083150526914067,
                "yhat_lower": 47.631069742142984,
                "actual": 20,
                "severity": 1,
                "yhat_upper": 112.35819288702788
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 989.5462385731944,
                "change": -0.2348544969145269,
                "yhat_lower": 156.8494099536329,
                "actual": 607,
                "severity": 1,
                "yhat_upper": 1785.7142756428707
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 2949.5375583332066,
                "change": -0.7020763169786223,
                "yhat_lower": 1315.5503169677634,
                "actual": 627,
                "severity": 1,
                "yhat_upper": 4623.6487418344805
            },
            "releads": {"actual": 1.0573355817875212},
            "cr": {"actual": 0.0014687657777573782},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 25.27668898054539,
                "change": -0.6824015293569954,
                "yhat_lower": 10.604535246914747,
                "actual": 6,
                "severity": 1,
                "yhat_upper": 38.85284383249073
            },
            "pixels_ratio": {"actual": 0.625},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 120.68938902557193,
                "change": -0.9251897906360574,
                "yhat_lower": 73.4846013537247,
                "actual": 32,
                "severity": 1,
                "yhat_upper": 169.34535330235892
            },
            "cq": {"actual": 0.09375},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 1016.1178429405057,
                "change": -0.2551365936089175,
                "yhat_lower": 247.61184969773328,
                "actual": 608,
                "severity": 1,
                "yhat_upper": 1847.2171323726418
            },
            "resubs": {"actual": 1},
            "ecpa": {
                "ds": "2018-04-16",
                "yhat": 2.2950614373274827,
                "change": -3.102572879195264,
                "yhat_lower": 2.042999960331057,
                "actual": 0.5625,
                "severity": 5,
                "yhat_upper": 2.6014272736571726
            },
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 49.416526241229306,
                "change": -0.9823052909535388,
                "yhat_lower": 26.20382239410733,
                "actual": 3,
                "severity": 1,
                "yhat_upper": 73.45647049515958
            },
            "active24": {"actual": 0.8125},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 3098.4165704774796,
                "change": -1.1309903884185177,
                "yhat_lower": 1981.2211656363397,
                "actual": 593,
                "severity": 1,
                "yhat_upper": 4196.462423328056
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 278.63833656574735,
                "change": -1.0834927587540704,
                "yhat_lower": 155.6517970532059,
                "actual": 18,
                "severity": 1,
                "yhat_upper": 396.20563044057485
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 62701.95093147207,
                "change": -0.523994161785824,
                "yhat_lower": 24583.43468856701,
                "actual": 21787,
                "severity": 1,
                "yhat_upper": 102666.27208513238
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 78.79262026990929,
                "change": -0.9446794788797834,
                "yhat_lower": 46.77673420691601,
                "actual": 20,
                "severity": 1,
                "yhat_upper": 109.0122559731203
            }
        }
    }, {
        "country": "AU",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 7},
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 7},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {"actual": 0},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "BH",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 2.8402328133422343,
                "change": -0.16707300507479303,
                "yhat_lower": -2.5874079353714765,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 8.427135153252705
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 2.061044801751285,
                "change": -0.16610940601147586,
                "yhat_lower": -1.1208855509989297,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 5.266740696234663
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 6.528588665508543,
                "change": 0.23986948268712055,
                "yhat_lower": -0.4845683630795098,
                "actual": 10,
                "severity": 1,
                "yhat_upper": 13.987515770355149
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 23.805096720717223,
                "change": -0.3716545458714269,
                "yhat_lower": 0.07626997444008028,
                "actual": 6,
                "severity": 1,
                "yhat_upper": 47.98392217056541
            },
            "releads": {"actual": 1},
            "cr": {"actual": 0.00002328234499778818},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 1},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 3.204895760426054,
                "change": -0.2456341958883818,
                "yhat_lower": -1.2371876160838253,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 7.739151172787318
            },
            "cq": {"actual": 0},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 6.5229336994203155,
                "change": 0.36149753786521904,
                "yhat_lower": -0.6042482000080395,
                "actual": 12,
                "severity": 1,
                "yhat_upper": 14.546799115345344
            },
            "resubs": {"actual": 1},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 1},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 35.09646564325277,
                "change": -1.6733753037366117,
                "yhat_lower": 26.314513806435805,
                "actual": 6,
                "severity": 1,
                "yhat_upper": 43.70240376649496
            },
            "cost": {"actual": 0},
            "views": {
                "ds": "2018-04-16",
                "yhat": 72920.45477872694,
                "change": -1.1688132322820048,
                "yhat_lower": 60536.351579125505,
                "actual": 42951,
                "severity": 1,
                "yhat_upper": 86177.27859037624
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 2.061044801751285,
                "change": -0.17380912646902122,
                "yhat_lower": -1.1334510906110764,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 4.971204190194329
            }
        }
    }, {
        "country": "DE",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 4.537204086051967,
                "change": -0.0783934754053782,
                "yhat_lower": 1.2414881851717643,
                "actual": 4,
                "severity": 1,
                "yhat_upper": 8.09415141095742
            },
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 9.211219254939884,
                "change": -0.34944561055041146,
                "yhat_lower": 4.633515697542595,
                "actual": 6,
                "severity": 1,
                "yhat_upper": 13.822983694813747
            },
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {
                "ds": "2018-04-16",
                "yhat": 345.5738104660686,
                "change": -0.26227492963348875,
                "yhat_lower": -61.7760393484427,
                "actual": 132,
                "severity": 1,
                "yhat_upper": 752.5366773283795
            },
            "pixels": {"actual": 0}
        }
    }, {
        "country": "EE",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 0},
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 0},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {
                "ds": "2018-04-16",
                "yhat": 214.36917340070065,
                "change": -0.05455739699957592,
                "yhat_lower": -86.51243335711622,
                "actual": 180,
                "severity": 1,
                "yhat_upper": 543.4511516168479
            },
            "pixels": {"actual": 0}
        }
    }, {
        "country": "EG",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 0},
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 0},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {"actual": 2},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "ES",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 875.5002713121272,
                "change": -1.5887143815733442,
                "yhat_lower": 736.2242626072765,
                "actual": 444,
                "severity": 1,
                "yhat_upper": 1007.8276900810063
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 164.87041621354305,
                "change": -1.7561228214491489,
                "yhat_lower": 143.07663300665087,
                "actual": 85,
                "severity": 1,
                "yhat_upper": 188.55774357477966
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 40.01572015121254,
                "change": -0.2028834266694831,
                "yhat_lower": -32.65996884231521,
                "actual": 11,
                "severity": 1,
                "yhat_upper": 110.35674093793696
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 8000.351235444771,
                "change": -1.5035383825202389,
                "yhat_lower": 6505.466265624953,
                "actual": 3576,
                "severity": 1,
                "yhat_upper": 9448.092331498077
            },
            "releads": {
                "ds": "2018-04-16",
                "yhat": 2.899643884126909,
                "change": -0.8002940680330156,
                "yhat_lower": 2.51586798988846,
                "actual": 2.2748091603053435,
                "severity": 5,
                "yhat_upper": 3.296624400288079
            },
            "cr": {"actual": 0.06774488861763808},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 21.34562649870856,
                "change": -0.39441081742126005,
                "yhat_lower": 8.001005994630454,
                "actual": 11,
                "severity": 1,
                "yhat_upper": 34.2315910641537
            },
            "pixels_ratio": {"actual": 0.19144144144144143},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 865.4900730747214,
                "change": -1.877994072581371,
                "yhat_lower": 751.477182648716,
                "actual": 443,
                "severity": 1,
                "yhat_upper": 976.4459827333689
            },
            "cq": {"actual": 0.7567567567567568},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 38.66253324581003,
                "change": -0.18117161117552924,
                "yhat_lower": -43.74400315046442,
                "actual": 11,
                "severity": 1,
                "yhat_upper": 108.94290550107377
            },
            "resubs": {"actual": 1.002257336343115},
            "ecpa": {
                "ds": "2018-04-16",
                "yhat": 1.4090029150611068,
                "change": -1.9035255252826184,
                "yhat_lower": 1.2117262982813948,
                "actual": 0.6463963963963963,
                "severity": 5,
                "yhat_upper": 1.6123547682103627
            },
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 798.6894766978443,
                "change": -1.8948484892435025,
                "yhat_lower": 671.4548447838647,
                "actual": 336,
                "severity": 1,
                "yhat_upper": 915.6376801527063
            },
            "active24": {"actual": 0.9752252252252253},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 2803.472720159286,
                "change": -1.3920945602100343,
                "yhat_lower": 2357.1572158744907,
                "actual": 1572,
                "severity": 1,
                "yhat_upper": 3241.775800960755
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 1154.0929134948012,
                "change": -2.689620113314512,
                "yhat_lower": 994.7322238929112,
                "actual": 287,
                "severity": 1,
                "yhat_upper": 1317.1171247205052
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 18235.920133799802,
                "change": -3.0469006988317093,
                "yhat_lower": 16281.308391812943,
                "actual": 6554,
                "severity": 1,
                "yhat_upper": 20115.342148895696
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 164.87041621354305,
                "change": -1.7504231751485317,
                "yhat_lower": 141.2313589913073,
                "actual": 85,
                "severity": 1,
                "yhat_upper": 186.8605630303624
            }
        }
    }, {
        "country": "FR",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 1},
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 1},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {"actual": 1},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "GH",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 1246.6382282096329,
                "change": -3.707492990104227,
                "yhat_lower": 1119.7036602908286,
                "actual": 321,
                "severity": 1,
                "yhat_upper": 1369.3705458871816
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 495.3318275409505,
                "change": -2.807792084927381,
                "yhat_lower": 433.2166254270724,
                "actual": 136,
                "severity": 1,
                "yhat_upper": 561.1932763585619
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 315.5402932534931,
                "change": -3.299542265733084,
                "yhat_lower": 274.8222208694286,
                "actual": 65,
                "severity": 1,
                "yhat_upper": 350.754054158986
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 5104.183414991297,
                "change": -4.956184017342425,
                "yhat_lower": 4721.976276813156,
                "actual": 1276,
                "severity": 1,
                "yhat_upper": 5494.381700339787
            },
            "releads": {"actual": 1.0476190476190477},
            "cr": {"actual": 0.002717115286947689},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 77.00195146228687,
                "change": -2.8351723525412997,
                "yhat_lower": 65.8091034725827,
                "actual": 14,
                "severity": 1,
                "yhat_upper": 88.03066309163557
            },
            "pixels_ratio": {"actual": 0.4236760124610592},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 1062.8534314218537,
                "change": -3.372968218094547,
                "yhat_lower": 949.9842298437748,
                "actual": 276,
                "severity": 1,
                "yhat_upper": 1183.2664253891458
            },
            "cq": {"actual": 0.205607476635514},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 361.8923707959655,
                "change": -3.7204756093603453,
                "yhat_lower": 323.36987896803225,
                "actual": 72,
                "severity": 1,
                "yhat_upper": 401.2879736510414
            },
            "resubs": {"actual": 1.1630434782608696},
            "ecpa": {"actual": 0.0928348909657321},
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 307.68363910156836,
                "change": -2.9245917164461788,
                "yhat_lower": 267.2957217651802,
                "actual": 66,
                "severity": 1,
                "yhat_upper": 349.93414193934746
            },
            "active24": {"actual": 0.956386292834891},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 4886.365280972298,
                "change": -4.912520653810408,
                "yhat_lower": 4516.529741945081,
                "actual": 1218,
                "severity": 1,
                "yhat_upper": 5263.2676265231175
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 222.75756163345127,
                "change": -3.671378083172255,
                "yhat_lower": 196.64328739780578,
                "actual": 29.8,
                "severity": 1,
                "yhat_upper": 249.20054444465458
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 453243.2915188037,
                "change": -1.9006384151651643,
                "yhat_lower": 363026.2829078622,
                "actual": 118140,
                "severity": 1,
                "yhat_upper": 539337.1944652735
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 495.3318275409505,
                "change": -2.888422150142933,
                "yhat_lower": 434.49943753210886,
                "actual": 136,
                "severity": 1,
                "yhat_upper": 558.9036308468461
            }
        }
    }, {
        "country": "GR",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 341.4742255676533,
                "change": -1.0996344655934247,
                "yhat_lower": 194.53671870989305,
                "actual": 9,
                "severity": 1,
                "yhat_upper": 496.88648671960294
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 335.8345096368621,
                "change": -1.1184087388087716,
                "yhat_lower": 193.01767689055993,
                "actual": 9,
                "severity": 1,
                "yhat_upper": 485.2493970977686
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 83.74521328275766,
                "change": -0.9762255054980337,
                "yhat_lower": 47.16193555229196,
                "actual": 14,
                "severity": 1,
                "yhat_upper": 118.60568793323007
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 763.2977706243844,
                "change": -1.3084199719222598,
                "yhat_lower": 487.4873467630839,
                "actual": 25,
                "severity": 1,
                "yhat_upper": 1051.7540092015342
            },
            "releads": {"actual": 1.3888888888888888},
            "cr": {"actual": 0},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 25.950898485584844,
                "change": -0.8217306669798657,
                "yhat_lower": 11.200539558301443,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 41.56437954651524
            },
            "pixels_ratio": {"actual": 1},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 347.87794829180126,
                "change": -1.0405102727286013,
                "yhat_lower": 184.37106669925083,
                "actual": 9,
                "severity": 1,
                "yhat_upper": 510.0554517300093
            },
            "cq": {"actual": 0.1111111111111111},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 83.74521328275766,
                "change": -0.9493799090908732,
                "yhat_lower": 45.91253548252207,
                "actual": 14,
                "severity": 1,
                "yhat_upper": 119.37650139849107
            },
            "resubs": {"actual": 1},
            "ecpa": {
                "ds": "2018-04-16",
                "yhat": 1.6043350713095528,
                "change": -15.756150318858822,
                "yhat_lower": 1.5617607934304354,
                "actual": 0.2777777777777778,
                "severity": 5,
                "yhat_upper": 1.6459537762775205
            },
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 58.18872164335448,
                "change": -1.0537282517005757,
                "yhat_lower": 30.16885801932679,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 84.44160011489039
            },
            "active24": {"actual": 0.8888888888888888},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 508.5354233960731,
                "change": -1.2391838004795195,
                "yhat_lower": 316.18462454213017,
                "actual": 18,
                "severity": 1,
                "yhat_upper": 712.038268857246
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 534.0998541123791,
                "change": -1.1649153375337116,
                "yhat_lower": 305.4968118887181,
                "actual": 2.5,
                "severity": 1,
                "yhat_upper": 761.8388626662882
            },
            "views": {"actual": 0},
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 335.8345096368621,
                "change": -1.0220142218247106,
                "yhat_lower": 184.13388891220131,
                "actual": 9,
                "severity": 1,
                "yhat_upper": 503.92837186306446
            }
        }
    }, {
        "country": "HK",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 0},
            "leads": {
                "ds": "2018-04-16",
                "yhat": 20.494669326187218,
                "change": -0.7618474341494713,
                "yhat_lower": 9.853492678040713,
                "actual": 4,
                "severity": 1,
                "yhat_upper": 31.50437523906412
            },
            "releads": {"actual": 1},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 0},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 20.048482404417655,
                "change": -0.7544601430531903,
                "yhat_lower": 9.307668423760587,
                "actual": 4,
                "severity": 1,
                "yhat_upper": 30.57914651599192
            },
            "cost": {"actual": 0},
            "views": {
                "ds": "2018-04-16",
                "yhat": 2177.417669735678,
                "change": -0.790037622939105,
                "yhat_lower": 997.5071923535855,
                "actual": 325,
                "severity": 1,
                "yhat_upper": 3342.228020767171
            },
            "pixels": {"actual": 0}
        }
    }, {
        "country": "ID",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 603.3067069616575,
                "change": -1.1595751481855985,
                "yhat_lower": 412.41771482862583,
                "actual": 175,
                "severity": 1,
                "yhat_upper": 781.7829152055348
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 93.18215775276857,
                "change": -1.3164830817857704,
                "yhat_lower": 65.5215858400476,
                "actual": 22,
                "severity": 1,
                "yhat_upper": 119.59152318873885
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 384.77747020286864,
                "change": 1.1765396329753062,
                "yhat_lower": -749.3140316318211,
                "actual": 3045,
                "severity": 1,
                "yhat_upper": 1511.7424217490106
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 603.2280218700914,
                "change": -1.1696539452794656,
                "yhat_lower": 425.57811831466154,
                "actual": 175,
                "severity": 1,
                "yhat_upper": 791.6932616853572
            },
            "releads": {"actual": 1},
            "cr": {"actual": 0.0003711865880740931},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 70.50418801635726,
                "change": -1.5991099181740136,
                "yhat_lower": 53.08204827399456,
                "actual": 13,
                "severity": 1,
                "yhat_upper": 89.04217044121866
            },
            "pixels_ratio": {"actual": 0.12571428571428572},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 601.769462852606,
                "change": -1.1596589190788935,
                "yhat_lower": 417.7625161864591,
                "actual": 175,
                "severity": 1,
                "yhat_upper": 785.7754343224099
            },
            "cq": {"actual": 0.06857142857142857},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 403.72275321976963,
                "change": 1.1559492861367702,
                "yhat_lower": -802.2524751039283,
                "actual": 3140,
                "severity": 1,
                "yhat_upper": 1564.8732107684868
            },
            "resubs": {"actual": 1},
            "ecpa": {"actual": 0.014857142857142855},
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 46.840274760813486,
                "change": -0.8541625615348368,
                "yhat_lower": 27.22902976128115,
                "actual": 12,
                "severity": 1,
                "yhat_upper": 68.01784014675312
            },
            "active24": {"actual": 0.9257142857142857},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 601.769462852606,
                "change": -1.202304886803438,
                "yhat_lower": 434.24227003906043,
                "actual": 175,
                "severity": 1,
                "yhat_upper": 789.201704652402
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 18.62108658678308,
                "change": -1.3680120357674812,
                "yhat_lower": 12.855955100422277,
                "actual": 2.5999999999999996,
                "severity": 1,
                "yhat_upper": 24.567172668617822
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 1396678.0658276659,
                "change": -1.5594932352486568,
                "yhat_lower": 1109396.201977663,
                "actual": 471461,
                "severity": 1,
                "yhat_upper": 1702676.7914123088
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 93.18215775276857,
                "change": -1.1677216192532685,
                "yhat_lower": 62.01649982842141,
                "actual": 22,
                "severity": 1,
                "yhat_upper": 122.97465678905725
            }
        }
    }, {
        "country": "IE",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 0},
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 0},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {"actual": 1},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "IQ",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 8174.3296423932425,
                "change": -2.255855330410208,
                "yhat_lower": 6692.576749414248,
                "actual": 1433,
                "severity": 1,
                "yhat_upper": 9680.946416350022
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 7338.434272626771,
                "change": -2.34255464841143,
                "yhat_lower": 5950.3822890708525,
                "actual": 1319,
                "severity": 1,
                "yhat_upper": 8519.984785520088
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 4587.830732200382,
                "change": -1.9453002709753777,
                "yhat_lower": 3948.5239151037854,
                "actual": 1964,
                "severity": 1,
                "yhat_upper": 5297.328915210421
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 20046.874858929037,
                "change": -4.293698312380131,
                "yhat_lower": 18114.99681851703,
                "actual": 3657,
                "severity": 1,
                "yhat_upper": 21932.189752559854
            },
            "releads": {"actual": 1.3376005852231163},
            "cr": {"actual": 0.031284111251801076},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 1270.0706846532996,
                "change": -2.0929670965160154,
                "yhat_lower": 1021.6805496814254,
                "actual": 189,
                "severity": 1,
                "yhat_upper": 1538.2059582522845
            },
            "pixels_ratio": {"actual": 0.9204466154919749},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 8112.718822200284,
                "change": -2.3038132673249487,
                "yhat_lower": 6636.394294500246,
                "actual": 1420,
                "severity": 1,
                "yhat_upper": 9541.455619184548
            },
            "cq": {"actual": 0.27704117236566644},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 4654.640783301056,
                "change": -2.0645555154926822,
                "yhat_lower": 4021.9123203475438,
                "actual": 1979,
                "severity": 1,
                "yhat_upper": 5317.901100122519
            },
            "resubs": {"actual": 1.0091549295774649},
            "ecpa": {
                "ds": "2018-04-16",
                "yhat": 0.7393185700221625,
                "change": -3.3907168102079934,
                "yhat_lower": 0.6691516473761526,
                "actual": 0.2370551290997906,
                "severity": 5,
                "yhat_upper": 0.8172806327901725
            },
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 2924.773078240406,
                "change": -2.5286692974584897,
                "yhat_lower": 2393.9965355014538,
                "actual": 397,
                "severity": 1,
                "yhat_upper": 3393.6421122405773
            },
            "active24": {"actual": 0.8681088625261689},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 12863.151992882185,
                "change": -3.266724364654516,
                "yhat_lower": 11393.91574004028,
                "actual": 2734,
                "severity": 1,
                "yhat_upper": 14494.62178750426
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 6570.524708125012,
                "change": -2.3605539224581165,
                "yhat_lower": 5303.664634506472,
                "actual": 339.69999999999993,
                "severity": 1,
                "yhat_upper": 7943.22505667919
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 200092.61331329687,
                "change": -3.3449719573977017,
                "yhat_lower": 178137.62542817098,
                "actual": 45806,
                "severity": 1,
                "yhat_upper": 224262.560189456
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 7338.434272626771,
                "change": -2.4151013244940147,
                "yhat_lower": 6117.015919142848,
                "actual": 1319,
                "severity": 1,
                "yhat_upper": 8609.43071415684
            }
        }
    }, {
        "country": "IR",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 546.3936037007825,
                "change": -1.5173086421122388,
                "yhat_lower": 427.39522685253223,
                "actual": 181,
                "severity": 1,
                "yhat_upper": 668.2121533231543
            },
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 563.2922853085887,
                "change": -1.584245110067956,
                "yhat_lower": 441.35926387054417,
                "actual": 183,
                "severity": 1,
                "yhat_upper": 681.4056322587516
            },
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {"actual": 0},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "JO",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 1},
            "leads": {"actual": 2},
            "releads": {"actual": 2},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 1},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 1},
            "cost": {"actual": 0},
            "views": {"actual": 2},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "KE",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 5.813891236167049,
                "change": -0.3309869560373891,
                "yhat_lower": -1.8962537042097656,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 12.647797498893418
            },
            "paid_sales": {"actual": 0},
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 20.82872139557803,
                "change": -0.7186056717308538,
                "yhat_lower": 14.18914223315358,
                "actual": 11,
                "severity": 1,
                "yhat_upper": 27.86663154645707
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 5.810075691274046,
                "change": -0.35892687319778516,
                "yhat_lower": -0.6467969265922602,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 12.754472386066517
            },
            "releads": {"actual": 1},
            "cr": {"actual": 0.00004966969651815427},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 5.57427279704236,
                "change": -0.3103760835763243,
                "yhat_lower": -1.8197879008071378,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 12.91805125334117
            },
            "cq": {"actual": 0},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 20.50847760836848,
                "change": -0.6888283188125646,
                "yhat_lower": 13.478262876428754,
                "actual": 11,
                "severity": 1,
                "yhat_upper": 27.282105356017357
            },
            "resubs": {"actual": 1},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 1},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 5.776886342033701,
                "change": -0.3544919243303828,
                "yhat_lower": -0.6987018320514866,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 12.776601874956778
            },
            "cost": {"actual": 0},
            "views": {
                "ds": "2018-04-16",
                "yhat": 33267.32559528858,
                "change": -0.09448565091934484,
                "yhat_lower": -34454.924262608256,
                "actual": 20133,
                "severity": 1,
                "yhat_upper": 104553.75554741231
            },
            "pixels": {"actual": 0}
        }
    }, {
        "country": "KW",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 51.47425012843465,
                "change": -0.12572056448260419,
                "yhat_lower": 16.799000946576136,
                "actual": 43,
                "severity": 1,
                "yhat_upper": 84.20444223861887
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 44.483674632398106,
                "change": -0.2503605861819802,
                "yhat_lower": 18.71700702073414,
                "actual": 32,
                "severity": 1,
                "yhat_upper": 68.5797862336094
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 21.41157065177349,
                "change": -0.9413736967802372,
                "yhat_lower": 10.612402699326928,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 32.295152835204746
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 4808.1479309366505,
                "change": -0.5175482237100149,
                "yhat_lower": 2693.905884163057,
                "actual": 2612,
                "severity": 1,
                "yhat_upper": 6937.274579728641
            },
            "releads": {"actual": 1.0215095815408681},
            "cr": {"actual": 0.0007930506630272403},
            "optout_24": {"actual": 2},
            "pixels_ratio": {"actual": 0.7441860465116279},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 48.26443598472122,
                "change": -0.13335688714927213,
                "yhat_lower": 12.550567416558719,
                "actual": 39,
                "severity": 1,
                "yhat_upper": 82.02156499879183
            },
            "cq": {"actual": 0.11627906976744186},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 22.46443245093608,
                "change": -1.0628366460000291,
                "yhat_lower": 12.317706297668897,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 32.513126291622974
            },
            "resubs": {"actual": 1.1025641025641026},
            "ecpa": {"actual": 0},
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 25.073576626883227,
                "change": -1.1100863112333048,
                "yhat_lower": 15.902781918436308,
                "actual": 5,
                "severity": 1,
                "yhat_upper": 33.98567909836955
            },
            "active24": {"actual": 0.9534883720930233},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 4552.105574050543,
                "change": -0.5341242079647135,
                "yhat_lower": 2681.645400325367,
                "actual": 2557,
                "severity": 1,
                "yhat_upper": 6416.929336720827
            },
            "cost": {"actual": 0},
            "views": {
                "ds": "2018-04-16",
                "yhat": 186607.17864506508,
                "change": -1.5897638751414893,
                "yhat_lower": 146938.6862317416,
                "actual": 54221,
                "severity": 1,
                "yhat_upper": 230212.8005295537
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 44.483674632398106,
                "change": -0.2608493357087871,
                "yhat_lower": 20.586605205195127,
                "actual": 32,
                "severity": 1,
                "yhat_upper": 68.44440249832266
            }
        }
    }, {
        "country": "LK",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 0},
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 0},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {
                "ds": "2018-04-16",
                "yhat": 31140.229360316647,
                "change": -0.6129723266275312,
                "yhat_lower": 18367.07566298859,
                "actual": 15963,
                "severity": 1,
                "yhat_upper": 43127.13203261161
            },
            "pixels": {"actual": 0}
        }
    }, {
        "country": "MX",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 256.4251987737889,
                "change": -1.7354090565385303,
                "yhat_lower": 210.9230933538187,
                "actual": 97,
                "severity": 1,
                "yhat_upper": 302.7891569617732
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 132.35050961090377,
                "change": -2.0158981583160847,
                "yhat_lower": 109.8237187974858,
                "actual": 40,
                "severity": 1,
                "yhat_upper": 155.63481755261625
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 140.22767670726654,
                "change": -0.681848653782973,
                "yhat_lower": 112.91927789710726,
                "actual": 102,
                "severity": 1,
                "yhat_upper": 168.98403140974543
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 3258.946327655339,
                "change": -1.7483030929324879,
                "yhat_lower": 2702.5503890260243,
                "actual": 1311,
                "severity": 1,
                "yhat_upper": 3816.742965547743
            },
            "releads": {"actual": 1.4312227074235808},
            "cr": {"actual": 0.0005430188489120029},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 21.040908258251896,
                "change": -1.0779103322812342,
                "yhat_lower": 13.007736239245089,
                "actual": 4,
                "severity": 1,
                "yhat_upper": 28.816943877312156
            },
            "pixels_ratio": {"actual": 0.41237113402061853},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 255.47278681303385,
                "change": -1.646104556897944,
                "yhat_lower": 209.07242077855466,
                "actual": 97,
                "severity": 1,
                "yhat_upper": 305.3438186973315
            },
            "cq": {"actual": 1},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 140.6224151435115,
                "change": -0.6952348027043321,
                "yhat_lower": 115.56623272813906,
                "actual": 104,
                "severity": 1,
                "yhat_upper": 168.2425587708763
            },
            "resubs": {"actual": 1},
            "ecpa": {"actual": 0.422680412371134},
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 252.53186477077537,
                "change": -1.5877170346470333,
                "yhat_lower": 203.27862975777677,
                "actual": 97,
                "severity": 1,
                "yhat_upper": 301.2380654612249
            },
            "active24": {"actual": 0.9587628865979382},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 2610.78721611276,
                "change": -2.8305824595662417,
                "yhat_lower": 2306.092944501215,
                "actual": 916,
                "severity": 1,
                "yhat_upper": 2904.834454533913
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 198.13396382486053,
                "change": -2.6467207695112887,
                "yhat_lower": 169.03063684277234,
                "actual": 41,
                "severity": 1,
                "yhat_upper": 228.39993852164758
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 266612.85645982425,
                "change": -0.4861548654118953,
                "yhat_lower": 180294.0197993029,
                "actual": 178631,
                "severity": 1,
                "yhat_upper": 361268.97802641336
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 132.35050961090377,
                "change": -2.0473916222349575,
                "yhat_lower": 110.1121635790226,
                "actual": 40,
                "severity": 1,
                "yhat_upper": 155.2185851390038
            }
        }
    }, {
        "country": "MY",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 473.0237954221818,
                "change": -1.2318755256188443,
                "yhat_lower": 327.14278314249793,
                "actual": 123,
                "severity": 1,
                "yhat_upper": 611.2817145059927
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 211.0514219679878,
                "change": -1.0477136952306128,
                "yhat_lower": 131.37041927133998,
                "actual": 46,
                "severity": 1,
                "yhat_upper": 288.90527132045656
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 291.1045479946825,
                "change": -0.2652248016779802,
                "yhat_lower": -130.68483000012955,
                "actual": 83,
                "severity": 1,
                "yhat_upper": 653.9497391581137
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 4106.145545374369,
                "change": -1.2582258605358418,
                "yhat_lower": 2814.403216156109,
                "actual": 917,
                "severity": 1,
                "yhat_upper": 5349.039997517609
            },
            "releads": {"actual": 1.0361581920903955},
            "cr": {"actual": 0.00034139260427046064},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 87.90727062711946,
                "change": -1.0824502987245979,
                "yhat_lower": 58.58236625190442,
                "actual": 25,
                "severity": 1,
                "yhat_upper": 116.69798661917693
            },
            "pixels_ratio": {"actual": 0.37398373983739835},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 376.8954404318076,
                "change": -1.1460920278852664,
                "yhat_lower": 251.56698787645817,
                "actual": 94,
                "severity": 1,
                "yhat_upper": 498.4018262216803
            },
            "cq": {"actual": 0.04878048780487805},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 325.46267909637015,
                "change": -0.24696475383718738,
                "yhat_lower": -106.86230974479707,
                "actual": 96,
                "severity": 1,
                "yhat_upper": 822.2689753115492
            },
            "resubs": {"actual": 1.3085106382978724},
            "ecpa": {
                "ds": "2018-04-16",
                "yhat": 0.975102540516331,
                "change": -3.485316853712224,
                "yhat_lower": 0.9030800370556611,
                "actual": 0.4455284552845528,
                "severity": 5,
                "yhat_upper": 1.0550243530129684
            },
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 113.56457854269081,
                "change": -1.2690529788248204,
                "yhat_lower": 72.53646144795285,
                "actual": 6,
                "severity": 1,
                "yhat_upper": 157.2961841210746
            },
            "active24": {"actual": 0.7967479674796748},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 3675.6344828080223,
                "change": -1.415609382674281,
                "yhat_lower": 2661.2416218305534,
                "actual": 885,
                "severity": 1,
                "yhat_upper": 4632.572496691053
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 463.1301405397846,
                "change": -1.1843269979132434,
                "yhat_lower": 284.76914503648845,
                "actual": 54.8,
                "severity": 1,
                "yhat_upper": 629.5473534698458
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 580737.4667527891,
                "change": -0.871954938798993,
                "yhat_lower": 458843.128034491,
                "actual": 360289,
                "severity": 1,
                "yhat_upper": 711664.0674472877
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 211.0514219679878,
                "change": -1.0204112585570313,
                "yhat_lower": 132.52400303195654,
                "actual": 46,
                "severity": 1,
                "yhat_upper": 294.2739059107114
            }
        }
    }, {
        "country": "NG",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 0},
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 0},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {"actual": 2},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "NL",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 3},
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 3},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {"actual": 0},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "NN",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 0},
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 0},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {"actual": 1},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "OM",
        "metrics": {
            "sales": {"actual": 4},
            "paid_sales": {"actual": 4},
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 44.474881640279094,
                "change": -0.46024234760641825,
                "yhat_lower": 17.322292547270287,
                "actual": 19,
                "severity": 1,
                "yhat_upper": 72.67330875159455
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 701.4216349243626,
                "change": -0.23857320572548066,
                "yhat_lower": 150.550264009834,
                "actual": 446,
                "severity": 1,
                "yhat_upper": 1221.1718962574591
            },
            "releads": {"actual": 1.8204081632653062},
            "cr": {"actual": 0.0009326183259501049},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 1},
            "uniquesales": {"actual": 4},
            "cq": {"actual": 0.25},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 44.41883064786447,
                "change": -0.4453503982259941,
                "yhat_lower": 15.822965037196958,
                "actual": 19,
                "severity": 1,
                "yhat_upper": 72.89899045250516
            },
            "resubs": {"actual": 1},
            "ecpa": {"actual": 0},
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 5.227126629915157,
                "change": -0.33229900868905093,
                "yhat_lower": -0.8009129220765592,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 11.919939440954995
            },
            "active24": {"actual": 1},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 348.3138578423138,
                "change": -0.14761503715666136,
                "yhat_lower": -21.81626129744275,
                "actual": 245,
                "severity": 1,
                "yhat_upper": 678.0708222431624
            },
            "cost": {"actual": 0},
            "views": {
                "ds": "2018-04-16",
                "yhat": 9512.246996123158,
                "change": -0.5974248919889814,
                "yhat_lower": 5088.686724031575,
                "actual": 4289,
                "severity": 1,
                "yhat_upper": 13831.621720820247
            },
            "pixels": {"actual": 4}
        }
    }, {
        "country": "PL",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 5.240480553459272,
                "change": -0.32114233294634176,
                "yhat_lower": -1.0927070978045192,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 12.111657815891848
            },
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 4.9157286946350265,
                "change": -0.30910851241129866,
                "yhat_lower": -1.2691856337278093,
                "actual": 1,
                "severity": 1,
                "yhat_upper": 11.398626922093273
            },
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {"actual": 0},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "PT",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 57.67827067625828,
                "change": -0.645738858896387,
                "yhat_lower": 28.09300593830658,
                "actual": 19,
                "severity": 1,
                "yhat_upper": 87.99070319376082
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 54.5815631794897,
                "change": -0.6243107225100505,
                "yhat_lower": 25.85428531791344,
                "actual": 19,
                "severity": 1,
                "yhat_upper": 82.84764118473805
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 8.612349576028754,
                "change": -0.16132715807269543,
                "yhat_lower": 1.2032166793343635,
                "actual": 6,
                "severity": 1,
                "yhat_upper": 17.396085922413736
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 546.0887831246436,
                "change": -0.31843979302348807,
                "yhat_lower": 157.05645128956883,
                "actual": 304,
                "severity": 1,
                "yhat_upper": 917.2905314153122
            },
            "releads": {
                "ds": "2018-04-16",
                "yhat": 1.4607562408043462,
                "change": 0.7018864327102652,
                "yhat_lower": -0.7453571251104658,
                "actual": 4.606060606060606,
                "severity": 1,
                "yhat_upper": 3.7358583802398484
            },
            "cr": {"actual": 0.0033664068036853294},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 9.05260258201497,
                "change": -0.7163365074093584,
                "yhat_lower": 3.7834291032780474,
                "actual": 2,
                "severity": 1,
                "yhat_upper": 13.628805555639538
            },
            "pixels_ratio": {"actual": 1},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 56.31230652774308,
                "change": -0.6317546059395613,
                "yhat_lower": 27.035989353805142,
                "actual": 19,
                "severity": 1,
                "yhat_upper": 86.09738150978521
            },
            "cq": {"actual": 0.15789473684210525},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 8.605451531036268,
                "change": -0.1447291294236882,
                "yhat_lower": -0.16683559670713696,
                "actual": 6,
                "severity": 1,
                "yhat_upper": 17.83542518805114
            },
            "resubs": {"actual": 1},
            "ecpa": {
                "ds": "2018-04-16",
                "yhat": 2.8751958736061383,
                "change": -23.77126347869673,
                "yhat_lower": 2.826720128529842,
                "actual": 0.47368421052631576,
                "severity": 5,
                "yhat_upper": 2.927745960212369
            },
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 5.325265110496464,
                "change": -0.2021693146377795,
                "yhat_lower": -0.6273447849677557,
                "actual": 3,
                "severity": 1,
                "yhat_upper": 10.874228115264753
            },
            "active24": {"actual": 0.8947368421052632},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 143.22264466076763,
                "change": -0.7787386335317987,
                "yhat_lower": 92.74474417728894,
                "actual": 66,
                "severity": 1,
                "yhat_upper": 191.90849609048377
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 163.86722254333446,
                "change": -0.9105080437221766,
                "yhat_lower": 79.86030858040603,
                "actual": 9,
                "severity": 1,
                "yhat_upper": 249.94911077289836
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 6842.216161771937,
                "change": -0.05081491882375476,
                "yhat_lower": -4261.30339334961,
                "actual": 5644,
                "severity": 1,
                "yhat_upper": 19318.704004237716
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 54.5815631794897,
                "change": -0.5946873802013187,
                "yhat_lower": 24.204070635779704,
                "actual": 19,
                "severity": 1,
                "yhat_upper": 84.03645377369718
            }
        }
    }, {
        "country": "QA",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 683.6404435243037,
                "change": -0.6975759385734853,
                "yhat_lower": 344.194580343351,
                "actual": 199,
                "severity": 1,
                "yhat_upper": 1038.9439498748945
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 680.5948034138368,
                "change": -0.7069095867383207,
                "yhat_lower": 349.49102043785433,
                "actual": 202,
                "severity": 1,
                "yhat_upper": 1026.5150874363967
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 406.9176762154628,
                "change": -0.7205171501563805,
                "yhat_lower": 326.46438738957255,
                "actual": 290,
                "severity": 1,
                "yhat_upper": 488.733496723177
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 749.988983258696,
                "change": -0.7269532891405347,
                "yhat_lower": 387.0178472872895,
                "actual": 219,
                "severity": 1,
                "yhat_upper": 1117.4485244584125
            },
            "releads": {"actual": 1},
            "cr": {"actual": 0.056776034236804565},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 52.44838299973927,
                "change": -0.5640384642850662,
                "yhat_lower": 16.422509903267663,
                "actual": 13,
                "severity": 1,
                "yhat_upper": 86.36168160451174
            },
            "pixels_ratio": {"actual": 1.015075376884422},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 683.203806178422,
                "change": -0.7006859075675259,
                "yhat_lower": 349.92169615431175,
                "actual": 198,
                "severity": 1,
                "yhat_upper": 1042.3914617627522
            },
            "cq": {"actual": 0.20603015075376885},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 407.8291476378777,
                "change": -0.755013750157051,
                "yhat_lower": 326.15611974435996,
                "actual": 291,
                "severity": 1,
                "yhat_upper": 480.89389453796605
            },
            "resubs": {"actual": 1.005050505050505},
            "ecpa": {
                "ds": "2018-04-16",
                "yhat": 1.1563599792078127,
                "change": -8.857734013927676,
                "yhat_lower": 1.107142807644693,
                "actual": 0.2756281407035176,
                "severity": 5,
                "yhat_upper": 1.2065736369199291
            },
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 154.33584873863992,
                "change": -0.6655288460381099,
                "yhat_lower": 74.68753960073671,
                "actual": 41,
                "severity": 1,
                "yhat_upper": 244.9819594644702
            },
            "active24": {"actual": 0.9346733668341709},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 748.9940095612139,
                "change": -0.7538146859474676,
                "yhat_lower": 404.14857150311985,
                "actual": 219,
                "severity": 1,
                "yhat_upper": 1107.2311983626191
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 769.9775014110085,
                "change": -0.9264145907241238,
                "yhat_lower": 352.5377625400918,
                "actual": 54.85,
                "severity": 1,
                "yhat_upper": 1124.4680716817422
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 18261.380169613145,
                "change": -1.3727939812967342,
                "yhat_lower": 12760.254717951839,
                "actual": 3505,
                "severity": 1,
                "yhat_upper": 23509.41327390234
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 680.5948034138368,
                "change": -0.6916852769518437,
                "yhat_lower": 330.51110565641955,
                "actual": 202,
                "severity": 1,
                "yhat_upper": 1022.4367824944959
            }
        }
    }, {
        "country": "SA",
        "metrics": {
            "sales": {"actual": 3},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 0},
            "leads": {"actual": 5},
            "releads": {"actual": 5},
            "cr": {"actual": 0.375},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 2},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 1},
            "uniqueleads": {"actual": 1},
            "cost": {"actual": 0},
            "views": {"actual": 8},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "SG",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 57.26871425966862,
                "change": -1.575186898984744,
                "yhat_lower": 42.854143730845905,
                "actual": 13,
                "severity": 1,
                "yhat_upper": 70.95792893132031
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 25.0661387126369,
                "change": -1.4623634464880557,
                "yhat_lower": 17.27918437468237,
                "actual": 3,
                "severity": 1,
                "yhat_upper": 32.368551361822206
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 13.90529214293695,
                "change": 1.168730237333803,
                "yhat_lower": -27.584351337055942,
                "actual": 113,
                "severity": 1,
                "yhat_upper": 57.20399818244095
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 448.37215891984613,
                "change": -2.402876491155809,
                "yhat_lower": 382.0724109662873,
                "actual": 121,
                "severity": 1,
                "yhat_upper": 518.3141862405448
            },
            "releads": {"actual": 1.110091743119266},
            "cr": {"actual": 0.001953712052900511},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 25.83621272364724,
                "change": -1.1998415899269728,
                "yhat_lower": 16.246055051398415,
                "actual": 3,
                "severity": 1,
                "yhat_upper": 35.278744795914726
            },
            "pixels_ratio": {"actual": 0.23076923076923078},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 46.228359609448056,
                "change": -1.484686017871204,
                "yhat_lower": 33.92018962794772,
                "actual": 10,
                "severity": 1,
                "yhat_upper": 58.32155070589037
            },
            "cq": {"actual": 0.15384615384615385},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 14.319901305696234,
                "change": 1.3456136682972515,
                "yhat_lower": -29.33452645408577,
                "actual": 128,
                "severity": 1,
                "yhat_upper": 55.14744736396807
            },
            "resubs": {"actual": 1.3},
            "ecpa": {"actual": 0},
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 25.707114558765593,
                "change": -1.452033923148611,
                "yhat_lower": 17.465000179523553,
                "actual": 2,
                "severity": 1,
                "yhat_upper": 33.7918326183682
            },
            "active24": {"actual": 0.7692307692307693},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 410.42409535412037,
                "change": -2.3039113011318473,
                "yhat_lower": 344.6322730074745,
                "actual": 109,
                "severity": 1,
                "yhat_upper": 475.46374000277035
            },
            "cost": {"actual": 0},
            "views": {
                "ds": "2018-04-16",
                "yhat": 17396.300875078166,
                "change": -1.570798747893319,
                "yhat_lower": 14014.557917801576,
                "actual": 6654,
                "severity": 1,
                "yhat_upper": 20853.30851490081
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 25.0661387126369,
                "change": -1.3605630112094782,
                "yhat_lower": 16.456698426250185,
                "actual": 3,
                "severity": 1,
                "yhat_upper": 32.67508635157024
            }
        }
    }, {
        "country": "SK",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 1.2520854881739447,
                "change": 0.05748766563061389,
                "yhat_lower": -5.221274440467289,
                "actual": 2,
                "severity": 1,
                "yhat_upper": 7.788725245930982
            },
            "paid_sales": {"actual": 2},
            "total_optouts": {"actual": 0},
            "leads": {
                "ds": "2018-04-16",
                "yhat": 15.821304861327116,
                "change": -0.054356875917061245,
                "yhat_lower": -48.22100673898755,
                "actual": 9,
                "severity": 1,
                "yhat_upper": 77.27010632157892
            },
            "releads": {"actual": 1},
            "cr": {"actual": 0.047619047619047616},
            "optout_24": {"actual": 0},
            "pixels_ratio": {
                "ds": "2018-04-16",
                "yhat": 1.4957056622663147e-7,
                "change": 1.4863524237634023,
                "yhat_lower": -0.3208053202799246,
                "actual": 1,
                "severity": 5,
                "yhat_upper": 0.35198252898227295
            },
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 1.2520854881739447,
                "change": 0.05928329989043548,
                "yhat_lower": -4.986721051093016,
                "actual": 2,
                "severity": 1,
                "yhat_upper": 7.629218230430021
            },
            "cq": {"actual": 0},
            "day_optouts": {"actual": 0},
            "resubs": {"actual": 1},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 1},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 15.821304861327116,
                "change": -0.053638612030162194,
                "yhat_lower": -49.01567340314956,
                "actual": 9,
                "severity": 1,
                "yhat_upper": 78.15586596277107
            },
            "cost": {"actual": 0},
            "views": {
                "ds": "2018-04-16",
                "yhat": 115.02620692657537,
                "change": -0.2414883534384999,
                "yhat_lower": -32.300882205764,
                "actual": 42,
                "severity": 1,
                "yhat_upper": 270.0996513469774
            },
            "pixels": {"actual": 2}
        }
    }, {
        "country": "TH",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 1620.9827916559213,
                "change": -1.5029976818870032,
                "yhat_lower": 1257.5950912735302,
                "actual": 553,
                "severity": 1,
                "yhat_upper": 1968.163580185021
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 1566.6829390855287,
                "change": -1.5300903661629808,
                "yhat_lower": 1246.9215831989197,
                "actual": 545,
                "severity": 1,
                "yhat_upper": 1914.64877218032
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 1638.8469500897627,
                "change": -0.26842939037809155,
                "yhat_lower": -713.3206802558853,
                "actual": 405,
                "severity": 1,
                "yhat_upper": 3883.2212570925135
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 1618.7257296859323,
                "change": -1.615844140377027,
                "yhat_lower": 1281.8048935118084,
                "actual": 558,
                "severity": 1,
                "yhat_upper": 1938.2578911619603
            },
            "releads": {"actual": 1},
            "cr": {"actual": 0.0004121369487109355},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 314.5024163232558,
                "change": -1.3781285070581242,
                "yhat_lower": 223.71176134690603,
                "actual": 73,
                "severity": 1,
                "yhat_upper": 398.9511639761923
            },
            "pixels_ratio": {"actual": 0.9855334538878843},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 1609.2957379273173,
                "change": -1.6185794795274855,
                "yhat_lower": 1305.3585881667423,
                "actual": 553,
                "severity": 1,
                "yhat_upper": 1957.9652418947899
            },
            "cq": {"actual": 0.07775768535262206},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 1670.483023980052,
                "change": -0.2682701297447424,
                "yhat_lower": -672.93842043607,
                "actual": 413,
                "severity": 1,
                "yhat_upper": 4014.4377894183044
            },
            "resubs": {"actual": 1},
            "ecpa": {"actual": 0.2805605786618445},
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 291.61166735276356,
                "change": -1.522722577571604,
                "yhat_lower": 210.74995468306903,
                "actual": 43,
                "severity": 1,
                "yhat_upper": 374.0178217355446
            },
            "active24": {"actual": 0.8679927667269439},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 1617.1828761877994,
                "change": -1.555658368689118,
                "yhat_lower": 1273.885093155086,
                "actual": 558,
                "severity": 1,
                "yhat_upper": 1954.7433699503467
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 999.1245463885806,
                "change": -2.0915902215673863,
                "yhat_lower": 797.0326235663953,
                "actual": 155.15,
                "severity": 1,
                "yhat_upper": 1200.5411778166283
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 891133.9641330867,
                "change": 0.35131440079233983,
                "yhat_lower": 273087.45640731015,
                "actual": 1341787,
                "severity": 1,
                "yhat_upper": 1555850.232002416
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 1566.6829390855287,
                "change": -1.5689263895702814,
                "yhat_lower": 1239.1323479454932,
                "actual": 545,
                "severity": 1,
                "yhat_upper": 1890.3311204802333
            }
        }
    }, {
        "country": "TR",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 2016.8718211675275,
                "change": -1.7121854655353492,
                "yhat_lower": 1538.387736601122,
                "actual": 448,
                "severity": 1,
                "yhat_upper": 2454.6855634121844
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 467.75662707577845,
                "change": -0.5181411913096692,
                "yhat_lower": 140.84493294272022,
                "actual": 120,
                "severity": 1,
                "yhat_upper": 812.0068341935712
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 3710.757039328296,
                "change": -1.241097703363555,
                "yhat_lower": 3282.5074526235308,
                "actual": 2686,
                "severity": 1,
                "yhat_upper": 4108.193485682053
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 2015.194258555667,
                "change": -1.6498045097557883,
                "yhat_lower": 1521.2346373392015,
                "actual": 446,
                "severity": 1,
                "yhat_upper": 2472.374150703695
            },
            "releads": {"actual": 1.0229357798165137},
            "cr": {"actual": 0.007755561326062495},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 553.2171958130638,
                "change": -1.9260782402120906,
                "yhat_lower": 440.88490197109724,
                "actual": 98,
                "severity": 1,
                "yhat_upper": 677.228985149638
            },
            "pixels_ratio": {"actual": 0.26785714285714285},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 1992.9375346313823,
                "change": -1.8509507667102196,
                "yhat_lower": 1564.3171902917702,
                "actual": 434,
                "severity": 1,
                "yhat_upper": 2406.5532792624963
            },
            "cq": {"actual": 0.29910714285714285},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 3847.2790507100226,
                "change": -1.2333329416163288,
                "yhat_lower": 3383.5259560781606,
                "actual": 2763,
                "severity": 1,
                "yhat_upper": 4262.671411553496
            },
            "resubs": {"actual": 1.032258064516129},
            "ecpa": {
                "ds": "2018-04-16",
                "yhat": 0.9764552024767784,
                "change": -3.4836150764106097,
                "yhat_lower": 0.8752614879893668,
                "actual": 0.27823660714285714,
                "severity": 5,
                "yhat_upper": 1.0756908063896478
            },
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 599.8726465776706,
                "change": -1.7001147856638439,
                "yhat_lower": 456.5461915156529,
                "actual": 134,
                "severity": 1,
                "yhat_upper": 730.5704224123692
            },
            "active24": {"actual": 0.78125},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 1980.4808098702936,
                "change": -1.7006275208938486,
                "yhat_lower": 1524.8830826555318,
                "actual": 436,
                "severity": 1,
                "yhat_upper": 2433.0659686166596
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 2123.118284781575,
                "change": -3.2133991451329567,
                "yhat_lower": 1818.1737059366903,
                "actual": 124.65,
                "severity": 1,
                "yhat_upper": 2440.0909326865863
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 185062.50713622538,
                "change": -0.7045677425502485,
                "yhat_lower": 91910.81965605776,
                "actual": 57765,
                "severity": 1,
                "yhat_upper": 272585.43679856305
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 467.75662707577845,
                "change": -0.5291416301393517,
                "yhat_lower": 153.9238861510584,
                "actual": 120,
                "severity": 1,
                "yhat_upper": 811.1328586981537
            }
        }
    }, {
        "country": "UK",
        "metrics": {
            "sales": {"actual": 0},
            "paid_sales": {"actual": 0},
            "total_optouts": {"actual": 1},
            "leads": {"actual": 0},
            "releads": {"actual": 0},
            "cr": {"actual": 0},
            "optout_24": {"actual": 0},
            "pixels_ratio": {"actual": 0},
            "uniquesales": {"actual": 0},
            "cq": {"actual": 0},
            "day_optouts": {"actual": 1},
            "resubs": {"actual": 0},
            "ecpa": {"actual": 0},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0},
            "uniqueleads": {"actual": 0},
            "cost": {"actual": 0},
            "views": {"actual": 0},
            "pixels": {"actual": 0}
        }
    }, {
        "country": "VN",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 108.13168043022392,
                "change": -0.35737687642247673,
                "yhat_lower": -12.999409372753014,
                "actual": 23,
                "severity": 1,
                "yhat_upper": 225.21320606682187
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 42.228108705586216,
                "change": -0.6085298210951924,
                "yhat_lower": 23.500703402028932,
                "actual": 20,
                "severity": 1,
                "yhat_upper": 60.02826201136958
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 27.04243389669329,
                "change": -0.47685998562777127,
                "yhat_lower": 14.714842692408322,
                "actual": 15,
                "severity": 1,
                "yhat_upper": 39.96844806850169
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 610.9262434572942,
                "change": -1.1909412033349673,
                "yhat_lower": 415.26907823103545,
                "actual": 166,
                "severity": 1,
                "yhat_upper": 788.8611936195841
            },
            "releads": {"actual": 1.177304964539007},
            "cr": {"actual": 0.00029783486998860456},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 26.024602877331947,
                "change": -0.5514214283605612,
                "yhat_lower": 13.314844072461389,
                "actual": 12,
                "severity": 1,
                "yhat_upper": 38.748391185472016
            },
            "pixels_ratio": {"actual": 0.8695652173913043},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 52.404033517631085,
                "change": -0.9912312721746751,
                "yhat_lower": 35.04527243575536,
                "actual": 18,
                "severity": 1,
                "yhat_upper": 69.75365430727524
            },
            "cq": {"actual": 0},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 31.48351191706906,
                "change": -0.5740840102600268,
                "yhat_lower": 17.969470816501723,
                "actual": 15,
                "severity": 1,
                "yhat_upper": 46.68218815834684
            },
            "resubs": {
                "ds": "2018-04-16",
                "yhat": 4.44527104614287,
                "change": -0.042011786894076975,
                "yhat_lower": -32.13955079089798,
                "actual": 1.2777777777777777,
                "severity": 1,
                "yhat_upper": 43.255796623178824
            },
            "ecpa": {"actual": 0.13043478260869565},
            "firstbillings": {"actual": 0},
            "active24": {"actual": 0.4782608695652174},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 473.58947199184263,
                "change": -1.2064652627389296,
                "yhat_lower": 334.0542775124584,
                "actual": 141,
                "severity": 1,
                "yhat_upper": 609.7269240972383
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 35.30548614615993,
                "change": -1.5885516681384442,
                "yhat_lower": 24.97040018382385,
                "actual": 3,
                "severity": 1,
                "yhat_upper": 45.30684047349812
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 513425.11652768584,
                "change": -0.628229847081622,
                "yhat_lower": 171761.10009931342,
                "actual": 77224,
                "severity": 1,
                "yhat_upper": 866094.7401739038
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 42.228108705586216,
                "change": -0.6152266933385867,
                "yhat_lower": 24.67807444276675,
                "actual": 20,
                "severity": 1,
                "yhat_upper": 60.80802287683623
            }
        }
    }, {
        "country": "ZA",
        "metrics": {
            "sales": {
                "ds": "2018-04-16",
                "yhat": 1115.605419426638,
                "change": -0.5698067121273429,
                "yhat_lower": 220.6624617845751,
                "actual": 90,
                "severity": 1,
                "yhat_upper": 2020.5805701508227
            },
            "paid_sales": {
                "ds": "2018-04-16",
                "yhat": 137.28941039959832,
                "change": -0.5861662252472822,
                "yhat_lower": 29.928436897714185,
                "actual": 12,
                "severity": 1,
                "yhat_upper": 243.67226075372582
            },
            "total_optouts": {
                "ds": "2018-04-16",
                "yhat": 204.4840654661037,
                "change": -0.04527688602855747,
                "yhat_lower": -815.5849942372474,
                "actual": 110,
                "severity": 1,
                "yhat_upper": 1271.2207416190079
            },
            "leads": {
                "ds": "2018-04-16",
                "yhat": 1465.7714854434528,
                "change": -0.37525750675868325,
                "yhat_lower": -304.360607436357,
                "actual": 134,
                "severity": 1,
                "yhat_upper": 3244.5930083000358
            },
            "releads": {"actual": 1.2072072072072073},
            "cr": {"actual": 0.004885993485342019},
            "optout_24": {
                "ds": "2018-04-16",
                "yhat": 31.793043747473064,
                "change": -0.7269524498746751,
                "yhat_lower": 10.435399880045438,
                "actual": 3,
                "severity": 1,
                "yhat_upper": 50.04327760634916
            },
            "pixels_ratio": {"actual": 0.13333333333333333},
            "uniquesales": {
                "ds": "2018-04-16",
                "yhat": 1103.759691658285,
                "change": -0.6773181625993928,
                "yhat_lower": 365.1418242389726,
                "actual": 90,
                "severity": 1,
                "yhat_upper": 1861.8678056709578
            },
            "cq": {"actual": 0.03333333333333333},
            "day_optouts": {
                "ds": "2018-04-16",
                "yhat": 211.25083342485388,
                "change": -0.04706095640232766,
                "yhat_lower": -808.5737436194945,
                "actual": 115,
                "severity": 1,
                "yhat_upper": 1236.6637692350735
            },
            "resubs": {"actual": 1},
            "ecpa": {"actual": 0.31444444444444447},
            "firstbillings": {
                "ds": "2018-04-16",
                "yhat": 63.45759012316342,
                "change": -0.4056043548382858,
                "yhat_lower": -9.992229368653744,
                "actual": 3,
                "severity": 1,
                "yhat_upper": 139.06334511418885
            },
            "active24": {"actual": 0.9666666666666667},
            "uniqueleads": {
                "ds": "2018-04-16",
                "yhat": 1215.5063505846535,
                "change": -0.614510257508303,
                "yhat_lower": 312.9064990745014,
                "actual": 111,
                "severity": 1,
                "yhat_upper": 2110.283088137752
            },
            "cost": {
                "ds": "2018-04-16",
                "yhat": 728.1592372417089,
                "change": -0.5324138432841837,
                "yhat_lower": 82.11541916383798,
                "actual": 28.3,
                "severity": 1,
                "yhat_upper": 1396.6177486386723
            },
            "views": {
                "ds": "2018-04-16",
                "yhat": 77554.82416236153,
                "change": -0.5787046556064723,
                "yhat_lower": 27979.327370622985,
                "actual": 18420,
                "severity": 1,
                "yhat_upper": 130164.13544062075
            },
            "pixels": {
                "ds": "2018-04-16",
                "yhat": 137.28941039959832,
                "change": -0.5819433088828913,
                "yhat_lower": 27.497860359290282,
                "actual": 12,
                "severity": 1,
                "yhat_upper": 242.79273270709012
            }
        }
    }];
    return detectAnomalies(data);
}
