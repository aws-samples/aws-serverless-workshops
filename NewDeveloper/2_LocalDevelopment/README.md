# Module 2: Development Workflow

In this this module you will develop, test, and deploy a new feature to your personal environment in dev.  You will go through unit testing the feature, invoking Ride Request remotely while tailing CloudWatch Logs.  Finally, you will run integration tests

__Objectives:__
* Added a feature to Ride Requests.
* Unit test the feature locally using Moto to mock services.
* Invoke the feature remotely and checked logs for errors.
* Integration Test the feature remotely to ensure

__Questions:__
* Where is the security risk we've potentially just introduced? <!-- Promo services is not authenticated -->
* How did we have service discovery between Ride Reuests and Promo Discount.

## Instructions

### Promo Discount Service
The Promo Discount service returns a JSON doc with a discount multiplier.  The Request Ride function will store that multiplier with the ride request info that it writes to DynamoDB.

#### 1. Deploy Promo Discount service

Deploy yhe new Promo Discount service to your personal environment.  After it has been deploy, note the value of the _WildRydesGetPromoDiscountUrl_ output.
```
$ cd wild-rides-promo-discount
$ npm install
$ sls deploy -v
Serverless: Installing requirements of requirements.txt in .serverless...
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Injecting required Python packages to package...
Serverless: Tracing DISABLED for function "wild-rydes-promo-discount-user0-GetPromoDiscount"
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (2.29 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...

<SNIP>

Serverless: Stack update finished...
Service Information
service: wild-rydes-promo-discount
stage: user0
region: us-east-1
stack: wild-rydes-promo-discount-user0
api keys:
  None
endpoints:
  POST - https://n3hqtd8jl6.execute-api.us-east-1.amazonaws.com/user0/promo
functions:
  GetPromoDiscount: wild-rydes-promo-discount-user0-GetPromoDiscount

Stack Outputs
GetPromoDiscountLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:144121712529:function:wild-rydes-promo-discount-user0-GetPromoDiscount:2
WildRydesGetPromoDiscountUrl: https://n3hqtd8jl6.execute-api.us-east-1.amazonaws.com/user0/promo
WildRydesPromoDiscountInvokeUrl: https://n3hqtd8jl6.execute-api.us-east-1.amazonaws.com/user0
ServiceEndpoint: https://n3hqtd8jl6.execute-api.us-east-1.amazonaws.com/user0
ServerlessDeploymentBucketName: wild-rydes-promo-discoun-serverlessdeploymentbuck-2w5c6pq9b3ff
```

#### 2. Discount Promo API

The API for the Promo service is as follows.  Be sure to replace _WildRydesGetPromoDiscountUrl_ with the value of the output from he previous step.

__Request:__
```
POST data: {"User": "UserName", "PickupLocation": {00, 00}} /promo

curl -X POST -H "Content-type: application/json" -d '{"User": "UserName", "PickupLocation": {00, 00}}' <WildRydesGetPromoDiscountUrl>
```

__Response:__ 200 OK
```
{"DiscountMultiplier": decimal}
```

### Add Promo Feature to Ride Request

Once the Promo Discount service has been deployed, the Ride Request service needs to be updated to call it.  You have two options for this.  You can either update [wild-rydes-ride-requests](./wild-rydes-ride-requests) with your own idea or you can simply deploy from the [wild-rydes-ride-requests-updated](./wild-rydes-ride-requests-updated) directory.  From inside the _wild-rydes-ride-requests-updates_ directory running `git diff NewDeveloper-1` will show you our solution.


You will need to edit two files.

* [serverless.yml](https://github.com/ServerlessOpsIO/wild-rydes-ride-requests/blob/56a2a8b2600d993fe23921e0123e09f91f415525/serverless.yml#L51-L53)
* [handlers/request_ride.py](https://github.com/ServerlessOpsIO/wild-rydes-ride-requests/blob/56a2a8b2600d993fe23921e0123e09f91f415525/handlers/request_ride.py#L133-L137)

Once you've either developed your own feature implementation or chosen our own implementation, follow the instructions below.

#### 1. Install Serverless Framework Plugins
Install the service's Serverless Framework plugins that are used.  (`cd` into wild-rydes-ride-requests to test your own changes.)

```
$ cd wild-rydes-ride-requests-updated
$ npm install
```

#### 2. Install Python dependencies.

Install both service dependencies and development dependencies using `pip`.  Optionally you may want to create a virtualenv for this project to keep these dependencies from being installed globally.

```
$ pyenv virtualenv -p ptyhon3.6 3.6.4 wild-rydes-ride-request   # optional
$ pyenv local wild-rydes-ride-request   # optional
$ pip install -r requirements.txt
$ pip install -r requirements-dev.txt
```

#### 3. Run unit tests

Run the init tests for the service.  This test your function locally.  We use the [moto module](http://docs.getmoto.org/en/latest/) to mock AWS services.  All unit tests must pass.  You may wish to explore the unit tests we've written and add more.

```python
@mock_sts   # Let's us handle assumed roles.
@mock_dynamodb2
def test__record_ride(ride, ride_id):
    '''Test recording a ride'''
    ddb = boto3.client('dynamodb')

    # Create mock DynamoDB table
    ddb.create_table(
        TableName=DYNAMODB_TABLE,
        KeySchema=[
            {
                'AttributeName': DYNAMODB_HASH_KEY,
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[{'AttributeName': DYNAMODB_HASH_KEY,
                               'AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 1,
                               'WriteCapacityUnits': 1}
    )

    # Record ride to Mock DDB table.
    h._record_ride(ride)

    # Fecth and compare item written against item expected.
    this_item = ddb.get_item(TableName=DYNAMODB_TABLE,
                             Key={DYNAMODB_HASH_KEY: {'S': ride_id}})

    assert this_item.get('Item').get(DYNAMODB_HASH_KEY).get('S') == ride_id
```

When you're satisfied with the unit tests available, run `pytest`.

```
$ pytest tests/unit
```

### Deploy to personal dev environment

Once unit tests have passed then your service can be deployed to your personal environment in AWS.  There we'll invoke the function with a test event and then run integration tests.

#### 1. Tail CloudWatch logs
In a different terminal, change directory into the _wild-rydes-ride-requests-updated_ or _wild-rydes-ride-requests_ directory.  Here we'll setup a log tail so we may watch out function's logs as it executes.  This practice will save you time over going into the AWS CLoudWatch logs and shrink your development feedback loop.

```
sls logs -f RequestRide -t
```

#### 2. Deploy to personal environment

Deploy your updated Ride Request function to AWS.
```
sls deploy
```

#### 3. Invoke function with test event

Serverless Framework can be used to invoke a remote function.  We will bypass the API Gateway and send it an event similar to what API Gateway would send. The event we are going to send is [tests/events/request-ride-event.json](./tests/events/request-ride-event.json)  You can watch your logs window to see that your function was invoked.

```
$ sls invoke -f RequestRide -p tests tests/events/request-ride-event.json
```

#### 4. Run integration tests

Finally, run an integration test.  These will test not just the function but interaction with both API Gateway and Cognito. All tests should pass.
```
$ pytest tests/integration
```


