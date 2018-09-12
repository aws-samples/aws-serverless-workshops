## Welcome!

Welcome to the _Serverless Data Processing on AWS_ workshop!

This is a 200-level workshop designed to illustrate how to use AWS services to
process real-time data streams without managing servers. In this workshop,
we'll build infrastructure to enable operations personnel at [Wild
Rydes][wildrydes] headquarters to monitor the health and status of their
[unicorn fleet][unicorns]. Each unicorn is equipped with a sensor that reports
its location and vital signs. During this workshop we'll use AWS to build
applications to process and visualize this data in real-time.

We will use a variety of AWS services including: [Amazon Kinesis][kinesis], [AWS
Lambda][lambda], [Amazon Simple Storage Service (Amazon S3)][s3], [Amazon
DynamoDB][dynamodb], [Amazon Cognito][cognito], and [Amazon Athena][athena].
We'll use Lambda to process real-time streams, DynamoDB to persist unicorn
vitals, Amazon Kinesis Data Analytics to build a serverless application to
aggregate data, Amazon Kinesis Data Firehose to archive the raw data to Amazon
S3, and Athena to run ad-hoc queries against the raw data.

### Modules

This workshop is divided into four modules. Each module describes a scenario of
what we're going to build and step-by-step directions to help you implement the
architecture and verify your work.

| Module | Description |
| ---------------- | -------------------------------------------------------- |
| [Real-time Streaming Data][streaming-data] | Create a stream in Kinesis and write to and read from the stream to track Wild Rydes unicorns on a live map. In this module you'll also create an Amazon Cognito identity pool to grant the live map access to your stream. |
| [Streaming Aggregation][streaming-aggregation] | Build an Kinesis Data Analytics application to read from the stream and aggregate metrics like unicorn health and distance traveled each minute. |
| [Stream Processing][stream-processing] | Persist aggregate data from the application to a backend database stored in DynamoDB and run queries against those data. |
| [Data Lake][data-lake] | Use Kinesis Data Firehose to flush the raw sensor data to an S3 bucket for archival purposes. Using Athena, you'll run SQL queries against the raw data for ad-hoc analysis. |

:warning: These modules are intended to be executed linearly.

### Issues, Comments, Feedback?

I'm [open source][repo]! If you see an issue, want to contribute content, or
have overall feedback please open an [issue][issue] or [pull request][pull].

### Next

:white_check_mark: Review and follow the directions in the [setup guide][setup],
wherein you'll configure your AWS Cloud9 IDE and setup pre-requisites like an
AWS Account.

[wildrydes]: http://wildrydes.com/
[unicorns]: http://www.wildrydes.com/unicorns.html
[kinesis]: https://aws.amazon.com/kinesis/
[cognito]: https://aws.amazon.com/cognito/
[lambda]: https://aws.amazon.com/lambda/
[s3]: https://aws.amazon.com/s3/
[dynamodb]: https://aws.amazon.com/dynamodb/
[athena]: https://aws.amazon.com/athena/
[streaming-data]: streaming-data.html
[streaming-aggregation]: streaming-aggregation.html
[stream-processing]: stream-processing.html
[data-lake]: data-lake.html
[setup]: setup.html
[repo]: https://github.com/awslabs/aws-serverless-workshops
[issue]: https://github.com/awslabs/aws-serverless-workshops/issues
[pull]: https://github.com/awslabs/aws-serverless-workshops/pulls
