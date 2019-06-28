import boto3
import json
import os

client = boto3.client('s3')
sqs = boto3.client('sqs')
queue_url = os.environ['OUTPUT_QUEUE']

def send_to_sqs(json_data):
	for entry in json_data['travel_data']:
		response = sqs.send_message(
			QueueUrl=queue_url,
			DelaySeconds=0,
			MessageBody=json.dumps(entry)
		)
	print('all rows sent to sqs')
     
def handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key'] 
        content_object = client.Object(bucket, key)
		file_content = content_object.get()['Body'].read().decode('utf-8')
		json_content = json.loads(file_content)
		send_to_sqs(json_content)
