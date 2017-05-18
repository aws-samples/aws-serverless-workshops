# Workshop Cleanup

This page provides instructions for cleaning up the resources created during the preceding modules.

## Resource Cleanup Instructions

### 1. Module 4 Cleanup
Delete the AWS CloudFormation Stacks for `wildrydes-unicorn-api-test` and `wildrydes-unicorn-api-beta`.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console, click **Services** then select **CloudFormation** under Management Tools.

1. Select the checkbox to the left of the `wildrydes-unicorn-api-test` Stack.

1. Select the Actions dropdown menu above the list of Stacks.

1. Select **Delete Stack**.

1. Select **Yes, Delete**.

Repeat these steps for the `wildrydes-unicorn-api-beta` Stack.

</p></details>

### 2. Module 3 Cleanup

No actions required to cleanup Module 3.

### 3. Module 2 Cleanup

#### IAM Role

Delete the IAM Roles for `WildRydesUnicornApiCloudFormation`, `WildRydesUnicornApiCodeBuild`, and `WildRydesUnicornApiCodePipeline`.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console, click **Services** then select **IAM** under Security, Identity & Compliance.

1. Select **Roles** from the navigation menu.

1. Type `WildRydesUnicornApiCloudFormation` into the filter box.

1. Select the role.

1. From the **Role actions** drop-down, select **Delete role**.

1. Choose **Yes, Delete** when prompted to confirm.

Repeat these steps for the `WildRydesUnicornApiCodeBuild` and `WildRydesUnicornApiCodePipeline` Roles.

</p></details>

#### CodeBuild

Delete the AWS CodeBuild project `wildrydes-unicorn-api`.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console, click **Services** then select **CodeBuild** under Developer Tools.

1. Select `wildrydes-unicorn-api` from the list of Build projects.

1. From the **Actions** drop-down, select **Delete**.

1. Choose **Delete** when prompted to confirm.

</p></details>

#### CodePipeline

Delete the AWS CodePipeline pipeline `wildrydes-unicorn-api`.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console, click **Services** then select **CodePipeline** under Developer Tools.

1. Select `wildrydes-unicorn-api` from the list of Pipelines.

1. Choose **Edit**.

1. Choose **Delete**.

1. Enter `wildrydes-unicorn-api` as the name of the pipeline to confirm deletion.

1. Choose **Delete**.

1. Choose the Refresh Icon to update the list of pipelines and confirm `wildrydes-unicorn-api` is no longer listed.

</p></details>

### 4. Module 1 Cleanup

#### CloudFormation
Delete the AWS CloudFormation Stack for `wildrydes-unicorn-api`.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console, click **Services** then select **CloudFormation** under Management Tools.

1. Select the checkbox to the left of the `wildrydes-unicorn-api` Stack.

1. Select the Actions dropdown menu above the list of Stacks.

1. Select **Delete Stack**.

1. Select **Yes, Delete**.

</p></details>

#### S3
Delete the S3 Bucket that was created in Module 1.  The recommended name for the Bucket was `wildrydes-devops-yourname`, however you may have chosen differently.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console choose **Services** then select **S3** under Storage.

1. Select the bucket you created in module 1.

1. Choose **Delete bucket**.

1. Enter the name of your bucket when prompted to confirm, Then choose confirm.

</p></details>


### 5. CloudWatch Logs
AWS Lambda automatically creates a new log group per function in Amazon CloudWatch Logs and writes logs to it when your function is invoked. You should delete the log group for the **wildrydes-unicorn-api-*** functions.  You should also delete the log group for the **wildrydes-unicorn-api** CodeBuild project.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. From the AWS Console click **Services** then select **CloudWatch** under Management Tools.

1. Choose **Logs** in the navigation menu.

1. Type `/aws/lambda/wildrydes-unicorn-api` into the **Filter** text box to locate the log groups.

For each log group, perform the following steps:

1. Select the log group

1. Choose **Delete log group** from the **Actions** drop-down.

1. Choose **Yes, Delete** when prompted to confirm.

Follow the steps above to filter and delete the `/aws/codebuild/wildrydes-unicorn-api` log group.

</p></details>
