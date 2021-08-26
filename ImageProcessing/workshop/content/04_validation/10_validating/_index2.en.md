+++
title = "Validation Testing"
chapter = false
weight = 1
+++


### Reset the environment state

To do some end-to-end validation of our completed workflow, let's begin by removing any persisted metadata about our images from the test executions. That way, we can ensure that everything behaves as expected without having to concern ourselves with errors or `Photo Does Not Meet Requirements` exceptions that are due to having tested the state machine as we were building it.

➡️ Step 1: Let's start by deleting our face collection for a clean testing state. Enter the following command into your Cloud9 terminal.

		aws rekognition delete-collection \
			--collection-id rider-photos \
			--region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION

➡️ Step 2: Now, recreate the face collection. Enter the following command into your Cloud9 terminal.

		aws rekognition create-collection \
			--collection-id rider-photos \
			--region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION


➡️ Step 3: Finally, let's navigate back to our Step Function state machine and test the final state machine (`RiderPhotoProcessing`) with different test images provided

Photo with happy face:

{{< highlight json >}}
{
	"userId": "user_a",
	"s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	"s3Key": "1_happy_face.jpg"
}	{{< /highlight >}}


Photo with sunglasses:

{{< highlight json >}}
{
	"userId": "user_b",
	"s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	"s3Key": "2_sunglass_face.jpg"
}	{{< /highlight >}}

Photo with multiple faces in it:

{{< highlight json >}}
{
	"userId": "user_c",
	"s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	"s3Key": "3_multiple_faces.jpg"
}	{{< /highlight >}}

Photo with no faces in it:

{{< highlight json >}}
{
	"userId": "user_d",
	"s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	"s3Key": "4_no_face.jpg"
}	{{< /highlight >}}

➡️ Step 4: Upload some pictures you have to S3, test some executions. If you have more than one picture of the same person, upload them both and run the workflow on each picture (make sure to use different `userId` fields in the test input). Verify the **CheckFaceDuplicate** step will prevent the same face from being indexed more than once.

➡️ Step 5: Go to the Amazon DynamoDB console, look for a table with name starting with "wildrydes-step-module-resources-RiderPhotoDDBTable" (you can also find the table name in the CloudFormation stack output). Check out the items of the table.

{{< figure
	src="/images/dynamodb_example-3.png"
>}}

➡️ Step 6: Go to the Amazon S3 console, verify the thumbnail images of the photos you processed are in the thumbnail S3 Bucket.

:white_check_mark: Now you have built a multi-step image processing workflow using AWS Step Functions! The workflow can be integrated to your app by fronting it with AWS API Gateway or triggered from an Amazon S3 upload event.  We'll trigger the workflow in response to an S3 upload event in the next section.
