# Wild Rydes Serverless Workshops

This repository contains a collection of workshops and other hands on content that will guide you through building various serverless applications using AWS Lambda, Amazon API Gateway, Amazon DynamoDB, AWS Step Functions, Amazon Kinesis, and other services.

# Workshops

- [**Web Application**](WebApplication) - This workshop shows you how to build a dynamic, serverless web application. You'll learn how to host static web resources with Amazon S3, how to use Amazon Cognito to manage users and authentication, and how to build a RESTful API for backend processing using Amazon API Gateway, AWS Lambda and Amazon DynamoDB.

- [**Auth**](Auth) - This workshop shows you how to build in security at multiple layers of your application, starting with sign-up and sign-in functionality for your application, how to secure serverless microservices, and how to leverage AWS's identity and access management (IAM) to provide fine-grained access control to your application's users. You'll learn how AWS Amplify integrates with Amazon Cognito, Amazon API Gateway, AWS Lambda, and IAM to provide an integrated authentication and authorization experience.

- [**Data Processing**](https://dataprocessing.wildrydes.com) - This workshop demonstrates how to collect, store, and process data with a serverless application. In this workshop you'll learn how to build real-time streaming applications using Amazon Kinesis Data Streams and Amazon Kinesis Data Analytics, how to archive data streams using Amazon Kinesis Data Firehose and Amazon S3, and how to run ad-hoc queries on those files using Amazon Athena.

- [**DevOps**](https://cicd.serverlessworkshops.io/) - In this workshop, you will learn how to start a new Serverless application from scratch using the [Serverless Application Model (SAM)](https://github.com/awslabs/serverless-application-model) and how to fully automate builds and deployments by building a continous delivery pipeline using AWS CodeCommit, AWS CodeBuild and AWS CodePipeline. You will also learn how to test a Serverless application locally using the SAM CLI.

- [**Image Processing**](ImageProcessing) - This module shows you how to build a serverless image processing application using workflow orchestration in the backend. You'll learn the basics of using AWS Step Functions to orchestrate multiple AWS Lambda functions while leveraging the deep learning-based facial recognition features of Amazon Rekogntion.

- [**Multi Region**](MultiRegion) - This workshop shows you how to build a serverless ticketing system that is replicated across two regions and provides automatic failover in the event of a disaster. You will learn the basics of deploying AWS Lambda functions, exposing them via API Gateway, and configuring replication using Route53 and DynamoDB streams.

- [**Security**](https://github.com/aws-samples/aws-serverless-security-workshop) - This workshop shows you techniques to secure a serverless application built with AWS Lambda, Amazon API Gateway and RDS Aurora. We will cover AWS services and features you can leverage to improve the security of a serverless applications in 5 domains: identity & access management, infrastructure, data, code, and logging & monitoring.

- [**Machine Learning**](MachineLearning) - This workshop shows you how to collect, process, and join disparate data sources using AWS Lambda and Amazon Athena. This data can be used to train a machine learning model using Amazon SageMaker. With the trained model hosted on Amazon S3, you will build a serverless API using Amazon API Gateway and AWS Lambda to predict the probability that a unicorn will request service after completing a ride.

- [**Decoupled Microservices**](https://async-messaging.workshop.aws/) - This workshop demonstrates the use of asynchronous messaging patterns to build micro-services based architecture. It applies the well known enterprise integration patterns using AWS services like SQS and SNS to implement various use cases for wild rydes business. All the labs are self contained and users can choose to go on their own adventure based on their requirements.

# Third Party Workshops

The following workshops are created and maintained by third parties and explore a variety of other topics and tools related to serverless development on AWS.

- [**HERE Geocoding and Routing Extensions**](https://github.com/heremaps/devrel-workshops/tree/master/aws-serverless) - These extensions to the [**Web Application**](WebApplication) and [**Data Processing**](https://dataprocessing.wildrydes.com) workshops walk through how to enhance the base applications with geocoding and advanced routing features. You'll see how to launch applications from the AWS Serverless Application Repository and integrate these components into the existing architectures. You'll need to complete the primary Web Application or Data Processing workshop from this repository before starting the extensions.
