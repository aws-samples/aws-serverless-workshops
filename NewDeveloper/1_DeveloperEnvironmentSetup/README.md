# Module 1: Developer Environment Setup

In this module you will deploy your developer environment to the dev AWS environment.  You will deploy the website, authentication and authorization, and ride request services.  Once the Wild Rydes services have been setup you will go through the registration process.  This involves registering, confirming your registration with the code mailed to you, and finally signing in.  Once you've signed in, right click on a spot on the map to set your pickup location.  Then click "Request Ride" in the top right to dispatch a ride.

At the end of this module you will:
* Have Serverless Framework Setup.
* Deployed your personal developer versions of the Wild Rydes services.

## Serverless Framework
[Serverless Framework](https://serverless.com/framework/) is the tool we use for deploying and managing our serverless systems.  It's DSL is based off of AWS CloudFormation which makes it easy to use and understand using existing CloudFormation knowledge and documentation.  However, it adds some niceties over CloudFromation which make us choose to use it instead.
1. Makes setup of functions, particularly around events easier.
1. Support for plugins to enhance functionality.
1. Support for local and remote invocation to aide testing.
1. Support for obtaining remote function logs.

### Instructions
To install and setup the software perform the following steps.
1. Install Serverless Framework and ensure it's installed properly by running the following commands.

```
$ npm install serverless -g
$ serverless version
1.26.1
```
2. Set $SLS_STAGE in your shell environment to prevent your deployments from conflicting with another developer's.  Normally you might set this to a PR or JIRA ID, but just use your initials instead for now.
```
$ export SLS_STAGE=%%YOUR_INITIALS%%
```

## Deploy Wild Rydes Services

Deploy the Wild Rydes services.

1. wild-rydes-website
1. wild-rydes-auth
1. wild-rydes-ride-requests


### wild-rydes-website

This service provides the web front end.  The site uses [S3's static website](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) serving capabilities.

To deploy the service.

#### 1. Install Serverless Framework Plugins

The _wild-rydes-website_ service relies on the [_serverless-s3-sync plugin_](https://github.com/k1LoW/serverless-s3-sync) to upload the contends of the [static/](./static) directory to S3 for serving.
```
$ cd wild-rydes-website
$ npm install
```

#### 2. Deploy to dev AWS account

Deploy the website service.  Be sure to use the `-v` flag because you will need the value of the `StaticSiteS3BucketWebsiteURL` stack output.  That will give you the location of your newly deployed website.
```
$ sls deploy -v
Serverless: Packaging service...

<SNIP>

Service Information
service: wild-rydes-website
stage: tmc
region: us-east-1
stack: wild-rydes-website-tmc
api keys:
  None
endpoints:
  None
functions:
  None

Stack Outputs
StaticSiteS3BucketName: wild-rydes-website-tmc.dev.training.serverlessops.io
StaticSiteS3BucketWebsiteURL: http://wild-rydes-website-tmc.dev.training.serverlessops.io
ServerlessDeploymentBucketName: wild-rydes-website-tmc-serverlessdeploymentbucket-1b7waeerbnown

S3 Sync: Syncing directories and S3 prefixes...
.
S3 Sync: Synced.
```

#### 3. Visit Wild Rydes Website

Open a browser and visit the website from the `StaticSiteS3BucketWebsiteURL` value in the previous step.  You can browse the site but not yet signup for an account.

_NOTE: S3 does not support HTTPS with custom domain names.  In order to handle that we would front the S3 site bucket with [AWS CloudFront](https://aws.amazon.com/cloudfront/).  Due to the time it takes to initially provision CloudFront we have dropped that service and use S3 over HTTP directly._

### wild-rydes-auth

This service provides the authentication and authorization services.  It will setup Cognito to handle authentication and authorization for Wild Rydes.  It also deploys a Lambda that is invoked during deploy that will update the website's configuration with the necessary Cognito pool and client information.  Once deployed, a user can sign up for Wild Rydes.  After entering an email address and password, they will be sent a confirmation email with a code to confirm their identity.

#### 1. Install Serverless Framework Plugins

The service uses two Serverless Framework plugins that need to be installed.

```
$ cd wild-rydes-website
$ npm install
```

#### 2. Deploy to dev AWS account

Deploy the authentication and authorization backend.  There's no need to obtain any of the stack outputs after deploying.

```
$ sls deploy -v
Serverless: Installing required Python packages with python3.6...
Serverless: Linking required Python packages...
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Unlinking required Python packages...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (210.05 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...

<SNIP>

Serverless: Stack update finished...
Service Information
service: wild-rydes-auth
stage: tmc
region: us-east-1
stack: wild-rydes-auth-tmc
api keys:
  None
endpoints:
  None
functions:
  UpdateCognitoConfig: wild-rydes-auth-tmc-UpdateCognitoConfig

Stack Outputs
UpdateCognitoConfigLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:144121712529:function:wild-rydes-auth-tmc-UpdateCognitoConfig:4
UserPoolClientId: 2bkbb38d8f439vc85j6e0qgjh6
UserPoolId: us-east-1_ZsnDWMmNm
UserPoolArn: arn:aws:cognito-idp:us-east-1:144121712529:userpool/us-east-1_ZsnDWMmNm
ServerlessDeploymentBucketName: wild-rydes-auth-tmc-serverlessdeploymentbucket-1i2hvkxsoyhst
```

#### 3. Register for Wild Rydes and Login

Click the "Giddy Up!" link in the middle of the page just below the Wild Rydes logo.  This will take you to the registration page (_/register.html_).  Enter a valid email, password, and confirm the password.  After clicking the "Let's Ryde" link you will be redirected to the verification page (_/verify.html_) and receive an email with a confirmation code.  Enter your email address you signed up with and confirmation code.  Once confirmed you'll be redirected to the signin page (_/signin.html_) and can login with your email address and password.

You'll be presented with an area map.  You will not be able to request a ride yet however.

### wild-rydes-ride-requests

This is the ride request service and the final part of the Wild Rydes platform.  The service takes requests from the frontend and returns ride information.  Requests are authenticated using the authorization token generated during login.  This also deploys a Lambda that will be invoked on deploy to update the website's configuration so it can find the URL to this service.

#### 1. Install Serverless Framework Plugins

This service uses two plugins:

- [serverless-python-requirements](https://github.com/UnitedIncome/serverless-python-requirements)
- [serverless-iam-roles-per-function](https://github.com/functionalone/serverless-iam-roles-per-function)

The _serverless-python-requirements_ plugin handles bundling module dependencies.  The dependencies for this project are listed in [requirements.txt](./requirements.txt).  During deployment this plugin will download dependencies and bundle them with the deployment artifact that Serverless Framework will upload to S3.  _NOTE: the boto3 dependency is not packaged for deployment.  It is only listed for local tsting to work.  The AWS Lambda runtime has already contains boto3 and this reduces package size as well as cold starts.  However, this also means the module version may change in production.  Breaking changes should not happen but it is possible._

The _serverless-iam-roles-per-function_ plugin let's us create different IAM roles for each Lambda function in the service.  By default, Serverless Framework creates a single IAM role for a service that is applied to each Lambda function.  However that means you may end up granting broad privileges to a function that does not require them.  As an example in this service, the function 


```
$ cd wild-rydes-ride-request
$ npm install
```

#### 2. Deploy to dev AWS Account

Deploy the ride request service.


```
$ sls deploy -v
Serverless: Installing required Python packages with python3.6...
Serverless: Linking required Python packages...
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Unlinking required Python packages...
Serverless: Tracing DISABLED for function "wild-rydes-ride-requests-tmc-RequestRide"
Serverless: Tracing DISABLED for function "wild-rydes-ride-requests-tmc-UpdateConfig"
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (3.54 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...

<SNIP>

Serverless: Stack update finished...
Service Information
service: wild-rydes-ride-requests
stage: tmc
region: us-east-1
stack: wild-rydes-ride-requests-tmc
api keys:
  None
endpoints:
  POST - https://63eef7b71g.execute-api.us-east-1.amazonaws.com/tmc/ride
functions:
  RequestRide: wild-rydes-ride-requests-tmc-RequestRide
  UpdateConfig: wild-rydes-ride-requests-tmc-UpdateConfig

Stack Outputs
RequestRideLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:144121712529:function:wild-rydes-ride-requests-tmc-RequestRide:41
UpdateConfigLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:144121712529:function:wild-rydes-ride-requests-tmc-UpdateConfig:41
ServiceEndpoint: https://63eef7b71g.execute-api.us-east-1.amazonaws.com/tmc
WildRydesApiInvokeUrl: https://63eef7b71g.execute-api.us-east-1.amazonaws.com/tmc
ServerlessDeploymentBucketName: wild-rydes-ride-requests-serverlessdeploymentbuck-dt7kzl9bq5nr
```

#### 3. Request A Ride

You can now request a ride in the site.  Right click the mouse on a location in the map to set a pickup point.  Then click "Request Ride" in the upper right.  You should see a unicorn make its way to your location.


