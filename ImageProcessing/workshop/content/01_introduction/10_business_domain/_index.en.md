+++
title = "Example Business Context"
chapter = false
weight = 1
+++

It’s much easier to explore concepts around distributed service coordination and serverless image processing when we have concrete systems to talk about. For this workshop, we’ll discuss a set of services that comprise a very small slice of a simplified ride-sharing app for the imaginary company **Wild Rydes**. The Wild Rydes team wants to add a new feature to the app that requires riders to upload a selfie after signing up to accomplish two things:

1. Allows the unicorns (the drivers) to easily identify the rider during pickup to provide a good customer experience. This also enhances security so bad guys can't spoof to be riders and get on the unicorns.
1. Prevents the same user from signing up for multiple accounts using the same selfie photo to abuse new-user promotions.  

![selfie picture](../images/selfie/selfie-picture.jpeg)

When users upload the photo of themselves, a few steps of verification and processing need to take place:

1. Verify the photo shows a clear face the unicorns can use to identify the rider.
1. Match the photo against the collection of previously indexed faces to make sure the user hasn't already signed up.
1. Resize the photo to thumbnails to display on the app.
1. Index the user's face into the collection so it can be used for matching in the future.
1. Store the photo metadata with the user's profile.
1. Notify the user of any problems with the photo uploading/validation process  

In the serverless world, each of steps above can be easily implemented with an AWS Lambda function, Amazon SNS notification, and Amazon DynamoDB. But how can we manage the orchestration of these services? How do we invoke Lambda functions that are dependent on the outcome of a previously executed Lambda function? What if one of the Lambda functions times out and needs to be retried? Some of the Lambda functions can be run in parallel to reduce end-to-end processing latency, how can we coordinate running Lambda functions in parallel and wait for them to finish? AWS Step Functions makes it very easy to solve these problems by providing high-level orchestration of the services needed to implement this process in a robust manner.

## Orchestration definition

We use the term *orchestration* to describe the act of coordinating distributed services via a centralized workflow manager process, similar to how a conductor understands each part of an orchestra and directs each instrument section to act together to create a specific performance result.

Orchestration’s main benefit for service coordination is that it places all of the logic required to usher data between services to achieve a specific workflow in one central place, rather than encoding that logic across many services that need to know how to work with each other. This means that if anything about processing a workflow needs to change, there’s only one place to update: the process that’s managing the orchestration. It also means it’s easier to understand how various services are used together in concert, since you only need to look in one place to understand the entire flow from start to finish.

This approach works best when there is a higher level of coordination needed between services, often involving the need for robust retries, specific error handling, and optimized processing logic like conducting some steps in parallel or waiting for some steps to complete before continuing to execute a particular process.

:white_check_mark: With the relevant context in mind, you can proceed to the technical overview of this workflow by clicking the arrow along the right side of this content.
