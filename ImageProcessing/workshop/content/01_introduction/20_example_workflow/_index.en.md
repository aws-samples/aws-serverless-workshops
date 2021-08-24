+++
title = "Image Processing Workflow"
chapter = false
weight = 02
+++

The architecture for this module is composed of several [AWS Lambda][Lambda] functions that leverage the facial detection capabilities of [Amazon Rekognition][Rekognition], resize the uploaded image stored in [Amazon S3][S3], and save the image metadata with the user profile using [Amazon DynamoDB][DynamoDB]. The orchestration of these Lambda functions is managed by an [AWS Step Functions][Step Functions]  state machine.

{{< figure
    src="/images/wild-rydes-architecture.png"
    width="60%" >}}

Below is the flow diagram of the workflow we will build as visualized by AWS Step Functions:

{{< figure
    src="/images/4th-state-machine-graph.png"
    width="60%" >}}

In this module, we will manually kick-off processing workflows from the AWS Step Functions management console. In a real world application, you can configure an [Amazon API Gateway][API Gateway] that your application invokes to trigger the Step Functions state machine, or have it triggered by an Amazon S3 upload event through [Amazon CloudWatch Events][CloudWatch] or S3 event notifications.

[API Gateway]: https://aws.amazon.com/api-gateway/
[CloudWatch]: https://aws.amazon.com/cloudwatch/
[DynamoDB]: https://aws.amazon.com/dynamodb/
[Lambda]: https://aws.amazon.com/lambda/
[Rekognition]: https://aws.amazon.com/rekognition/
[S3]: https://aws.amazon.com/s3/
[Step Functions]: https://aws.amazon.com/step-functions/

:white_check_mark: With an overarching understanding of what we will try to accomplish in this workshop, we can now proceed to performing up some prerequisite setup tasks by clicking the arrow on the right.
