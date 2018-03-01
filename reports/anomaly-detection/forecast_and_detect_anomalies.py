from json import dumps
from sys import stdin

import pandas as pd
from sam_anomaly_detector import Detector

raw_data = stdin.readlines()[0]
data = pd.read_json(raw_data, orient='records')
anomalies = Detector(min_time_points=0, min_dataset_size=0).forecast_today(dataset=data)
print(dumps(anomalies.to_json(orient='records')))
