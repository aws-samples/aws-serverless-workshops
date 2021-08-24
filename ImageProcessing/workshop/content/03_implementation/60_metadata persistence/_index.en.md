+++
title = "Metadata Persistence"
chapter = false
weight = 36
+++

### Add metadata persistence step

The last step of our image processing workflow is to persist the metadata of the profile photo with the user's profile.

The ARN of the AWS Lambda function that persists the metadata can be found in the in AWS CloudFormation output `PersistMetadataFunctionArn`.

{{< figure
	src="/images/4th-state-machine-graph.png"
	width="60%"
>}}

1. Edit your `rider-photo-state-machine.json` file to add the final persistence step.

    First, add a new state `PersistMetadata` following the `ParallelProcessing` state. Also make sure:

    *   Replace the `REPLACE_WITH_PersistMetadataFunctionArn` with the `PersistMetadataFunctionArn ` from the AWS CloudFormation output

	{{< highlight json >}}
,
"PersistMetadata": {
	"Type": "Task",
	"Resource": "REPLACE_WITH_PersistMetadataFunctionArn",
	"ResultPath": null,
	"End": true
}	{{< /highlight >}}

1. Find the line in the `ParallelProcessing` state that marks it as the End state of the state machine.

	{{< highlight json >}}"End": true{{< /highlight >}}

	and replace it with

	{{< highlight json >}}"Next": "PersistMetadata"{{< /highlight >}}

	> **Note**: be careful to edit the `"End"` line at the `ParallelProcessing` level, not the individual branch level within the parallel state.

	This tells AWS Step Functions if the `ParallelProcessing` state runs successfully, go on to run the `PersistMetadata` state as the next step in the process.

1. At this point, your `rider-photo-state-machine.json` file should look like this (the AWS Lambda ARNs are examples):

	{{< expand "(expand to see)" >}}

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
			"Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-NotificationPlaceholderFunct-CDRLZC8BRFWP",
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

1. Go back to the AWS Step Functions Console and click the **Edit state machine** button to update the `RiderPhotoProcessing` state machine.

1. Paste the updated JSON definition and click the refresh button in the preview panel to visualize the changes:

	{{< figure
		src="/images/6-update-state-machine-persistence-2.png"
		alt="Update state machine with persistence step"
	>}}

1. Click the **Save** button to save the state machine.

1. Click the **Start execution** button to test the new state machine with with test input:

	{{< highlight json >}}
{
	"userId": "user_a",
	"s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	"s3Key": "1_happy_face.jpg"
}	{{< /highlight >}}

	If you reference an image that's already indexed when you were testing the previous state machine, the execution would fail the `CheckFaceDuplicate` step like this:

	{{< figure
		src="/images/already-indexed-face-2.png"
		alt="Already indexed face"
	>}}

	You can use the `aws rekognition list-faces` and `aws rekognition delete-faces` commands to clean up the previous indexed faces during testing. Or you can upload a different picture to the `RiderPhotoS3Bucket` and use the s3 key of the new picture to test.
