import boto3
import json
import os

# Function Name:
# Process Unicorn Data (function #1)

# Function Path:
# MachineLearning/1_DataProcessing/lambda-functions/1-process-s3-event-fan-out/index.py

client = boto3.client('s3')
sqs = boto3.client('sqs')
queue_url = os.environ['OUTPUT_QUEUE']

def send_to_sqs(json_data):
  data = json_data
  if 'travel_data' in json_data:
    data = json_data['travel_data']

  counter = 0
  for entry in data:
    lower_cased = {k.lower(): v for k, v in entry.items()}
    response = sqs.send_message(
      QueueUrl=queue_url,
      DelaySeconds=0,
      MessageBody=json.dumps(lower_cased)
    )
    counter = counter + 1
    print('Sent ', counter, ' data entries')
  print('all rows sent to sqs')

def lambda_handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        content_object = client.get_object(Bucket=bucket, Key=key)
    file_content = content_object['Body'].read().decode('utf-8')
    json_content = json.loads(file_content)
    send_to_sqs(json_content)
