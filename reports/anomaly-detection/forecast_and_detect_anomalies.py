from json import dumps
from sys import stdin

import pandas as pd
from sam_anomaly_detector import Detector

raw_data = stdin.readlines()[0]
data = pd.read_json(raw_data, orient='records')
data['time'] = pd.to_datetime(data['time']).apply(lambda d: d.strftime('%Y-%m-%d'))
anomalies = Detector(min_time_points=0, min_dataset_size=0).forecast_today(dataset=data)
columns = []
if not anomalies.empty:
    columns = ['ds', 'actual', 'yhat_lower', 'yhat', 'yhat_upper', 'change', 'stdChange']
    anomalies['ds'] = pd.to_datetime(anomalies['ds'], unit='ms').apply(lambda ds: ds.strftime('%Y-%m-%d'))
print(dumps(anomalies[columns].to_json(orient='records')))
