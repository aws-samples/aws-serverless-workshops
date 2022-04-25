+++
title = "Serverless Image Processing"
chapter = false
weight = 1
+++

<!-- put hashcode code here -->
## Welcome

In this hands-on workshop, you’ll learn how to build an image processing workflow using a simple, yet powerful, fully managed service called <a href="https://aws.amazon.com/step-functions/" target="_blank">AWS Step Functions</a>. We will leverage a few additional serverless technologies, including <a href="https://aws.amazon.com/lambda/" target="_blank">AWS Lambda</a>, <a href="https://aws.amazon.com/dynamodb/" target="_blank">Amazon DynamoDB</a>, and <a href="https://aws.amazon.com/sns/" target="_blank">Amazon Simple Notification Service (SNS)</a>. We will leverage an <a href="https://aws.amazon.com/cloudformation/" target="_blank">AWS CloudFormation</a> template to deploy the Step Function template, four Lambda functions, the SNS topic and DynamoDB table. You will configure the workflow to orchestrate them together into a simulated business process that allows uploading a profile picture, checking the photo for uniqueness, generating a thumbnail, and persisting metadata that associates the user with the photo.


## Estimated run time

This workshop takes about 1 to 2 hours to complete.

## Learning goals

This workshop is designed to teach you the following:

- The advantages of orchestrating multiple serverless services using a fully managed service

- The basics of authoring AWS Step Function state machines, including:
  - Performing work with AWS Lambda functions using the `Task` state

  - Executing work in parallel using the `Parallel` state

  - Notifying users of invalid photo requirements using Amazon SNS

  - Persisting metadata to a no-SQL database using DynamoDB

- Visualizing, debugging, and auditing workflow executions using the AWS Step Functions web console



[aws-lambda]: https://aws.amazon.com/lambda/
[aws-step-functions]: https://aws.amazon.com/step-functions/
[aws-dynamodb]: https://aws.amazon.com/dynamodb/
[aws-sns]: https://aws.amazon.com/sns/
[aws-cfn]: https://aws.amazon.com/cloudformation/
