# https://docs.aws.amazon.com/lambda/latest/dg/python-programming-model-handler-types.html

# Function Name:
# Find Closest Groundstation (function B)

# Function Path:
# MachineLearning/1_DataProcessing/lambda-functions/2-transform-data-output-to-s3/lambda_function.py

from math import cos, asin, sqrt
import boto3
import json
import os

s3 = boto3.client('s3')
bucket = os.environ['OUTPUT_BUCKET']

def lambda_handler(event, context):
    print('## EVENT')
    print(event)
    for record in event['Records']:
        json_event = json.loads(record['body'])
        json_event = event_format_check(json_event)
        json_event["groundstation"] = closest(groundstations(),
                                            {"latitude": json_event["latitude"], "longitude": json_event["longitude" ]})["id"]
        print('Closest weatherstation for ', json_event["latitude"], ', ', json_event["longitude"], ' is ', json_event["groundstation"])
        # events look like:
        # {"name": "Shadowfax", "statustime": "2019-05-07 20:11:04.247", "latitude": 41.441963, "longitude": -73.574745, "distance": "29.212845", "healthpoints": "217", "magicpoints": "112", "groundstation": "USC00305799"}
        send_event_to_s3(json_event)
    return event

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

def send_event_to_s3(event):
    key = get_key_from_event_json(event)
    body = get_body_from_event_json(event)
    upload_file(body, key)

def get_key_from_event_json(event):
    return 'processed/' + event["statustime"] + '.csv'

def get_body_from_event_json(event):
    body = ",".join(event.keys()) + "\n"
    body = body + ",".join(map(str, event.values()))
    return body

def upload_file(body, key):
    s3.put_object(Body=body, Bucket=bucket, Key=key)
