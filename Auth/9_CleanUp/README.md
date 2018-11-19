# Cleanup

### *To prevent your account from accruing additional charges, you will want to remove any resources that are no longer needed.*

#### What charges will occur in my account?
1. **Cloud9 IDE:**  You pay for the compute and storage for the EC2 instance that the CloudFormation template deploys.  Note, that your Cloud9 environment is configured to shut down to reduce compute costs after 60 minutes.  
2. The remaining services such as Lambda, API Gateway, Cognito and DynamoDB all have a free tier.  You may still want to remove these resources.  You can do this by following the procedure below.  


#### Empty S3 Bucket Contents and Remove Bucket

1. First, we will need to empty the ***S3 bucket*** that was created by our CloudFormation template.
2. Go the AWS Management Console, click **Services** then select **CloudFormation** under Management Tools.
3. In the **CloudFormation** console, click on your *Wild Rydes* stack name, such as `WildRydesAPI`.
4.  Click on the **Outputs** tab.
5.  Copy your bucket name to your clipboard. It is the name shown under Value for the key called `WildRydesProfilePicturesBucket`.
6.  Open the Cloud9 IDE 
7. Within the Cloud9 IDE, open up the terminal.  You can do this by clicking the `+` icon in the lower pane and selecting **New Terminal**.

	![Cloud9 Terminal](../images/cloud9-new-terminal.png)

8.  Paste the following command and be sure to update your S3 bucket name:
```
$ aws s3 rb s3://MY-BUCKET-NAME --force 
```

#### Remove the Cognito Resources
1.  From your **Cloud9 IDE** run the following:

> Be sure to paste your identity pool id from your scratch pad (ex. us-west-2:b4b755cd-d359-42a1-9b49-f0e73f5b2571)
	
```
aws cognito-identity delete-identity-pool --identity-pool-id MY-IDENTITY-POOL-ID-HERE
```
> If you lost your scratch pad with you idenity pool id, you can run a list call via CLI and find the proper identiy pool id, then run the abouve delete call.
``` aws cognito-identity list-identity-pools --max-results 10```

2.Next, run the following to delete the User Pool you created:

> Be sure to paste your user pool id from your scratch pad (ex. us-west-2:us-west-2_srLwFQiEC)

```
aws cognito-idp delete-user-pool --user-pool-id MY-USER-POOL-ID-HERE
```
> If you lost your scratch pad with your user pool id, you can run a list call via CLI and find the proper user pool id, then run the abouve delete call.
```aws cognito-idp list-user-pools --max-results 10```

#### Remove WildRydes Backend

1.  Next, we will need to remove the *CloudFormation stack* for the API.  You called this the **WildRydesBackend**.  Once again, from the terminal of the **Cloud9 IDE**, run:

```
aws cloudformation delete-stack --stack-name WildRydesBackend
```
> If you changed the name of your stack from the default, you will need to update the stack name to what you adjusted it to.  If you clicked the quick link in the instructions, no adjustment to the command above is needed.  You can run `aws cloudformation describe-stacks` to find your stack name.

#### Remove Cloud9 and VPC Stack

1.  Lastly, we will need to remove the *CloudFormation Stack* for the **Cloud9 instance** and the VPC.  You called this **WildRydes-Cloud9**

```
aws cloudformation delete-stack --stack-name WildRydes-Cloud9
```
> If you changed the name of your stack from the default, you will need to update the stack name to what you adjusted it to.  If you clicked the quick link in the instructions, no adjustment to the command above is needed.  You can run `aws cloudformation describe-stacks` to find your stack name.
