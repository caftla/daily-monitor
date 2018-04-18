import multiprocessing
import multiprocessing.pool
from json import loads, dumps
from sys import stdin
from time import time

import numpy as np
import pandas as pd
from sam_anomaly_detector import Detector


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
            .rename(columns={
            'page': 'country',
            'section': 'affiliate',
        })
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
    else:
        json_input = loads(stdin.readlines()[0])
        raw_data = pd.DataFrame(json_input['data'])

    raw_data = raw_data.rename(columns={
        'row': 'day',
        'page': 'country',
        'section': 'affiliate',
    })
    raw_data['day'] = pd.to_datetime(raw_data['day']).apply(lambda d: d.strftime('%Y-%m-%d'))

    country_data = aggregate_data(raw_data, ['country', 'day'])
    affiliate_data = aggregate_data(raw_data, ['country', 'affiliate', 'day'])

    countries = [c for c in raw_data['country'].unique() if c is not None]
    metrics = ['views', 'leads', 'uniqueleads', 'sales', 'uniquesales', 'firstbillings', 'pixels', 'optout_24',
               'total_optouts', 'cost', 'cr', 'cq', 'resubs', 'releads', 'pixels_ratio', 'ecpa', 'active24']

    return countries, metrics, country_data, affiliate_data


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
        columns = ['ds', 'actual', 'yhat_lower', 'yhat', 'yhat_upper', 'severity', 'change']
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
    country, metrics, countries_data, affiliates_data = args
    log('processing [{}]...'.format(country))
    start_time = time()
    country_data = countries_data.loc[country]
    affiliate_data = affiliates_data.loc[country]
    country_affiliates = [
        a for a in affiliate_data.index.get_level_values('affiliate').unique() if a is not None
    ]
    anomalies_per_affiliate = []
    for affiliate in country_affiliates:
        anomalies_per_affiliate.append({
            'affiliate': affiliate,
            'metrics': parallize(get_anomalies, (affiliate_data.loc[affiliate],), metrics)
        })
    country_anomalies = {
        'country': country,
        'metrics': parallize(get_anomalies, (country_data,), metrics),
        'affiliates': anomalies_per_affiliate,
    }
    log('finished processing [{}] in seconds [{:.2f}]'.format(country, time() - start_time))
    return country_anomalies


class DaemonLessProcess(multiprocessing.Process):
    def _get_daemon(self):
        return False

    def _set_daemon(self, value):
        pass

    daemon = property(_get_daemon, _set_daemon)


class DaemonLessPool(multiprocessing.pool.Pool):
    Process = DaemonLessProcess


if __name__ == '__main__':
    countries, metrics, countries_data, affiliates_data = read_and_prepare_data(read_from_file=False)
    pool = DaemonLessPool()
    anomalies = pool.map(
        get_anomalies_per_country,
        [(country, metrics, countries_data, affiliates_data) for country in countries]
    )
    pool.close()
    pool.join()
    print(dumps(anomalies))
