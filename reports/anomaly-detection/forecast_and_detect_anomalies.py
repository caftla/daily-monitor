from json import dumps
from sys import stdin

from sam_anomaly_detector import Detector

raw_data = stdin.readlines()[0]
anomalies = Detector().find_all_anomalies(dataset=raw_data)
print(dumps(anomalies))
