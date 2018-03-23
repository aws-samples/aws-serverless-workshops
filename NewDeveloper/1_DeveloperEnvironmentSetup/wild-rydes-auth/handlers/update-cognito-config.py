'''Update Cognito setup for application.'''
import boto3
import os
import json
import logging

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


def _set_config_contents(event, context):
    '''Set contents of config file'''
    properties = _get_properties_from_event(event)

    userPoolId = properties['UserPool']
    clientId = properties['Client']
    region = properties['Region']
    bucket = properties['Bucket']

    config_content = """
    var _config = {
        cognito: {
            userPoolId: '%s', // e.g. us-east-2_uXboG5pAb
            userPoolClientId: '%s', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
            region: '%s', // e.g. us-east-2
        },
        api: {
            invokeUrl: 'Base URL of your API including the stage', // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod'
        }
    };
        """
    config_content = config_content % (userPoolId, clientId, region)
    config = s3.Object(bucket, S3_OBJECT)
    config.put(Body=config_content)

    resp = {
        "ResourceProperties": properties,
        "PhysicalResourceId": context.log_stream_name
    }
    return resp


@handler.create
def create(event, context):
    '''Create Cognito config'''
    _logger.info('Create event: {}'.format(json.dumps(event)))
    return _set_config_contents(event, context)


@handler.update
def update(event, context):
    '''Update Cognito config'''
    _logger.info('Update event: {}'.format(json.dumps(event)))
    return _set_config_contents(event, context)


@handler.delete
def delete(event, context):
    '''Delete Cognito config'''
    _logger.info('Delete event: {}'.format(json.dumps(event)))
    properties = _get_properties_from_event(event)

    bucket = properties['Bucket']
    config = s3.Object(bucket, S3_OBJECT)
    config.delete()

    resp = {
        "ResourceProperties": properties,
        "PhysicalResourceId": context.log_stream_name
    }
    return resp

