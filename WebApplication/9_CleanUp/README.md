# Workshop Cleanup

This page provides instructions for cleaning up the resources created during the preceding modules.

## Resource Cleanup Instructions

### 1. Module 4 Cleanup
Delete the REST API created in module 4. There is a **Delete API** option in the **Actions** drop-down when you select your API in the Amazon API Gateway Console.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console, click **Services** then select **API Gateway** under Application Services.

1. Select the API you created in module 4.

1. Expand the **Actions** drop-down and choose **Delete API**.

1. Enter the name of your API when prompted and choose **Delete API**.

</p></details>


### 2. Module 3 Cleanup
Delete the AWS Lambda function, IAM role and Amazon DynamoDB table you created in module 3.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

#### Lambda Function

1. In the AWS Management Console, click **Services** then select **Lambda** under Compute.

1. Select the `RequestUnicorn-<hash>` (where 'hash' is your assigned unique hash) function you created in module 3.

1. From the **Actions** drop-down, choose **Delete function**.

1. Choose **Delete** when prompted to confirm.

#### IAM Role

1. In the AWS Management Console, click **Services** then select **IAM** under Security, Identity & Compliance.

1. Select **Roles** from the navigation menu.

1. Type `WildRydesLambda-<hash>` (where 'hash' is your assigned unique hash) into the filter box.

1. Select the role you created in module 3.

1. From the **Role actions** drop-down, select **Delete role**.

1. Choose **Yes, Delete** when prompted to confirm.

#### DynamoDB Table

1. In the AWS Management Console, click **Services** then select **DynamoDB** under Databases

1. Choose **Tables** in the navigation menu.

1. Choose the **Rides-<hash>** (where 'hash' is your assigned unique hash) table you created in module 3.

1. Choose **Delete table** from the **Actions** drop-down.

1. Leave the checkbox to **Delete all CloudWatch alarms for this table** selected and choose **Delete**.

</p></details>

### 3. Module 2 Cleanup
If you used the provided AWS CloudFormation template to complete module 2, simply delete the stack using the AWS CloudFormation Console. Otherwise, delete the Amazon Cognito user pool you created in module 2.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. From the AWS Console click **Services** then select **Cognito** under Mobile Services.

1. Choose **Manage your User Pools**.

1. Select the **WildRydes-<hash>** (where 'hash' is your assigned unique hash) user pool you created in module 2.

1. Choose **Delete Pool** in the upper right corner of the page.

1. Type `delete` and choose **Delete Pool** when prompted to confirm.

</p></details>

### 4. Module 1 Cleanup
If you used the provided AWS CloudFormation template to complete module 1, simply delete the stack using the AWS CloudFormation Console. Otherwise, delete the Amazon S3 bucket you created in module 1.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console choose **Services** then select **S3** under Storage.

1. Select the bucket you created in module 1.

1. Choose **Delete bucket**.

1. Enter the name of your bucket when prompted to confirm, Then choose confirm.

</p></details>


### 6. CloudWatch Logs
AWS Lambda automatically creates a new log group per function in Amazon CloudWatch Logs and writes logs to it when your function is invoked. You should delete the log group for the **RequestUnicorn** function. Also, if you launched any CloudFormation stacks, there may be log groups associated with custom resources in those stacks that you should delete.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. From the AWS Console click **Services** then select **CloudWatch** under Management Tools.

1. Choose **Logs** in the navigation menu.

1. Select the **/aws/lambda/RequestUnicorn-<hash>** (where 'hash' is your assigned unique hash) log group. If you have many log groups in your account, you can type `/aws/lambda/RequestUnicorn` into the **Filter** text box to easily locate the log group.

1. Choose **Delete log group** from the **Actions** drop-down.

1. Choose **Yes, Delete** when prompted to confirm.

1. If you launched any CloudFormation templates to complete a module, repeat steps 3-5 for any log groups which begin with `/aws/lambda/wildrydes-webapp`.

</p></details>
