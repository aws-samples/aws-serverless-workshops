import os
import json
import cfnresponse

import boto3
from botocore.exceptions import ClientError

client = boto3.client('s3')

import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info("Received event: %s" % json.dumps(event))
    source_bucket = event['ResourceProperties']['SourceBucket']
    source_prefix = event['ResourceProperties'].get('SourcePrefix') or ''
    bucket = event['ResourceProperties']['Bucket']
    prefix = event['ResourceProperties'].get('Prefix') or ''

    result = cfnresponse.SUCCESS

    try:
        if event['RequestType'] == 'Create' or event['RequestType'] == 'Update':
            result = copy_objects(source_bucket, source_prefix, bucket, prefix)
        elif event['RequestType'] == 'Delete':
            result = delete_objects(bucket, prefix)
    except ClientError as e:
        logger.error('Error: %s', e)
        result = cfnresponse.FAILED

    cfnresponse.send(event, context, result, {})


def copy_objects(source_bucket, source_prefix, bucket, prefix):
    paginator = client.get_paginator('list_objects_v2')
    page_iterator = paginator.paginate(Bucket=source_bucket, Prefix=source_prefix)
    for key in {x['Key'] for page in page_iterator for x in page['Contents']}:
        source_key = key
        dest_key = os.path.join(prefix, os.path.relpath(key, source_prefix))
        print 'copy {} to {}'.format(key, dest_key)
        client.copy_object(CopySource={'Bucket': source_bucket, 'Key': key}, Bucket=bucket, Key=dest_key)
    return cfnresponse.SUCCESS


def delete_objects(bucket, prefix):
    paginator = client.get_paginator('list_objects_v2')
    page_iterator = paginator.paginate(Bucket=bucket, Prefix=prefix)
    objects = [{'Key': x['Key']} for page in page_iterator for x in page['Contents']]
    client.delete_objects(Bucket=bucket, Delete={'Objects': objects})
    return cfnresponse.SUCCESS
