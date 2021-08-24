+++
title = "Dynamic Parallelism"
chapter = false
weight = 42
pre = "<b>b. </b>"
+++

### Add dynamic parallelism to enable batch image processing

Until this point, we've been runnning our image processing workflow on one photo at a time. In reality, it is common to do batch processing on a colleciton of photos or items that you receive which is where we can leverage dynamic parallelism. We are seeking to do one or more tasks (an entire sub-workflow) on a varying number of inputs which can be accomplished with dynamic parallelism.

To enable broad scale for batch processing, we will convert our existing processing workflow into a dynamically scaled state machine using the Map state and an varying-sized array
of images being sent in the starting state for the state machine execution.

{{< figure
	src="/images/StateMachineDiagramWithMapState.png"
	width="60%"
>}}

1. Edit your `rider-photo-state-machine.json` file to update the `PhotoDoesNotMeetRequirement` state with the following.

	{{< highlight json >}}
,
"PhotoDoesNotMeetRequirement": {
	"Type": "Task",
	"Resource": "REPLACE_WITH_NotificationPlaceholderFunctionArn",
	"ResultPath": "$.errorInfo",
	"End": true
},	{{< /highlight>}}

    *   Replace the `REPLACE_WITH_NotificationPlaceholderFunctionArn` with the `NotificationPlaceholderFunctionArn ` from the AWS CloudFormation output

1. Next, save your existing JSON file as `ImageProcessingStateMachine-SingleInput.json` in a local directory as a working backup.

1. After you have saved the previous version, ***create a new blank file named `ImageProcessingStateMachine-DynamicInput.json`*** in the same local directory.
    
    First, let's add the overall state machine definition with just the map state which will allow running our sub-workflow on all elements of the input array. We will leave the actual nested sub-workflow definition blank to start.

	{{< highlight json >}}
{
	"Comment": "Rider dynamic input photo processing workflow",
	"StartAt": "DynamicParallelProcessing",
	"States": {
		"DynamicParallelProcessing": {
			"Type": "Map",
			"ItemsPath": "$.images",
			"MaxConcurrency": 0,
			"ResultPath": "$.results",
			"End": true,
			"Parameters": {
				"userId.$": "$$.Map.Item.Value.userId",
				"s3Bucket.$": "$.s3Bucket",
				"s3Key.$": "$$.Map.Item.Value.s3Key"
			},
			"Iterator": {
				"StartAt": "FaceDetection",
				"States": {
					// Replace state definitions here from the previous single-input state machine
				}
			}
		}
	}
}	{{< /highlight >}}
    
    Note that the `ItemsPath` indicates the location of our images array within the state machine's execution input. Additionally, the `ResultPath` indicates that the full array of results from each of the sub-workflows should be persisted to the results nested path for future reference.

    We do not want to have to specify the S3 bucket in each of the input image objects since they're all in the same bucket so we will use the `Parameters` setting to create our same invocation event structure for the existing sub-workflow (with userId, s3Bucket, and S3Key) even though the S3 bucket will only be defined a single time on the all-up workflow where each element in our input array may have different userIds and s3 image object keys.

1. Now that we have the map state syntax in place, ***copy all of the existing state definitions from your other `ImageProcessingStateMachine-SingleInput.json` file into the `States` nested object within the `Iterator` of our `DynamicParallelProcessing` state***.

