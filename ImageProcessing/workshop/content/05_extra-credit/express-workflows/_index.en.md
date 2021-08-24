+++
title = "Express Workflows"
chapter = false
weight = 43
pre = "<b>c. </b>"
+++

### What is Express Workflows?
Express Workflows are a new type of AWS Step Functions workflow type that cost-effectively orchestrate AWS compute, database, and messaging services at event rates greater than 100,000 events per second. Express Workflows automatically start in response to events such as HTTP requests via Amazon API Gateway, AWS Lambda requests, AWS IoT Rules Engine actions, and over 100 other AWS and SaaS event sources from Amazon EventBridge. Express Workflows is suitable for high-volume event processing workloads such as IoT data ingestion, streaming data processing and transformation, and high-volume microservices orchestration.

### When to choose Express Workflows Vs Standard Workflows?
You can choose `Standard` Workflows when you need long-running, durable, and auditable workflows, or `Express` Workflows for high-volume, event processing workloads.Your state machine executions will behave differently, depending on which Type you select. The `Type` you choose cannot be changed after your state machine has been created.

```markdown
# Standard vs Express Workflows #

| Features 					   	   	| Standard Workflows 				 | Express Workflows 	   			|
| -------------------------------- 	| ---------------------------------	 | -------------------------------- |
| Maximum duration 					| 1 year. 							 | 5 minutes. 			   			|
| Supported execution start rate  	| Over 2,000 per second				 | Over 100,000 per second  		|
| Supported state transition rate  	| Over 4,000 per second per account  | Nearly unlimited 				|
| Pricing  							| Priced per state transition 		 | Priced by the number of  		|
|									|									 | executions you run,      		|
|									|									 | their duration, and,     		|
|									|									 | memory consumption.      		|
| Execution semantics			  	| Exactly-once workflow execution.   | At-least-once workflow execution.|

```

For detailed information on the differences between Standard and Express Workflows, see [Standard vs. Express Workflows][Standard-Vs-Express-Workflows]

### Create an AWS Step Functions state machine of type Express

The overall functionality of the workshop remains the same and we will be using the same State Machine Definition and Lambda functions from before.

As a review, we will be creating below step function state machine now with Express Worklow.

{{< figure
	src="/images/4th-state-machine-graph.png"
	alt="initial state machine diagram"
>}}

1.  Make sure your final `rider-photo-state-machine.json` file should look like this (the AWS Lambda ARNs are examples): 

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

1. From the AWS Management Console, choose **Services** then select **Step Functions**. 

1. You might see the following Get Started page if you have not used AWS Step Functions before. If that's the case, **click on the three horizontal lines in the top-left corner**.

	{{< figure
		src="/images/StepFunctions-CreateNewStateMachine-Step1.png"
		alt="Create Initial State Machine - Step 2"
	>}}

1. Next, click **State Machines**.

	{{< figure
		src="/images/StepFunctions-CreateNewStateMachine-Step2.png"
		alt="Create Initial State Machine - Step 3"
	>}}

1. Next, click **Create State Macine**. If you completed the workshop successfully earlier, you would notice the existing **RiderPhotoSharing** of Type Standard in the list of existing StateMachines.

	{{< figure
		src="/images/StepFunctions-CreateNewStateMachine-Step3-Express.png"
		alt="Create Initial State Machine - Step 4"
	>}}

1. Select **Author with Code Snippets** if it's not already selected.

1. Change the default selection from "Standard" to "Express" type. 

	{{< figure
		src="/images/StepFunctions-CreateNewStateMachine-Step4-Express.png"
		alt="Create Initial State Machine - Step 5"
	>}}

1.  **Highlight and replace all of the existing sample state machine definition JSON** by pasting your custom state machine JSON definition from your `rider-photo-state-machine.json` file from Cloud9 into the **Code** editor portion.

1.  You can **click on the &#x21ba; sign in the preview panel** to visualize the workflow:

	{{< figure
		src="/images/6-update-state-machine-persistence.png"
		alt="Update state machine with persistence step"
	>}}

1.  Click **Next**.

1.  Type `RiderPhotoProcessingExpress` for the state machine name.

1.  For **IAM role for executions**, pick **Create new role**.

	{{< figure
		src="/images/3-create-statemachine-select-role-Express.png"
		alt="Select IAM role"
	>}}

1.  For Logging and Tags keep default selections.

	{{< figure
		src="/images/4-create-statemachine-logging-tags-Express.png"
		alt="Select IAM role"
	>}}

1.  Click **Create State Machine** to create new **IAM Role** along with the state machine. Note the Type of the state machine is **Express**.

	{{< figure
		src="/images/5-create-statemachine-and-iam-role.png"
		alt="Select IAM role"
	>}}

1.  Click the **IAM Role** link to go to IAM console and click **Attach Poilicies** to add permissions to execute lambda functions.

	{{< figure
		src="/images/1-attach-policy-to-role-Express.png"
		alt="Click Add Policies"
	>}}

1.  Search for **AwsLambdaRole** and select the checkbox associated to it and click **Attach Poilicy**.

	{{< figure
		src="/images/1-add-lambda-execution-role-Express.png"
		alt="Search and Add policy AwsLambdaRole to the state machine"
	>}}

