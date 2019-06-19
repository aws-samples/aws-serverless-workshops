## Serverless Web Application Workshop

In this workshop you'll deploy a simple web application that enables users to request unicorn rides from the [Wild Rydes][wildrydes] fleet. The application will present users with an HTML based user interface for indicating the location where they would like to be picked up and will interface on the backend with a RESTful web service to submit the request and dispatch a nearby unicorn. The application will also provide facilities for users to register with the service and log in before requesting rides.

The application architecture uses [AWS Lambda][lambda], [Amazon API Gateway][api-gw], [Amazon S3][s3], [Amazon DynamoDB][dynamodb], [Amazon Cognito][cognito], and [AWS Amplify Console][amplify-console]. Amplify Console hosts static web resources including HTML, CSS, JavaScript, and image files which are loaded in the user's browser via S3. JavaScript executed in the browser sends and receives data from a public backend API built using Lambda and API Gateway. Amazon Cognito provides user management and authentication functions to secure the backend API. Finally, DynamoDB provides a  persistence layer where data can be stored by the API's Lambda function.

See the diagram below for a depiction of the complete architecture.

![Wild Rydes Web Application Architecture](images/wildrydes-complete-architecture.png)

### Modules

This workshop is divided into four modules. Each module describes a scenario of
what we're going to build and step-by-step directions to help you implement the
architecture and verify your work.

| Module | Description |
| ---------------- | -------------------------------------------------------- |
| [Static Web hosting][static-web-hosting] | Deploy the static website using AWS Amplify Console by first creating a git repository (in either CodeCommit or GitHub) and then pushing the site code. |
| [User Management][user-management] | Configure user management for the website using Amazon Cognito. |
| [Serverless Backend][serverless-backend] | Create an AWS Lambda function that will persist data to an Amazon DynamoDB table. |
| [RESTful APIs][restful-apis] | Expose the Lambda function via an Amazon API Gateway as a RESTful API that the static site can call. |

:warning: These modules are intended to be executed linearly.

After you have completed the workshop you can delete all of the resources that were created by following the [cleanup guide][cleanup].

### Next

:white_check_mark: Review and follow the directions in the [setup guide][setup],
wherein you'll configure your AWS Cloud9 IDE and setup pre-requisites like an
AWS Account.

[wildrydes]: http://wildrydes.com/
[unicorns]: http://www.wildrydes.com/unicorns.html
[amplify-console]: https://aws.amazon.com/amplify/console/
[cognito]: https://aws.amazon.com/cognito/
[lambda]: https://aws.amazon.com/lambda/
[api-gw]: https://aws.amazon.com/api-gateway/
[s3]: https://aws.amazon.com/s3/
[dynamodb]: https://aws.amazon.com/dynamodb/
[setup]: 0_Setup/
[static-web-hosting]: 1_StaticWebHosting/
[user-management]: 2_UserManagement/
[serverless-backend]: 3_ServerlessBackend/
[restful-apis]: 4_RESTfulAPIs/
[cleanup]: 9_CleanUp/
