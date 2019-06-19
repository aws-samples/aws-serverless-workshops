# Workshop Cleanup

This page provides instructions for cleaning up the resources created during the preceding modules.

## Resource Cleanup Instructions

### 1. Module 6 - AppSync GraphQL API Cleanup

<details>
<summary><strong>:white_check_mark: Step-by-step directions(expand for details)</strong></summary><p>
Delete the AppSync GraphQL API. From the AppSync console, select the application and click **Delete**

1. Go to the [AWS AppSync Console][appsync-console].
1. Select the API created for this workshop.
1. Select **Delete** from the top right.
1. Complete the application deletion process.

</p></details>

### 2. Module 5 - OAuth Cleanup

<details>
<summary><strong>:white_check_mark: Step-by-step directions(expand for details)</strong></summary><p>
Delete the Unicorn Manager CloudFront distribution and S3 bucket for the static website hosting created in module 5. Using the Lambda console, also delete the **ListUnicornRides** and **ListUnicornAuthorizer** functions. If you have deployed the pre-requisites CloudFormation stack, delete the stack using the CloudFormation console.

1. In the AWS Management Console, click **Services** then select **CloudFront** under Networking & Content Delivery.

1. Select the distribution for the Unicorn Manager application we created in module 5 and click **Disable**.

1. Once the distribution is disabled, click **Delete**.

1. Using the **Services** dropdown, navigate to the **S3** console under Storage.

1. Select the **unicornmanager-xxx** bucket and click **Delete bucket**. In the confirmation window enter the bucket name and click **Confirm**.

1. Next, using the **Services** dropdown navigate to the **Lambda** console under Compute.

1. From the functions list, select the **ListUnicornRides** function and use the **Actions** dropdown to select **Delete**.

1. Repeat the same operation for the **ListUnicornAuthorizer** function.

1. If you have deployed the pre-requisites stack before starting module 5, navigate to the **CloudFormation** console under Management Tools.

1. Select the **WildRydes-xxx** stack and use the **Actions** dropdown to click **Delete Stack**.

</p></details>

### 3. Module 4 - REST API Cleanup
Delete the REST API created in module 4. There is a **Delete API** option in the **Actions** drop-down when you select your API in the Amazon API Gateway Console.

**:white_check_mark: Step-by-step directions**

1. Go to the [Amazon API Gateway Console][api-gw-console]
1. Select the API you created in module 4.
1. Expand the **Actions** drop-down and choose **Delete API**.
1. Enter the name of your API when prompted and choose **Delete API**.

### 4. Module 3 - Serverless Backend Cleanup
Delete the AWS Lambda function, IAM role and Amazon DynamoDB table you created in module 3.

**:white_check_mark: Step-by-step directions**

#### Lambda Function

1. Go to the [AWS Lambda console][lambda-console]
1. Select the `RequestUnicorn` function you created in module 3.
1. From the **Actions** drop-down, choose **Delete function**.
1. Choose **Delete** when prompted to confirm.

#### IAM Role

1. Go to the [AWS IAM Console][iam-console]
1. Select **Roles** from the navigation menu.
1. Type `WildRydesLambda` into the filter box.
1. Select the role you created in module 3.
1. From the **Role actions** drop-down, select **Delete role**.
1. Choose **Yes, Delete** when prompted to confirm.

#### DynamoDB Table

1. Go to the [Amazon DynamoDB Console][dynamodb-console]
1. Choose **Tables** in the navigation menu.
1. Choose the **Rides** table you created in module 3.
1. Choose **Delete table** from the **Actions** drop-down.
1. Leave the checkbox to **Delete all CloudWatch alarms for this table** selected and choose **Delete**.

### 5. Module 2 - User Management Cleanup
Delete the Amazon Cognito User Pool

**:white_check_mark: Step-by-step directions**

1. Go to the [Amazon Cognito Console][cognito-console]
1. Choose **Manage your User Pools**.
1. Select the **WildRydes** user pool you created in module 2.
1. Choose **Delete Pool** in the upper right corner of the page.
1. Complete the application deletion process.

### 6. Module 1 - Web Application Cleanup
Delete the AWS Amplify Console application and optionally the AWS CodeCommit or GitHub repository created:

**:white_check_mark: Step-by-step directions**

#### For the Amplify Console web applcation:

1. Launch the [Amplify Console console page][amplify-console-console].
1. Select the application you launched today.
1. From **Actions** in the top right corner, select *Delete App*
1. Complete the application deletion process.

#### For the CodeCommit repository:

1. Open the [AWS CodeCommit console][codecommit-console]
1. Select the radio button next to the repository created today.
1. Select **Delete repository** from the upper right of the page.
1. Complete the repository deletion process.


### 7. CloudWatch Logs Cleanup
AWS Lambda automatically creates a new log group per function in Amazon CloudWatch Logs and writes logs to it when your function is invoked. You should delete the log group for the **RequestUnicorn** function.

**:white_check_mark: Step-by-step directions**

1. From the AWS Console click **Services** then select **CloudWatch** under Management Tools.
1. Choose **Logs** in the navigation menu.
1. Select the **/aws/lambda/RequestUnicorn** log group. If you have many log groups in your account, you can type `/aws/lambda/RequestUnicorn` into the **Filter** text box to easily locate the log group.
1. Choose **Delete log group** from the **Actions** drop-down.
1. Choose **Yes, Delete** when prompted to confirm.
1. If you launched any CloudFormation templates to complete a module, repeat steps 3-5 for any log groups which begin with `/aws/lambda/wildrydes-webapp`.

### 8. Cloud9 Cleanup
Delete the Cloud9 Development environment created today. 

**:white_check_mark: Step-by-step directions**

1. Launch the [Cloud9 console page][cloud9-console].
1. Select the environment you launched today.
1. From the top navigation, select **Delete**
1. Complete the application deletion process.


[amplify-console-console]: https://console.aws.amazon.com/amplify/home
[amplify-console]: https://aws.amazon.com/amplify/console/
[api-gw-console]: https://console.aws.amazon.com/apigateway/home
[cloud9-console]: https://console.aws.amazon.com/cloud9/home
[codecommit-console]: https://console.aws.amazon.com/codesuite/codecommit/repositories
[codecommit-free]: https://aws.amazon.com/codecommit/pricing/
[cognito-console]: https://console.aws.amazon.com/cognito/home
[commit]: https://aws.amazon.com/codecommit
[create-repo]: https://help.github.com/en/articles/create-a-repo
[dynamodb-console]: https://console.aws.amazon.com/dynamodb/home
[github-clone]: https://help.github.com/en/articles/cloning-a-repository
[github]: https://github.com
[github-new-sshkey]: https://help.github.com/en/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
[iam-console]: https://console.aws.amazon.com/iam/home
[lambda-console]: https://console.aws.amazon.com/lambda/home
[region-services]: https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/
[setup]: ../0_Setup/
[user-management]: ../2_UserManagement/
