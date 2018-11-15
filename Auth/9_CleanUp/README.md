# Cleanup

### To prevent your account from accruing additional charges, you will want to remove any resources that are no longer needed.

#### Remove Cognito Resources and S3 Bucket Contents

1. First, we will need to empty the *S3 bucket* and remove resources such as your *Cognitio User Pools*.  We can run a script from the **Cloud9 IDE**

```
cd Cleanup
python cleanup.py
```

#### Remove API Stack

2.  Next, we will need to remove the *CloudFormation stack* for the API.  You called this the **WildRydesAPI**.  From the CloudFormation console, select the **WildRydesAPI** stack radio button.  From the actions menu, click Delete Stack.

#### Remove Cloud9 and VPC Stack

3.  Lastly, we will need to remove the *CloudFormation Stacks*.  Earlier, we had you deploy a CloudFormation template to create a VPC and A Cloud9 Instance.
Select the **VPC Infrastructure Stack** radio button.  From the Actions drop down, Choose Delete Stack.