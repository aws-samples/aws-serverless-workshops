+++
title = "Cleanup"
chapter = false
weight = 6
pre = "<b>6. </b>"
+++

{{% notice note %}}
If you are participating in this workshop at an AWS-hosted event using Event Engine and a provided AWS account, you do **not** need to perform the cleanup operations in this section. We will cleanup all managed accounts afterwards on your behalf.
{{% /notice %}}

:bulb: The following steps are used to cleanup all resources provisioned by this workshop to ensure there is no further usage of these services metered against your AWS account.

### Empty the cloud trail bucket ###

➡️ Step 1: From the AWS Management Console, type "S3" in the search field at the top of the window and select **s3** from the list of services.

{{< figure
	src="/images/triggering-step11.png"
	alt="Step 1"
>}}

➡️ Step 2: Select the radio button next to the bucket beginning with `wildrydes-step-module-resource-cloudtrails3bucket-` and click the **Empty** button.

{{< figure
	src="/images/cleanup-step2.png"
	alt="Step 2"
>}}

➡️ Step 3: You will be asked to confirm your request to empty the bucket. To confirm, type the requested phrase in the box and press the **Empty** button.

{{< figure
	src="/images/cleanup-step3.png"
	alt="Step 3"
>}}

You should receive a success message. Click the **Exit** button that appears in the top right of the window.

### Delete the Amazon Rekognition collection ###

➡️ Step 4: In your Cloud9 terminal window, delete the Amazon Rekognition collection by running the following command (replace the `REPLACE_WITH_YOUR_CHOSEN_AWS_REGION` with the appropriate value).

	aws rekognition delete-collection \
		--collection-id rider-photos \
		--region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION

### Delete the CloudFormation Stack

➡️ Step 5: From the AWS Management Console, type "CloudFormation" in the search field at the top of the window and select **CloudFormation** from the list of services.

{{< figure
	src="/images/cleanup-step5.png"
	alt="Step 5"
>}}

➡️ Step 6: From the list of CloudFormation stacks, select the `wildrydes-step-module-resources` stack and click the **Delete** button.

{{< figure
	src="/images/cleanup-step6.png"
	alt="Step 6"
>}}

Click **Delete stack** in the confirmation dialog that appears.

{{< figure
	src="/images/cleanup-step6b.png"
	alt="Step 6b"
>}}

The status of the `wildrydes-step-module-resources` will change to **DELETE_IN_PROGRESS**. Deleting this CloudFormation stack can take a few minutes. Keep refreshing the page until the stack is gone.
