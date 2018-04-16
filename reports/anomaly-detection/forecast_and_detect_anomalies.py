from json import loads, dumps
from sys import stdin

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


def read_and_prepare_data():
    json_input = loads(stdin.readlines()[0])
    df = pd.DataFrame(json_input['data'])
    # df = pd.read_json('~/Desktop/data.json')

    df = df.rename(columns={
        'row': 'day',
        'page': 'country',
        'section': 'affiliate',
    })
    df['day'] = pd.to_datetime(df['day']).apply(lambda d: d.strftime('%Y-%m-%d'))
    data = (
        df.rename(columns={
            'page': 'country',
            'section': 'affiliate',
        })
            .groupby(['country', 'day'])
            .agg({
            'views': 'sum',
            'leads': 'sum',
            'uniqueleads': 'sum',
            'sales': 'sum',
            'uniquesales': 'sum',
            'paid_sales': 'sum',
            'firstbillings': 'sum',
            'pixels': 'sum',
            'optout_24': 'sum',
            'day_optouts': 'sum',
            'total_optouts': 'sum',
            'cost': 'sum',
        })
            .assign(cr=lambda d: safediv(d.sales, d.views))
            .assign(cq=lambda d: safediv(d.firstbillings, d.sales))
            .assign(resubs=lambda d: safediv(d.sales, d.uniquesales))
            .assign(releads=lambda d: safediv(d.leads, d.uniqueleads))
            .assign(pixels_ratio=lambda d: safediv(d.pixels, d.sales))
            .assign(ecpa=lambda d: safediv(d.cost, d.sales))
            .assign(active24=lambda d: safediv(d.sales - d.optout_24, d.sales))
            .fillna(0)
    )

    countries = [c for c in df['country'].unique() if c is not None]
    metrics = ['views', 'leads', 'uniqueleads', 'sales', 'uniquesales', 'paid_sales', 'firstbillings', 'pixels',
               'optout_24', 'day_optouts', 'total_optouts', 'cost', 'cr', 'cq', 'resubs', 'releads', 'pixels_ratio',
               'ecpa', 'active24']

    return data, countries, metrics


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


data, countries, metrics = read_and_prepare_data()
anomalies = []
for country in countries:
    metric_anomalies = {}
    for metric in metrics:
        metric_anomalies[metric] = get_anomalies(data.loc[country], metric)
    country_metric_anomalies = {
        'country': country,
        'metrics': metric_anomalies
    }
    get_logger('Anomalies: [{}]'.format(dumps(country_metric_anomalies)))
    anomalies.append(country_metric_anomalies)

print(dumps(anomalies))
