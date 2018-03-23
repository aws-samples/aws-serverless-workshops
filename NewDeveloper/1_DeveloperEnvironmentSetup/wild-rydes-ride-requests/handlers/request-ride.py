'''Request a ride'''

import datetime
import logging
import json
import os
import random
import string

import boto3

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))  # type:ignore
_logger = logging.getLogger(__name__)

# DynamoDB
DYNAMODB_TABLE = os.environ.get('DYNAMODB_TABLE')
dynamodb = boto3.resource('dynamodb')
ddt = dynamodb.Table(DYNAMODB_TABLE)

FLEET = [
    {
        'Name': 'Bucephalus',
        'Color': 'Golden',
        'Gender': 'Male',
    },
    {
        'Name': 'Shadowfax',
        'Color': 'White',
        'Gender': 'Male',
    },
    {
        'Name': 'Rocinante',
        'Color': 'Yellow',
        'Gender': 'Female',
    },

]


def _get_ride(user, pickup_location):
    '''Get a ride.'''
    ride_id = ''.join(random.choice(string.digits + string.ascii_letters) for _ in range(16))
    unicorn = _get_unicorn()
    ride_info = _record_ride(ride_id, user, unicorn)
    eta = _get_unicorn_eta(unicorn, pickup_location)

    resp = {
        'RideId': ride_id,
        'Unicorn': unicorn,
        'UnicornName': unicorn.get('Name'),
        'Eta': '{} Seconds'.format(eta),
        'Rider': user,
    }

    return resp


def _get_unicorn():
    '''Return a unicorn from the fleet'''
    return FLEET[random.randint(0, len(FLEET) - 1)]


def _get_unicorn_eta(unicorn, pickup_location):
    '''Get arrival eta of unicorn.  Returns eta seconds as int.'''

    # This was found to be reasonably accurate and far cheaper than other
    # solutions tried.
    return 30


def _get_pickup_location(body):
    '''Return pickup location from event'''
    return body.get('PickupLocation')


def _get_authorizer_from_event(event):
    '''Get authorizer from event.'''
    return event.get('requestContext').get('authorizer')


def _get_user_from_authorizer(authorizer):
    '''Get username from authentication provider'''
    return authorizer.get('cognito:username')


def _record_ride(ride_id, user, unicorn):
    '''Record a ride.'''
    item = {
        'RideId': ride_id,
        'User': user,
        'Unicorn': unicorn,
        'UnicornName': unicorn.get('Name'),
        'RequestTime': str(datetime.datetime.now()),
    }

    ddt.put_item(
        TableName=DYNAMODB_TABLE,
        Item=item
    )

    return item


def handler(event, context):
    '''Function entry'''
    _logger.debug('Request: {}'.format(json.dumps(event)))

    authorizer = _get_authorizer_from_event(event)
    if authorizer is None:
        _logger.error('Authorization not configured')
        error_msg = {'error': 'There seems to be an error on our end.'}

        resp = {
            'statusCode': 500,
            'body': json.dumps(error_msg)
        }

    else:
        user = _get_user_from_authorizer(authorizer)
        body = json.loads(event.get('body'))
        pickup_location = _get_pickup_location(body)
        ride_resp = _get_ride(user, pickup_location)

        resp = {
            'statusCode': 201,
            'body': json.dumps(ride_resp),
            'headers': {
                "Access-Control-Allow-Origin": "*",
            }
        }

    return resp

