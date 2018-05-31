import multiprocessing
import multiprocessing.pool
from json import loads, dumps
from sys import stdin
from time import time
from os import path, makedirs
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from sam_anomaly_detector import Detector

COUNTRIES_SECTION = 'countries'
AFFILIATES_SECTION = 'affiliates'


def log(message):
    import syslog
    syslog.syslog(syslog.LOG_INFO, '[INFO] ' + message)


def safediv(a, b):
    r = a / b
    if isinstance(r, float):
        r = 0 if r == np.inf else r
    else:
        r[r == np.inf] = 0
    return r


def aggregate_data(raw_data, group_by) -> pd.DataFrame:
    return (
        raw_data
            .groupby(group_by)
            .agg({
            'views': 'sum',
            'sales': 'sum',
            'pixels': 'sum',
            'total_optouts': 'sum',
            'firstbillings': 'sum',
            'uniquesales': 'sum',
            'uniqueleads': 'sum',
            'leads': 'sum',
            'optout_24': 'sum',
            'cost': 'sum',
        })
            .assign(
            cr=lambda d: safediv(d.sales, d.views),
            cq=lambda d: safediv(d.firstbillings, d.sales),
            resubs=lambda d: safediv(d.sales, d.uniquesales),
            releads=lambda d: safediv(d.leads, d.uniqueleads),
            active24=lambda d: safediv(d.sales - d.optout_24, d.sales),
            ecpa=lambda d: safediv(d.cost, d.sales),
            pixels_ratio=lambda d: safediv(d.pixels, d.sales)
        )
            .fillna(0)
    )


def read_and_prepare_data(read_from_file=False):
    if read_from_file:
        import os
        raw_data = pd.read_json(os.path.dirname(os.path.realpath(__file__)) + '/data.json')
        section = COUNTRIES_SECTION
        # section = AFFILIATES_SECTION
    else:
        json_input = loads(stdin.readlines()[0])
        raw_data = pd.DataFrame(json_input['data'])
        section = json_input['section']

    raw_data = raw_data.rename(columns={
        'row': 'day',
        'page': 'country',
    })
    raw_data['day'] = pd.to_datetime(raw_data['day']).apply(lambda d: d.strftime('%Y-%m-%d'))

    countries = [c for c in raw_data['country'].unique() if c is not None]

    if section == COUNTRIES_SECTION:
        data = aggregate_data(raw_data, ['country', 'day'])
        total_cases = len(countries) * 17
    else:
        data = aggregate_data(raw_data, ['country', 'section', 'day'])
        total_cases = 0
        for c in countries:
            total_cases += len(data.loc[c].index.get_level_values('section').unique()) * 17

    log('start processing [{}] cases...'.format(total_cases))

    return countries, data, total_cases


def get_anomalies(df, context, metric, return_anomalies):
    metric_name = metric['name']
    anomalies = {
        'actual': float(df[metric_name][-1])
    }
    df = df.reset_index(level=['day'])
    data = df[['day', metric_name]].rename(columns={
        'day': 'time',
        metric_name: 'value',
    })

    yesterday = (datetime.today() - timedelta(1)).strftime('%Y-%m-%d')
    dirname = path.dirname(path.realpath(__file__))
    image_path = '{}/../../images/{}/{}-{}.png'.format(dirname, yesterday, context, metric_name)
    makedirs(path.dirname(image_path), exist_ok=True)
    metric_anomalies = Detector(
        min_time_points=10,
        none_zero_ratio=0.4,
        min_dataset_size=metric['min'],
        image_path=image_path
    ).forecast_today(dataset=data[:-1])
    if not metric_anomalies.empty:
        columns = [
            'ds', 'actual', 'yhat_lower', 'yhat', 'yhat_upper', 'change', 'std_change', 'prediction', 'image_path'
        ]
        metric_anomalies['ds'] = pd.to_datetime(
            metric_anomalies['ds'], unit='ms'
        ).apply(
            lambda ds: ds.strftime('%Y-%m-%d')
        )
        anomalies = metric_anomalies[columns].to_dict(orient='records')[0]
    return_anomalies[metric_name] = anomalies


