import boto3
import json
import os

client = boto3.client('s3')
sqs = boto3.client('sqs')
queue_url = os.environ['OUTPUT_QUEUE']

def send_to_sqs(json_data):
  for entry in json_data['travel_data']:
    lower_cased = {k.lower(): v for k, v in entry.items()}
    response = sqs.send_message(
      QueueUrl=queue_url,
      DelaySeconds=0,
      MessageBody=json.dumps(lower_cased)
    )
  print('all rows sent to sqs')
    
def handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key'] 
        content_object = client.get_object(Bucket=bucket, Key=key)
    file_content = content_object['Body'].read().decode('utf-8')
    json_content = json.loads(file_content)
    send_to_sqs(json_content)
