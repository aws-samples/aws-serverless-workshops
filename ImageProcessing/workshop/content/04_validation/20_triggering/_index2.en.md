+++
title = "Triggering With S3 Events"
chapter = false
weight = 02
+++

We are going to use Amazon EventBridge to execute an AWS Step Functions state machine in response to uploading an image to our Amazon S3 bucket. To accomplish this, we will configure the state machine as a target for an Amazon EventBridge rule.

### Creating an Amazon EventBridge Rule

For API events in Amazon S3 to match an Amazon EventBridge rule, you must configure an Amazon CloudTrail to receive those events. In order to make setup easier, the CloudFormation stack we launched earlier deployed an Amazon CloudTrail with an Amazon S3 management event for you. We need to start by creating the EventBridge Rule.

➡️ Step 1: From the AWS Management Console, type "EventBridge" in the search field at the top of the window and select **Amazon EventBridge** from the list of services.

{{< figure
	src="/images/triggering-step1.png"
	alt="Step 1"
>}}

➡️ Step 2: Choose **Create rule**.

{{< figure
	src="/images/triggering-step2.png"
	alt="Step 2"
>}}


➡️ Step 3: Enter `ImageProcessing` as the **Name** and choose **Event Pattern** as the "Define pattern" option. Then choose **Custom pattern**.

{{< figure
	src="/images/triggering-step3.png"
	alt="Step 3"
>}}

➡️ Step 4: Create your event pattern, by copying the following in a text editor and replacing the value of `bucketName` with your `RiderPhotoS3Bucket` value.

{{< highlight json >}}
{
  "source": ["aws.s3"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventSource": ["s3.amazonaws.com"],
    "eventName": ["PutObject"],
    "requestParameters": {
      "bucketName": ["Replace-With-RiderPhotoS3Bucket-Name"]
    }
  }
}	{{< /highlight >}}

➡️ Step 5: Paste your event pattern into the "Event pattern" text box on the form and click **Save**.

{{< figure
	src="/images/triggering-step5.png"
	alt="Step 5"
>}}

➡️ Step 6: Scroll down to the **Select targets** section, and chose **Step Functions state machine** from the dropdown list. Select **RiderPhotoProcessing** for the **State Machine** value and click **Create**. Note, this will automatically create the role needed to invoke the Step Function from this event for you.

{{< figure
	src="/images/triggering-step6.png"
	alt="Step 6"
>}}

You should see that the ImageProcessing rule was created successfully.

{{< figure
	src="/images/triggering-step6b.png"
	alt="Step 6b"
>}}

### Adjust our state Machine
Right now, our state machine is configured to require a JSON object input with three key-value pairs. However, the EventBridge event we just created will not contain these key-value pairs. We must adjust our state machine to handle two different types of input. One contains the key-value pairs that we pass in when starting an execution of the state machine manually. The other is the EventBridge event input. However, we must transform that EventBridge event to *look like* the manual event since that is what the Lambda functions expect. To do this, we need to create a branch at the start of our state machine that, depending on the type of input received, will perform the necessary handling of both types of input.


➡️ Step 7: Return to the Workflow Studio to edit our state machine. Choose **Flow** in the "States browser" and drag and drop a **Choice** state between the **Start** and **Face Detection** steps.

{{< figure
	src="/images/triggering-step7.png"
	alt="Step 7"
>}}

➡️ Step 8: Configure the choice rules. Click the icon to the right of the "Rule #1".

{{< figure
	src="/images/triggering-step8.png"
	alt="Step 8"
>}}

Then click **Add conditions**.

{{< figure
	src="/images/triggering-step8b.png"
	alt="Step 8b"
>}}

This will bring up a rule editor to determine which path the state machine should choose. We will configure a simple rule that checks to see if the `userId` value is present. For manually triggered events, this will be true, but for EventBridge events it will be FaceAlreadyExistsError.

