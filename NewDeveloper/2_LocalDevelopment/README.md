# Module 2: Development Workflow

At the end of this module you will have.

1. Added a feature to Ride Requests
1. Tested the feature locally
1. Invoked the feature remotely and checked logs.
1. Tested the feature remotely.

## Instructions

### Promo Discount Service
The promo discount service returns a JSON doc with a discount multiplier.  The Request Ride function will store that multiplier with the ride request info so that any potential discount can be applied when billing the customer.

#### 1. Deploy Promo Discount service

```
$ cd wild-rides-promo-discount
$ npm install
$ sls deploy -v
```

#### 2. Discount Promo API

The API for the Promo service is as follows.  Be sure to replace _WildRydesGetPromoDiscountUrl_ with the value of the output from he previous step.

Request:
```
POST /promo - data: {"User": "UserName", "PickupLocation": {}}

curl -X POST -H "Content-type: application/json" -d '{"User": "UserName", "PickupLocation": {00, 00}}' <WildRydesGetPromoDiscountUrl>
```

Response: 200 OK
```
{"DiscountMultiplier": decimal}
```

### Add Promo Feature to Ride Request

Once the Promo Discount service has been deployed, the Ride Request service needs to be updated to call it.  You have two options for this.  You can either update [wild-rydes-ride-requests](./wild-rydes-ride-requests) with your own idea or you can simply deploy from the [wild-rydes-ride-requests-updated](./wild-rydes-ride-requests-updated) directory.  Inside the _wild-rydes-ride-requests-updates_ directory running `git diff NewDeveloper-1` will show your our solution.


You will need to edit two files.

* serverless.yml
* handlers/request_ride.py

Once you've either developed your own feature implementation or chosen our own implementation, follow the instructions below.

#### 1. Install Serverless Framework Plugins
Install the service's Serverless Framework plugins that are used.  (`cd`` into wild-rydes-ride-requests to test your own changes.)

```
$ cd wild-rydes-ride-requests-updated
$ npm install
```

#### 2. Install Python dependencies.

Install both service depndencies and development dependencies using `pip`.  Optionally you may want to create a virtualenv for this project to keep these depndencies from being installed globally.

```
$ pyenv virtualenv -p ptyhon3.6 3.6.4 wild-rydes-ride-request   # optional
$ pyenv local wild-rydes-ride-request   # optional
$ pip install -r requirements.txt
$ pip install -r requirements-dev.txt
```

#### 3. Run unit tests

Run the init tests for the service.  This test your function locally.  We use the [moto module](http://docs.getmoto.org/en/latest/) to mock AWS services.  All unit tests must pass.  You may wish to explore the unit tests we've written and add more.

```
$ pytest tests/unit
```

### Deploy to personal dev environment

Once unit tests have passed then your service can be deloyed to your personal environment in AWS.  There we'll invoke the function with a test event and then run integration tests.

#### 1. Deploy to personal environment

Deploy your function to AWS.
```
sls deploy
```

#### 2. Invoke function with test event

Serverless Framework can be used to invoke a remote function.  We will bypass the API GAteway and send it an event similar to what API Gateway would send. The event we are going tos end is [tests/events/request-ride-event.json](./tests/events/request-ride-event.json)
```
$ sls invoke -f RequestRide -p tests tests/events/request-ride-event.json
```

#### 3. Run integration tests

Finally, run an integration test.  These will test not just the function but interaction with both API GAteway and Cognito.
```
$ pytest tests/integration
```


