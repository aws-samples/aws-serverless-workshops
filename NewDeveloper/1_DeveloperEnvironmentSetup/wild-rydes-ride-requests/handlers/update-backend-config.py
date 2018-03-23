'''Update with location of backend'''

import boto3
import json
import logging
import os

import cfn_resource

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))  # type: ignore
_logger = logging.getLogger(__name__)

s3 = boto3.resource('s3')
S3_OBJECT = 'js/config.js'

handler = cfn_resource.Resource()


def _get_properties_from_event(event):
    '''Return ResourceProperties from event.'''
    return event.get('ResourceProperties')


def _add_backend_url(event, context):
    '''Add the invoke URL to frontend config.'''
    properties = _get_properties_from_event(event)

    bucket = properties['Bucket']
    config_object = s3.Object(bucket, S3_OBJECT).get()
    config_data = config_object["Body"].read().decode()
    config_data = config_data.replace("Base URL of your API including the stage", properties["InvokeUrl"])
    config = s3.Object(bucket, S3_OBJECT)
    config.put(Body=config_data)

    resp = {
        "ResourceProperties": properties,
        "PhysicalResourceId": context.log_stream_name
    }

    return resp


@handler.create
def create(event, context):
    '''Create'''
    _logger.info('Create event: {}'.format(json.dumps(event)))
    return _add_backend_url(event, context)


@handler.update
def update(event, context):
    '''Update config resource'''
    _logger.info('Update event: {}'.format(json.dumps(event)))
    return _add_backend_url(event, context)


@handler.delete
def delete(event, context):
    '''Delete Cognito config'''
    _logger.info('Delete event: {}'.format(json.dumps(event)))
    properties = _get_properties_from_event(event)

    # bucket = properties['Bucket']
    # config = s3.Object(bucket, S3_OBJECT)
    # FIXME: This will break tearing down cognito
    # config.delete()

    resp = {
        "ResourceProperties": properties,
        "PhysicalResourceId": context.log_stream_name
    }

    return resp


