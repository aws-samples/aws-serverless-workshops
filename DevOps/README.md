# Serverless DevOps Workshop

In this workshop you'll deploy a RESTful API that enables users to manage the Wild Rydes Unicorn Stable.  You will use the [Serverless Application Model (SAM)](https://github.com/awslabs/serverless-application-model) to deploy the API interfaces, business logic, and database into your AWS account.  The RESTful API will allow a user to list, create, view, update, and delete the unicorns in the Wild Rydes stable.

The application architecture uses [AWS Lambda](https://aws.amazon.com/lambda/), [Amazon API Gateway](https://aws.amazon.com/api-gateway/), and [Amazon DynamoDB](https://aws.amazon.com/dynamodb/).  The API is built using Lambda and API Gateway, using DynamoDB as a persistent data store for unicorn data.

See the diagram below for a depiction of the API architecture.

![Wild Rydes DevOps RESTful API Application Architecture](images/wildrydes-devops-api-architecture.png)

The DevOps Continuous Delivery Pipeline uses [AWS CodePipeline](https://aws.amazon.com/codepipeline/), [AWS CodeBuild](https://aws.amazon.com/codebuild/), and [Amazon S3](https://aws.amazon.com/s3/).  CodePipeline orchestrates the steps to build, test, and deploy your code changes.  CodeBuild compiles source code, runs tests, and produces software packages that are ready to deploy to environments.

See the screenshot below for a depiction of the continuous delivery pipeline that you will build at the completion of Module 4.

![Wild Rydes Unicorn API Continuous Delivery Pipeline](images/codepipeline-final.png)

If you'd like to jump in and get started please visit the [CodeStar Project](0_CodeStar) module page to begin the workshop.

## Prerequisites

### AWS Account

In order to complete this workshop you'll need an AWS Account with access to create AWS IAM, S3, DynamoDB, Lambda, API Gateway, CodePipeline, and CodeBuild resources. The code and instructions in this workshop assume only one student is using a given AWS account at a time. If you try sharing an account with another student, you'll run into naming conflicts for certain resources. You can work around these by appending a unique suffix to the resources that fail to create due to conflicts, but the instructions do not provide details on the changes required to make this work.

All of the resources you will launch as part of this workshop are eligible for the AWS free tier if your account is less than 12 months old. See the [AWS Free Tier page](https://aws.amazon.com/free/) for more details.

### AWS Command Line Interface

To complete the first module of this workshop you'll need the AWS Command Line Interface (CLI) installed on your local machine. You'll use the CLI to copy objects into your S3 website bucket.

Follow the [AWS CLI Getting Started](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html) guide to install and configure the CLI on your machine.

### Browser

We recommend you use the latest version of Chrome or Firefox when testing the web application UI.

### Text Editor

You will need a local text editor for making minor updates to configuration files.

## Modules

This workshop is broken up into multiple modules. You must complete each module before proceeding to the next.

0. [CodeStar Project](0_CodeStar)
1. [Serverless Application Model (SAM)](1_ServerlessApplicationModel)
2. [Continuous Delivery Pipeline](2_ContinuousDeliveryPipeline)
3. [AWS X-Ray Integration](3_XRay)
4. [Multiple Environment CI/CD Pipeline](4_MultipleEnvironments)


After you have completed the workshop you can delete all of the resources that were created by following the [cleanup guide](9_CleanUp).
