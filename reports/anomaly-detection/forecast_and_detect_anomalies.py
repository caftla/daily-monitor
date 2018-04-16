from json import loads, dumps
from sys import stdin
from time import time

import numpy as np
import pandas as pd
from sam_anomaly_detector import Detector


def get_logger(message):
    # import logging
    # from logging.handlers import SysLogHandler
    # logger = logging.getLogger()
    # logger.setLevel(logging.INFO)
    # formatter = logging.Formatter("[%(levelname)s] %(message)s")
    # file_handler = SysLogHandler('/dev/log')
    # file_handler.setFormatter(formatter)
    # logger.addHandler(file_handler)
    # return logger
    import syslog
    syslog.syslog(syslog.LOG_INFO, '[INFO] ' + message)


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
        raw_data = pd.read_json('data.json')
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


def get_anomalies(df, metric) -> dict:
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
    return anomalies


if __name__ == '__main__':
    get_logger('loading data...')
    countries, metrics, country_data, affiliate_data = read_and_prepare_data()
    get_logger('data loaded')
    anomalies = []
    for country in countries:
        start_time = time()
        get_logger('processing [{}]...'.format(country))
        anomalies_for_whole_country = {}
        for metric in metrics:
            anomalies_for_whole_country[metric] = get_anomalies(country_data.loc[country], metric)

        country_affiliates = [
            a for a in affiliate_data.loc[country].index.get_level_values('affiliate').unique() if a is not None
        ]
        anomalies_per_affiliate = []
        for affiliate in country_affiliates:
            affiliate_metric_anomalies = {}
            for metric in metrics:
                affiliate_metric_anomalies[metric] = get_anomalies(affiliate_data.loc[country].loc[affiliate], metric)
            anomalies_per_affiliate.append({
                'affiliate': affiliate,
                'metrics': affiliate_metric_anomalies
            })

        country_anomalies = {
            'country': country,
            'metrics': anomalies_for_whole_country,
            'affiliates': anomalies_per_affiliate,
        }
        get_logger('anomalies in [{}] seconds: [{}]'.format(time() - start_time, dumps((country_anomalies))))
        anomalies.append(country_anomalies)

        print(dumps(anomalies))
