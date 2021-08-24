+++
title = "Validation Testing"
chapter = false
weight = 01
+++

1. Test the final state machine (`RiderPhotoProcessing`) with different test images provided

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

1. Upload some pictures you have to S3, test some executions. If you have more than one picture of the same person, upload them both and run the workflow on each picture (make sure to use different `userId` fields in the test input). Verify the **CheckFaceDuplicate** step will prevent the same face from being indexed more than once.

1. Go to the Amazon DynamoDB console, look for a table with name starting with "wildrydes-step-module-resources-RiderPhotoDDBTable" (you can also find the table name in the CloudFormation stack output). Check out the items of the table.

	{{< figure
		src="/images/dynamodb_example-3.png"
	>}}

1. Go to the Amazon S3 console, verify the thumbnail images of the photos you processed are in the thumbnail S3 Bucket.

Now you have built a multi-step image processing workflow using AWS Step Functions! The workflow can be integrated to your app by fronting it with AWS API Gateway or triggered from an Amazon S3 upload event.  
