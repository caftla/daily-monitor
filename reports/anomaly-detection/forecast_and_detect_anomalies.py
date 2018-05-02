import multiprocessing
import multiprocessing.pool
from json import loads, dumps
from sys import stdin
from time import time

import numpy as np
import pandas as pd
from sam_anomaly_detector import Detector

COUNTRIES_SECTION = 'countries'
AFFILIATES_SECTION = 'affiliates'


def log(message):
    import syslog
    syslog.syslog(syslog.LOG_INFO, '[DEBUG] ' + message)


def safediv(a, b):
    r = a / b
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

    if section == COUNTRIES_SECTION:
        data = aggregate_data(raw_data, ['country', 'day'])
    else:
        data = aggregate_data(raw_data, ['country', 'section', 'day'])

    countries = [c for c in raw_data['country'].unique() if c is not None]

    return countries, data


def get_anomalies(df, metric, return_anomalies):
    anomalies = {
        'actual': float(df[metric][-1])
    }
    df = df.reset_index(level=['day'])
    data = df[['day', metric]].rename(columns={
        'day': 'time',
        metric: 'value',
    })
    metric_anomalies = Detector(min_time_points=5, ignore_empty_dataset=True).forecast_today(dataset=data)
    if not metric_anomalies.empty:
        columns = ['ds', 'actual', 'yhat_lower', 'yhat', 'yhat_upper', 'severity', 'change', 'prediction']
        metric_anomalies['ds'] = pd.to_datetime(
            metric_anomalies['ds'], unit='ms'
        ).apply(
            lambda ds: ds.strftime('%Y-%m-%d')
        )
        anomalies = metric_anomalies[columns].to_dict(orient='records')[0]
    return_anomalies[metric] = anomalies


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
                'metrics': parallize(get_anomalies, (country_data.loc[section],), metrics)
            })
        anomalies = {
            'country': country,
            'sections': anomalies_per_section,
        }
    else:
        anomalies = {
            'country': country,
            'metrics': parallize(get_anomalies, (data.loc[country],), metrics),
        }
    log('finished processing [{}] in seconds [{:.2f}]'.format(country, time() - start_time))
    return anomalies


class DaemonLessProcess(multiprocessing.Process):
    def _get_daemon(self):
        return False

    def _set_daemon(self, value):
        pass

    daemon = property(_get_daemon, _set_daemon)


class DaemonLessPool(multiprocessing.pool.Pool):
    Process = DaemonLessProcess


if __name__ == '__main__':
    metrics = ['views', 'leads', 'uniqueleads', 'sales', 'uniquesales', 'firstbillings', 'pixels', 'optout_24',
               'total_optouts', 'cost', 'cr', 'cq', 'resubs', 'releads', 'pixels_ratio', 'ecpa', 'active24']
    countries, data = read_and_prepare_data(read_from_file=False)
    pool = DaemonLessPool(4)
    anomalies = pool.map(
        get_anomalies_per_country,
        [(country, metrics, data) for country in countries]
    )
    pool.close()
    pool.join()
    print(dumps(anomalies))