{{% notice info %}}
We could make a very complex rule set that checks for all key-value pairs, but for the sake of simplicity, we'll just create a simple rule checking for one key-value pair. You can explore this rule builder to try and create more complex rules or handle conditions not covered in here outside the context of this workshop.
{{% /notice %}}

Configure the rule as follows:
1. Enter `$.userId` for the "Variable" value
1. Select `is present` for the "Operator" value

Your rule should look similar to the following:


{{< figure
	src="/images/triggering-step8c.png"
	alt="Step 8c"
>}}

Click **Save conditions**. When you return back to the Workflow Studio view, set the **Then next state is:** value to **Face Detection**

{{< figure
	src="/images/triggering-step8d.png"
	alt="Step 8d"
>}}

➡️ Step 9: Both the "Rule 1" path, and the "Default" path should lead to your **Face Detection** step. However, if `userId` is not present, we want the default route to transform the EventBridge event into suitable input to the **Face Detection** function. To do that, drag and drop a **Pass** flow state to the default branch.

{{< figure
	src="/images/triggering-step9.png"
	alt="Step 9"
>}}

➡️ Step 10: On the **Input** tab for the **Pass State**, check the `Transform input with Parameters` option, and paste the following in the text box.

{{< highlight json >}}
{
	"userId": "$.detail.userIdentity.accountId",
	"s3Bucket": "$.detail.requestParameters.bucketName",
	"s3Key":  "$.detail.requestParameters.key"
}	{{< /highlight >}}

{{< figure
	src="/images/triggering-step10.png"
	alt="Step 10"
>}}

{{% notice info %}}
Note that you don't have to modify the values of the JSON above. It will dynamically pick the values out of the EventBridge event and place them in the correct values for the input event expected by the Lambda function. One caveat is that the userId is now tied to the AWS Account Id that is uploading the image. When we test this later, you'll find that you can only trigger the Step Function state machine once this way unless you remove the face index from the Rekognition collection associated with your AWS Account Id after every S3 upload.
{{% /notice %}}


➡️ Step 11: Click **Apply and exit** in the top right of the window to apply all changes and return to the state machine definition page.

{{< figure
	src="/images/statemachine-step11.png"
	alt="Step 10"
>}}

To save the changes you made, you must also click the **Save** button in the top right of the state machine definition page.


{{< figure
	src="/images/statemachine-step11b.png"
	alt="Step 10"
>}}

{{% notice warning %}}
Saving changes to the state machine made using the Workflow Studio interface requires **both** applying the changes (to leave the Workflow Studio interface) **and** pressing the **Save** button once you have exited the workflow interface. If you fail to do either of these steps, the changes made to the state machine will not be saved.
{{% /notice %}}

You may get an alert dialog when saving informing you that your changes may affect the resources the state machine needs to access. Click **Save anyway**.

{{< figure
	src="/images/statemachine-step11c.png"
	alt="Step 10"
>}}

At this point, your saved state machine should look similar to the following:

{{< figure
	src="/images/triggering-step10b.png"
	alt="Step 10b"
>}}

### Test the trigger

Now we can test the S3 upload event trigger. First, find a picture that we've not previously used (you can use any .png or .jpg, but try to use one with a single person with a clear view of thier face). Then, let's upload it to S3.

➡️ Step 11: From the AWS Management Console, type "S3" in the search field at the top of the window and select **s3** from the list of services.

{{< figure
	src="/images/triggering-step11.png"
	alt="Step 11"
>}}

➡️ Step 11: In the list of buckets, click the bucket beginning with `wildrydes-step-module-resource-riderphotos3bucket-`. You should see four objects in that bucket corresponding to the images that we pre-populated from the CloudFormation template. From here, you can upload your new photo by dragging and dropping the file from your computer onto this page (or by clicking the **Upload** button). If you dragged and dropped the file onto the browser window, you can simply click the **Upload** button at the bottom of the screen and can skip ahead to Step 13. 