1. At this point, your `ImageProcessingStateMachine-DynamicInput.json` file should look like this (the AWS Lambda ARNs are examples): 

	{{< expand "(expand to see)">}}

	{{< highlight json >}}
{
	"Comment": "Rider photo dynamic parallelism processing workflow",
	"StartAt": "DynamicParallelProcessing",
	"States": {
		"DynamicParallelProcessing": {
			"Type": "Map",
			"ItemsPath": "$.images",
			"MaxConcurrency": 0,
			"ResultPath": "$.results",
			"End": true,
			"Parameters": {
				"userId.$": "$$.Map.Item.Value.userId",
				"s3Bucket.$": "$.s3Bucket",
				"s3Key.$": "$$.Map.Item.Value.s3Key"
			},
			"Iterator": {
				"StartAt": "FaceDetection",
				"States": {
					"FaceDetection": {
						"Type": "Task",
						"Resource": "arn:aws:lambda:us-west-2:123456789012:function:wildrydes-step-module-resour-FaceDetectionFunction-PPBRQ9O86LXH",
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
						"Resource": "arn:aws:lambda:us-west-2:123456789012:function:wildrydes-step-module-res-NotificationPlaceholderF-30VMQVV425UM",
						"ResultPath": "$.errorInfo",
						"End": true
					},
					"CheckFaceDuplicate": {
						"Type": "Task",
						"Resource": "arn:aws:lambda:us-west-2:123456789012:function:wildrydes-step-module-resources-FaceSearchFunction-LSRBQZLG5MJ4",
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
										"Resource": "arn:aws:lambda:us-west-2:123456789012:function:wildrydes-step-module-resources-IndexFaceFunction-VDQ2ATJG1RPJ",
										"End": true
									}
								}
							},
							{
								"StartAt": "Thumbnail",
								"States": {
									"Thumbnail": {
										"Type": "Task",
										"Resource": "arn:aws:lambda:us-west-2:123456789012:function:wildrydes-step-module-resources-ThumbnailFunction-HTSQ4PQCPH6H",
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
						"Resource": "arn:aws:lambda:us-west-2:123456789012:function:wildrydes-step-module-reso-PersistMetadataFunction-SE8SBIB92ITF",
						"ResultPath": null,
						"End": true
					}
				}
			}
		}
	}
}	{{< /highlight >}}
	{{< /expand >}}

1. Go back to the AWS Step Functions Console and choose **Edit state machine** to update the `RiderPhotoProcessing` state machine.

1. Paste the updated JSON definition and click the refresh button in the preview panel to visualize the changes:

	{{< figure
		src="/images/StateMachineDiagramWithMapState.png"
		alt="Update state machine with persistence step"
	>}}

1. Click the **Save** button to save the state machine.
	
1. Click the **Start execution** button to test the new state machine with with test input:

	{{< highlight json >}}
{
	"s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	"images": [
		{
			"userId": "user_b",
			"s3Key": "2_sunglass_face.jpg"
		},
		{
			"userId": "user_c",
			"s3Key": "3_multiple_faces.jpg"
		},
		{
			"userId": "user_d",
			"s3Key": "4_no_face.jpg"
		}
	]
}	{{< /highlight >}}
	
	Note that the S3 bucket is now only defined once for the batch request. Since the Lambda tasks from before expect to have that as a property in their input along with userId and s3Key, the parameters definition on the map state dynamically builds the correct request structure for each item in the array before invoking the sub-workflow defined earlier in this workshop, so our Lambda code is unchanged in any way.

1. After waiting a few moments for the state machine execution to finish, you can now browse the visual workflow undertaken from each of the iterations and see the processing steps each image in the array underwent.

	{{< figure
		src="/images/DynamicParallelismVisualExplorer-2.png"
		alt="Dynamic Parallelism Visual Explorer"
	>}}

1. Choose the "Execution Output" tab to view the final output of the execution. Within you will see both the input provided originally to the workflow, as well as an array of processing results for each of iterations done for all images provided as well as the inputs used for each of the sub-workflows.

	***Execution Succeeded Final Output***

	{{< figure
		src="/images/DynamicParallelismFinalOutput1-2.png"
		alt="Dynamic Parallelism Final Output 1"
	>}}

	***Results of all images in the input array are contained within***

	{{< figure
		src="/images/DynamicParallelismFinalOutput2-2.png"
		alt="Dynamic Parallelism Final Output 2"
	>}}

	Though our workflow ends here, if you needed to have a reducer-type capability to analyze the output of all of the various items to make a final decision regarding order processing or other business logic, you could extend the workflow here and add a task to process the array of results to make such decisions.

	You can use the `aws rekognition list-faces` and `aws rekognition delete-faces` commands to clean up the previous indexed faces during testing. Or you can upload a different picture to the `RiderPhotoS3Bucket` and use the s3 key of the new picture to test.

	Feel free to experiment with the `images` nested array of the execution input to test different images in different sized batches.
