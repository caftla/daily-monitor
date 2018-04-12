from json import loads, dumps
from sys import stdin

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


def read_and_prepare_data():
    props_and_data = loads(stdin.readlines()[0])
    metrics = props_and_data['metrics']
    country = props_and_data['country']
    raw_data = props_and_data['stats']

    df = pd.DataFrame(raw_data)
    df = df.rename(columns={
        'row': 'time',
    })
    df['time'] = pd.to_datetime(df['time']).apply(lambda d: d.strftime('%Y-%m-%d'))
    return country, metrics, df


def get_anomalies(df, metric):
    anomalies = []
    data = df[['time', metric]].rename(columns={metric: 'value'})
    metric_anomalies = Detector(min_time_points=5, min_dataset_size=0).forecast_today(dataset=data)
    if not metric_anomalies.empty:
        columns = ['ds', 'actual', 'yhat_lower', 'yhat', 'yhat_upper', 'severity', 'change']
        metric_anomalies['ds'] = pd.to_datetime(metric_anomalies['ds'], unit='ms') \
            .apply(lambda ds: ds.strftime('%Y-%m-%d'))
        anomalies = loads(metric_anomalies[columns].iloc[0].to_json())
    return anomalies


country, metrics, stats = read_and_prepare_data()
get_logger('Start processing [%s]' % country)
anomalies = {}
for metric in metrics:
    anomalies[metric] = get_anomalies(stats, metric)
get_logger('Country: [%s], Anomalies: [%s]' % (country, dumps(anomalies)))

print(dumps(anomalies))
