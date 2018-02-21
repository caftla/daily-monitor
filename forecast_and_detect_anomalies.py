from json import dumps
from os import makedirs
from sys import stdin

import pandas as pd
from sam_anomaly_detector import Detector


def load_data():
    raw_data = stdin.readlines()[0]
    data = pd.read_json(raw_data)
    data.to_csv('data/raw_data.csv', na_rep='NA')
    # data = pd.read_csv('data/raw_data.csv')
    return data


def store(data, country, section, column):
    path = 'data/{}/{}'.format(country, section)
    makedirs(path, exist_ok=True)
    data.to_csv(
        '{}/{}.csv'.format(path, column),
        na_rep='NA',
        header=['value'],
        columns=[column],
        index_label='time',
    )


data = load_data()
anomalies = pd.DataFrame()

for country in data['page'].unique():
    # print('\n' + country, end=' ', flush=True)
    country_data = data[data['page'] == country]
    for section in country_data['section'].unique():
        # print('.', end='', flush=True)
        section_data = country_data[country_data['section'] == section]
        for metric in ['views', 'leads', 'sales', 'uniquesales', 'uniqueleads', 'pixels', 'paid_sales', 'firstbillings',
                       'uniquesales', 'optout_24', 'total_optouts', 'cost']:
            store(section_data, country, section, metric)
            metric_data = section_data[['row', metric]].rename(columns={'row': 'time', metric: 'value'})
            metric_data['time'] = metric_data['time'].map(lambda t: t[:t.find('T')])
            metric_data_anomalie = Detector(min_time_points=1, min_dataset_size=1).forecast_today(dataset=metric_data)
            metric_data_anomalie['country'] = country
            metric_data_anomalie['section'] = section
            metric_data_anomalie['criterion'] = metric
            anomalies = anomalies.append(metric_data_anomalie)

print(dumps(anomalies.to_json(orient='records')))