def parallize(fn, args, iterator):
    result = multiprocessing.Manager().dict()
    jobs = []
    for i in iterator:
        p = multiprocessing.Process(target=fn, args=args + (i, result))
        jobs.append(p)
        p.start()
    for job in jobs:
        job.join()
    return result.copy()


def get_anomalies_per_country(args):
    country, metrics, data = args
    log('processing [{}]...'.format(country))
    start_time = time()
    if data.index.nlevels == 3:  # TODO: should check whether `section` exists instead
        country_data = data.loc[country]
        country_sections = [
            a for a in country_data.index.get_level_values('section').unique() if a is not None
        ]
        anomalies_per_section = []
        for section in country_sections:
            anomalies_per_section.append({
                'section': section,
                'metrics': parallize(
                    get_anomalies,
                    (country_data.loc[section], '{}-{}'.format(country, section),),
                    metrics
                )
            })
        anomalies = {
            'country': country,
            'sections': anomalies_per_section,
        }
    else:
        anomalies = {
            'country': country,
            'metrics': parallize(
                get_anomalies,
                (data.loc[country], country,),
                metrics
            ),
        }
    log('finished processing [{}] in [{:.2f}] seconds'.format(country, time() - start_time))
    return anomalies


class DaemonLessProcess(multiprocessing.Process):
    def _get_daemon(self):
        return False

    def _set_daemon(self, value):
        pass

    daemon = property(_get_daemon, _set_daemon)


class DaemonLessPool(multiprocessing.pool.Pool):
    Process = DaemonLessProcess


def get_metrics():
    views = 100000
    leads = 10000
    unique_leads = 8000
    sales = 1000
    unique_sales = 800
    first_billings = 100
    pixels = 0
    optout_24 = 0
    total_optouts = 0
    cost = 0
    cr = safediv(sales, views),
    cq = safediv(first_billings, sales),
    resubs = safediv(sales, unique_sales),
    releads = safediv(leads, unique_leads),
    active24 = safediv(sales - optout_24, sales),
    ecpa = safediv(cost, sales),
    pixels_ratio = safediv(pixels, sales)

    return [
        {
            'name': 'views',
            'min': views,
        },
        {
            'name': 'leads',
            'min': leads,
        },
        {
            'name': 'uniqueleads',
            'min': unique_leads,
        },
        {
            'name': 'sales',
            'min': sales,
        },
        {
            'name': 'uniquesales',
            'min': unique_sales,
        },
        {
            'name': 'firstbillings',
            'min': first_billings,
        },
        {
            'name': 'pixels',
            'min': pixels,
        },
        {
            'name': 'optout_24',
            'min': optout_24,
        },
        {
            'name': 'total_optouts',
            'min': total_optouts,
        },
        {
            'name': 'cost',
            'min': cost,
        },
        {
            'name': 'cr',
            'min': cr,
        },
        {
            'name': 'cq',
            'min': cq,
        },
        {
            'name': 'resubs',
            'min': resubs,
        },
        {
            'name': 'releads',
            'min': releads,
        },
        {
            'name': 'pixels_ratio',
            'min': pixels_ratio,
        },
        {
            'name': 'ecpa',
            'min': ecpa,
        },
        {
            'name': 'active24',
            'min': active24,
        },
    ]


if __name__ == '__main__':
    start_time = time()
    metrics = get_metrics()
    countries, data, total_cases = read_and_prepare_data(read_from_file=False)
    pool = DaemonLessPool(4)
    anomalies = pool.map(
        get_anomalies_per_country,
        [(country, metrics, data) for country in countries]
    )
    pool.close()
    pool.join()
    log('Processed [{}] cases in [{:.2f}] min'.format(total_cases, round(time() - start_time) / 60))
    print(dumps(anomalies))
