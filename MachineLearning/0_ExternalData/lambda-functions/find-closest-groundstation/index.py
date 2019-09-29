# https://docs.aws.amazon.com/lambda/latest/dg/python-programming-model-handler-types.html

from math import cos, asin, sqrt
import boto3
import json
import os

sqs = boto3.client('sqs')
queue_url = os.environ['OUTPUT_QUEUE']

def handler(event, context):
    print('## EVENT')
    print(event)
    for record in event['Records']:
        json_event = json.loads(record['body'])
        json_event = event_format_check(json_event)
        json_event["groundstation"] = closest(groundstations(),
                                            {"latitude": json_event["latitude"], "longitude": json_event["longitude" ]})["id"]
        json_event = label_heavy_magic_utilization(json_event)
        send_message_sqs(json_event)
    return event

def label_heavy_magic_utilization(event):
    magic_per_distance = 50
    event['heavy_utilization'] = int(event['magicpoints'] >= (event['distance'] * magic_per_distance))
    return event

def send_message_sqs(event):
    response = sqs.send_message(
        QueueUrl=queue_url,
        DelaySeconds=0,
        MessageBody=json.dumps(event)
    )
    print(response['MessageId'])

def event_format_check(event):
    event["latitude"] = float(event["latitude"])
    event["longitude"] = float(event["longitude"])
    return event

def distance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
    return 12742 * asin(sqrt(a))

def closest(listOfStations, target):
    return min(listOfStations,
                key=lambda p: distance(target['latitude'],target['longitude'],p['latitude'],p['longitude']))

def groundstations():
    return [{"id": "US1NYNY0074",  "latitude": 40.7969, "longitude": -73.9330, "elevation": 6.1},
        {"id": "USW00014732",  "latitude": 40.7794, "longitude": -73.8803, "elevation": 3.4},
        {"id": "USW00094728",  "latitude": 40.7789, "longitude": -73.9692, "elevation": 39.6},
        {"id": "USW00094789",  "latitude": 40.6386, "longitude": -73.7622, "elevation": 3.4}]
