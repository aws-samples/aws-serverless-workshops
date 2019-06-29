import boto3
import json
import os

client = boto3.client('s3')
bucket = os.environ['OUTPUT_BUCKET']

# events on the queue look like:
# {"name": "Shadowfax", "statustime": "2019-05-07 20:11:04.247", "latitude": 41.441963, "longitude": -73.574745, "distance": "29.212845", "healthpoints": "217", "magicpoints": "112", "groundstation": "USC00305799"}
def handler(event, context):
    print('## EVENT')
    print(event)
    for record in event['Records']:
        json_event = json.loads(record['body'])
        key = get_key_from_event_json(json_event)
        body = get_body_from_event_json(json_event)
        upload_file(body, key)
    return event

def get_key_from_event_json(event):
    return 'processed/' + event["statustime"] + '.csv'

def get_body_from_event_json(event):
    body = ",".join(event.keys()) + "\n"
    body = body + ",".join(map(str, event.values()))
    return body

def upload_file(body, key):
    client.put_object(Body=body, Bucket=bucket, Key=key)