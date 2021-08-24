+++
title = "Native Service Integrations"
chapter = false
weight = 41
pre = "<b>a. </b>"
+++

### Add automated error reporting with Simple Notification Service (SNS)

Now that we've implemented an end-to-end image processing pipeline, we will prepare our application for production usage by implementing e-mail alerts to be sent by our Step Functions state machine in the event of any failures.

The intent of the **PhotoDoesNotMeetRequirement**  step is to send notification to the user that the verification of their profile photo failed so they might try uploading a different picture. It currently uses the AWS Lambda function `NotificationPlaceholderFunction` which simply returns the message instead of actually sending the notification. We will update this task to actually send e-mail alerts by creating a Simple Notification Service (SNS) topic and e-mail subscription to send any alerts to your inbox.

First, we will create the SNS topic.

### Create SNS Topic

1. From the AWS Management Console, choose **Services** then select **Simple Notification Service** under the *Application Integration* section.

1. Select **Topics** on the left-hand navigation menu.

1. Next, select **Create Topic** in the top right corner of the screen.

	{{< figure
		src="/images/CreateSNSTopic-1.png"
		alt="SNS Topic Step 1"
	>}}

1. Name your topic `NotifyMe` and leave the Display name blank.

	{{< figure
		src="/images/CreateSNSTopic-2.png"
		alt="SNS Topic Step 2"
	>}}

1. Scroll to the bottom of the page and select **Create topic.**

### Subscribe to SNS Topic

Now that you've created the topic, you will subscribe your personal e-mail address so you can receive notifications and alerts.

1. Select **Create subscription** in the Subscriptions section of the page.
	{{< figure
		src="/images/CreateSNSSubscription-1.png"
		alt="SNS Subscription Step 1"
	>}}

1. Select **Email** as the *Protocol* for delivery.

1. For **Endpoint**, type your personal e-mail address address.
	{{< figure
		src="/images/CreateSNSSubscription-2.png"
		alt="SNS Subscription Step 2"
	>}}

1. Select **Create subscription**.

### Verify your e-mail subscription

SNS e-mail subscriptions require confirmation of the end user's desire to receive messages before messages start being sent to a new e-mail subscriber. Accordingly, we'll now go ahead and validate our subscription.

1. Check your inbox for a mail from *AWS Notifications* and click **Confirm subscription** within the body of the e-mail message.

	{{< figure
		src="/images/CreateSNSSubscription-3.png"
		alt="SNS Subscription Step 3"
	>}}

1. You should now be directed to a webpage that shows your subscription as confirmed.

	{{< figure
		src="/images/CreateSNSSubscription-4.png"
		alt="SNS Subscription Step 4"
	>}}

### Update State Machine to send messages to SNS topic

Now that we have our SNS topic and e-mail subscription setup, we will update our state machine to send any errors as an SNS topic publication so we receive e-mail alerts.

1.  Edit your `rider-photo-state-machine.json` file to update the existing step, PhotoDoesNotMeetRequirement, to be like the following. 

    {{< highlight json >}}
"PhotoDoesNotMeetRequirement": {
	"Type": "Task",
	"Resource": "arn:aws:states:::sns:publish",
	"Parameters": {
		"TopicArn": "REPLACE_WITH_YOUR_SNS_TOPIC_ARN",
		"Subject": "Non-compliant photo encountered",
		"Message.$": "$"
	},
	"End": true
},	{{< /highlight >}}

    Note: By leaving the message as "$", you will send the full initial state payload, as well as the error details via e-mail for review.

1.  Next, replace the `REPLACE_WITH_YOUR_SNS_TOPIC_ARN` with the ARN you noted down after creating your SNS topic. IT should look something like `arn:aws:sns:us-west-2:012345678912:NotifyMe`.

    Since the last step in our state machine remains the same, we do not need to update the "End" property.

