+++
title = "Cleanup"
chapter = false
weight = 06
pre = "<b>6. </b>"
+++

#### For AWS-hosted events

**If you are participating in this workshop at an AWS-hosted event using Event Engine and a provided AWS account, you do not need to complete this module.** We will cleanup all managed accounts afterwards on your behalf.

#### For non-AWS hosted events
:bulb: The following steps are used to cleanup all resources provisioned by this workshop to ensure there is no further usage of these services metered against your AWS account.

1. Delete the `RiderPhotoProcessing` state machine from the AWS Step Functions console.

1. Delete the `wildrydes-step-module-resources` AWS CloudFormation stack that launched the AWS Lambda functions, Amazon S3 buckets and Amazon DynamoDB table.

	* In the AWS CloudFormation Management Console, select the `wildrydes-step-module-resources` stack.

 	* Select **Delete Stack** under **Actions**.

	{{< figure
		src="/images/cloudformation-delete.png"
		alt="Delete cloudformation stack"
	>}}

	* Click **Yes, Delete**

1. Delete the Amazon Rekognition collection.

	* In a terminal window, run the following command and replace the `REPLACE_WITH_YOUR_CHOSEN_AWS_REGION` portion with the AWS region you have used.

			aws rekognition delete-collection --collection-id rider-photos --region us-east-1 	

	* If successful, you should get an acknowledgment from the service that looks like:

		{{< highlight json >}}
{
	"StatusCode": 200
}	{{< /highlight >}}
