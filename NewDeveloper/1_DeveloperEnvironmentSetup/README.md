# Module 1: Developer Environment Setup

In this module you will deploy your developer environment to the dev AWS environment.  You will deploy the website, authentication and authorization, and ride request services.  Once the Wild Rydes services have been setup you will go through the registration process.  This involves registering, confirming your registration with the code mailed to you, and finally signing in.  Once you've signed in, right click on a spot on the map to set your pickup location.  Then click "Request Ride" in the top right to dispatch a ride.


At the end of this module you will:
* Have Serverless Framework Setup.
* Deployed your personal developer versions of the Wild Rydes services.

## Serverless Framework
[Serverless Framework](https://serverless.com/framework/) is the tool we use for deploying and managing our serverless systems.  It's DSL is based off of AWS CloudFormation which makes it easy to use and understand using existing CloudFormation knowledge and documentation.  However, it adds some niceties over CloudFromation which make us choose to use it instead.
1. Makes setup of functions, particularly around events easier.
1. Support for plugins to enhance functionality.
1. Support for obtaining function metrics and logs


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
deploy the Wild Rydes services.

1. wild-rydes-website
1. wild-rydes-auth
1. wild-rydes-ride-requests


### SERVICE 1
Deploy and get X from outputs

### SERVICE 2
Deploy and get X from outputs


## Logging into Wild Rydes
__FIXME:__ %%SHOULD THEY REGISTER WITH THEIR OWN OR IN DEV%%