1. At this point, your `rider-photo-state-machine.json` file should look like this (the AWS Lambda ARNs are examples): 
	{{< expand "(expand to see)">}}

	{{< highlight json >}}
{
	"Comment": "Rider photo processing workflow",
	"StartAt": "FaceDetection",
	"States": {
		"FaceDetection": {
			"Type": "Task",
			"Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-FaceDetectionFunction-4AYSKX2EGPV0",
			"ResultPath": "$.detectedFaceDetails",
			"Next": "CheckFaceDuplicate",
			"Catch": [
				{
					"ErrorEquals": [
						"PhotoDoesNotMeetRequirementError"
					],
					"ResultPath": "$.errorInfo",
					"Next": "PhotoDoesNotMeetRequirement"
				}
			]
		},
		"PhotoDoesNotMeetRequirement": {
			"Type": "Task",
			"Resource": "arn:aws:states:::sns:publish",
			"Parameters": {
				"TopicArn": "arn:aws:sns:us-west-2:012345678912:NotifyMe",
				"Subject": "Non-compliant photo encountered",
				"Message.$": "$"
			},
			"End": true
		},
		"CheckFaceDuplicate": {
			"Type": "Task",
			"Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-FaceSearchFunction-1IT67V4J214DC",
			"ResultPath": null,
			"Next": "ParallelProcessing",
			"Catch": [
				{
					"ErrorEquals": [
						"FaceAlreadyExistsError"
					],
					"ResultPath": "$.errorInfo",
					"Next": "PhotoDoesNotMeetRequirement"
				}
			]
		},
		"ParallelProcessing": {
			"Type": "Parallel",
			"Branches": [
				{
					"StartAt": "AddFaceToIndex",
					"States": {
						"AddFaceToIndex": {
							"Type": "Task",
							"Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-IndexFaceFunction-15658V8WUI67V",
							"End": true
						}
					}
				},
				{
					"StartAt": "Thumbnail",
					"States": {
						"Thumbnail": {
							"Type": "Task",
							"Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-ThumbnailFunction-A30TCJMIG0U8",
							"End": true
						}
					}
				}
			],
			"ResultPath": "$.parallelResult",
			"Next": "PersistMetadata"
		},
		"PersistMetadata": {
			"Type": "Task",
			"Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-PersistMetadataFunction-9PDCT2DT7K70",
			"ResultPath": null,
			"End": true
		}
	}
}	{{< /highlight >}}
	{{< /expand >}}

1. Go back the AWS Step Functions Console, click the **Edit state machine** button to update the `RiderPhotoProcessing` state machine.

1. Paste the updated JSON definition and click the refresh button in the preview panel to visualize the changes:

	{{< figure
		src="/images/extra-credit-update-state-machine-SNS-publications.png"
		alt="Update state machine with persistence step"
	>}}

1. Click the **Save** button to save the state machine.
	
1. Click the **Start execution** button to test the new state machine with with test input (or any other input from the validation section that you've already used with the state machine at least once):

	{{< highlight json >}}
{
	"userId": "user_a",
	"s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	"s3Key": "1_happy_face.jpg"
}	{{< /highlight >}}

	If you reference an image that's already indexed when you were testing the previous state machine, the execution would fail the `CheckFaceDuplicate` step like this:
	
	{{< figure
		src="/images/already-indexed-face-2.png"
		alt="Previously indexed face"
	>}}

    Even though the same visual flow has occurred, because we've now updated the `PhotoDoesNotMeetRequirement` step to publish to an SNS topic, you should have received an e-mail with the error message.

    Since we left the message text set to `$` above, the full execution state payload including the error details object is included in the message.

	{{< figure
		src="/images/StepFunctionsSNSEmailError.png"
		alt="SNS E-mail Error"
	>}}

	You can use the `aws rekognition list-faces` and `aws rekognition delete-faces` commands to clean up the previous indexed faces during testing to try triggering different types of errors. Note that our e-mail alerts will only be sent when our state machine execution ends in an error state.

### Other Native Service Integrations

This example demonstrates how to natively use SNS publications with Step Functions, but there are many other native service integrations avaialble, which allow you to integrate with many services in orchestration of batch processing, machine learning training and deployments, containerized tasks, data transformations with AWS Glue and EMR, and more.

Feel free to review our [Step Functions documentation](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-service-integrations.html) for a full list of native AWS service integrations.