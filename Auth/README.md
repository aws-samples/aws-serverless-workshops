# Serverless Identity Management, Authentication, and Authorization Workshop

In this workshop, you will build a serverless microservices application that enables users to request unicorn rides from the Wild Rydes fleet. The application will present users with a web user interface for signing-up, signing-in, indicating their location to request a ride, and managing their rider profile.

This application architecture demonstrates end-to-end authentication and authorization patterns through the use of [Amazon Cognito](https://aws.amazon.com/cognito/), [Amazon API Gateway](https://aws.amazon.com/api-gateway/), [AWS Lambda](https://aws.amazon.com/lambda/), and [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/). A single page [React JS](https://reactjs.org/) web app hosts the HTML, CSS, and JavaScript to render the front-end which then connects to a public serverless backend API built using API Gateway and AWS Lambda. Amazon Cognito provides user identity management and authentication functions to secure the backend API. Finally, DynamoDB provides a persistence layer where data is stored and retrieved via the API's Lambda function.

See the diagram below for a depiction of the complete architecture.

![Wild Rydes Web Application Architecture](images/wildrydes-complete-architecture.png)

### Get Started

Proceed to the Getting Started Module to begin the workshop. [Click here to get started](./0_GettingStarted).
