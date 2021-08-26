+++
title = "Image Processing Workflow"
chapter = false
weight = 2
+++

In this workshop, we'll build a workflow composed of several serverless AWS services. It uses native integrations for [AWS Lambda][Lambda] functions to leverage the facial detection capabilities of [Amazon Rekognition][Rekognition], and to resize images stored in [Amazon S3][S3]. It also uses native integrations to save the image metadata with the user profile using [Amazon DynamoDB][DynamoDB], and to notify users of certain events via email using [Amazon Simple Notification Service (SNS)][SNS]. The orchestration of this functionality is managed by an [AWS Step Functions][Step Functions] state machine.

{{< figure
    src="/images/wild-rydes-architecture.png"
    width="60%" >}}

Below is a diagram of the workflow we will build as visualized by AWS Step Functions.

{{< figure
    src="/images/4th-state-machine-graph.png"
    width="60%" >}}

We will begin by building, then manually triggering the workflow above from the AWS Step Functions management console. By the end, we will show you how to configure the triggering of these workflows using an event-driven approach with [Amazon EventBridge][EventBridge] and S3 events.

:white_check_mark: With an overarching understanding of what we will try to accomplish in this workshop, we can now proceed to performing up some prerequisite setup tasks by clicking the arrow on the right.

[API Gateway]: https://aws.amazon.com/api-gateway/
[EventBridge]: https://aws.amazon.com/eventbridge/
[DynamoDB]: https://aws.amazon.com/dynamodb/
[Lambda]: https://aws.amazon.com/lambda/
[Rekognition]: https://aws.amazon.com/rekognition/
[S3]: https://aws.amazon.com/s3/
[Step Functions]: https://aws.amazon.com/step-functions/
[SNS]: https://aws.amazon.com/sns/