1.  After adding **AWSLambdaRole**, final policies should looks like this.

	{{< figure
		src="/images/2-add-lambda-execution-role-Express.png"
		alt="Updated IAM Role for state machine execution"
	>}}

1.  Click the **IAM Role** link to go to IAM console and click **Attach Poilicies** to add permissions to send notification to SNS topic.

	{{< figure
		src="/images/1-attach-sns-policy-to-role-Express.png"
		alt="Click Add Policies"
	>}}

1.  Search for **AmazonSNSFullAccess** and select the checkbox associated to it and click **Attach Poilicy**.

	{{< figure
		src="/images/1-add-sns-role-Express.png"
		alt="Search and Add policy AwsLambdaRole to the state machine"
	>}}

1.  After adding **AmazonSNSFullAccess**, final policies should looks like this.

	{{< figure
		src="/images/2-add-sns-Express.png"
		alt="Updated IAM Role for state machine execution"
	>}}

1.  Go back to the Express workflows Step Functions in console and Click the **Start execution** button to start a new execution.

	{{< figure
		src="/images/1-start-execution-Express.png"
		alt="Updated IAM Role for state machine execution"
	>}}

1.  Here you specify the input data passed into the AWS Step Functions state machine to process.

	Each execution of a Step Functions state machine has an unique ID. You can either specify one when starting the execution, or have the service generate one for you. In the text field that says "enter your execution id here",  you can specify an execution ID, or leave it blank. 
   
	For the input data, type in the follow JSON. Make sure to substitute the `s3Bucket` field with your own values. 
   
	For `s3Bucket` field, look in the **Outputs** section of the `wildrydes-step-module-resources` stack for `RiderPhotoS3Bucket`. 
	
	The `userId` field is needed because in later processing steps, the userId is used to record which user the profile picture is associated with.

	{{< highlight json >}}
{
	"userId": "user_a", 
	"s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	"s3Key": "1_happy_face.jpg"
}	{{< /highlight >}}

	> this tells the image processing workflow the userId that uploaded the picture and the Amazon S3 bucket and keys the photo is at.  
	
	{{< figure
		src="/images/test-execution-1.png"
		alt="Test new execution"
	>}}

1.  Once you Start Execution, **Unlike `Standard` Woflows, you would **NOT** see execution results in the visual format as below on the Step Functions Page**. This is to get improved performance with `Express` Workflows. **Instead, you have to go to CloudWatch to check the execution status and logs for `Express` Workflows**.
	
	{{< figure
		src="/images/1-standard-workflows-visual-output.png"
		alt="Test new execution"
	>}}

1.  Click **View in CloudWatch Logs**, to see the execution logs and status of the execution.

	{{< figure
		src="/images/1-view-cloudwatch-logs-Express.png"
		alt="Navigate to CloudWatch logs"
	>}}

1.  Look in the logs for `LambdaFunctionSucceeded` and click to see more details.

	{{< figure
		src="/images/1-view-cloudwatch-logs-success-Express.png"
		alt="Successful execution logs"
	>}}

1. If the last step succeeds, you can use the AWS CLI to check the list of faces indexed in your Rekognition collection (replace the `REPLACE_WITH_YOUR_CHOSEN_AWS_REGION` portion with the region string of your chosen region):

		aws rekognition list-faces \
	  	  --collection-id rider-photos \
	  	  --region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION
	
1. You might find the `delete-faces` command useful when testing:

		aws rekognition delete-faces \
		  --collection-id rider-photos \
		  --face-ids REPLACE_WITH_ID_OF_FACE_TO_DELETE \
		  --region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION

1. You can also use the Amazon S3 Console to check the Amazon S3 bucket created by AWS CloudFormation to store the resized thumbnail images. You should find resized thumbnail images in the bucket.

{{% notice note %}}
The name of the S3 bucket can be found in the in AWS CloudFormation output `ThumbnailS3Bucket`. You can also simply search for it in the S3 Console for `wildrydes-step-module-resources-thumbnails3bucket`
{{% /notice %}}

### TroubleShooting Failed Executions

1.  You can now see the state machine execution and status in cloudwatch. You would see the execution `failed` because of insufficient permission to execute Lambda Functions from a Step Function. This is because by default express workflow state machine does not have aws policy to execute lambda functions. So, we will add required policy in the next step.

	{{< figure
		src="/images/1st_execution_result-logs-failed-Express.png"
		alt="First failed execution logs"
	>}}

1.  If you see error or failure in the logs related to lambda execution, This is because by default express workflow state machine does not have aws policy to execute lambda functions. So, add **AWSLambdaRole** policy to the new Role created at the time of creation of State Machine above.

	{{< figure
		src="/images/1-add-lambda-execution-role-Express.png"
		alt="Add policy AwsLambdaRole to the state machine"
	>}}

1.  After adding **AWSLambdaRole**, final policies should looks like this.

	{{< figure
		src="/images/2-add-lambda-execution-role-Express.png"
		alt="Updated IAM Role for state machine execution"
	>}}


1.  Re-try another execution by passing same input json as before and confirm from the CloudWatch logs that the execution is `succeeded` this time.

	{{< figure
		src="/images/retry_execution_result-logs-succeeded-Express.png"
		alt="Successful execution logs"
	>}}

[Standard-Vs-Express-Workflows]: https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html