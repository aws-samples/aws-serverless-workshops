# Module 2: Serverless API Authentication and Authorization

In this module, you will add a serverless API backend to our Wild Rydes application leveraging [Amazon API Gateway](https://aws.amazon.com/api-gateway/) and [AWS Lambda](https://aws.amazon.com/lambda/). You will then enable authentication and authorization on your API to secure the backend to only accept valid, authorized requests.

## Solution Architecture

Building on Module 1, this module will add a Serverless backend API built using Amazon API Gateway and AWS Lambda. For persistence, we will use Amazon DynamoDB as a NoSQL data store. All of the above services are serverless so you can seamlessly scale your application as your demands grow. After creating the API, we will integrate our client application to call it via the AWS Amplify library.

![Module 2 architecture](../images/wildrydes-module2-architecture.png)

## Implementation Overview

Each of the following sections provides an implementation overview and detailed, step-by-step instructions. The overview should provide enough context for you to complete the implementation if you're already familiar with the AWS Management Console or you want to explore the services yourself without following a walkthrough.

If you're using the latest version of the Chrome, Firefox, or Safari web browsers the step-by-step instructions won't be visible until you expand the section.

### 1. Creating Serverless API backend stack from CloudFormation template

You will be creating your Serverless API built with Amazon API Gateway, AWS Lambda, and Amazon DynamoDB via a CloudFormation template. Since this workshop is focused on authentication and authorization, this template will create the backend infrastructure, but not enable any security settings and the rest of the module will enable and configure such settings.

#### High-Level Instructions

Create a new CloudFormation stack by uploading the **ServerlessAPI.yaml** file in the module 2 folder. Name the stack `WildRydesAPI`.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. Go the AWS Management Console, click **Services** then select **CloudFormation** under Management Tools.

1. In the CloudFormation console, click **Create stack** and in Step 1, choose **Upload a template file**. Upload the **ServerlessAPI.yaml** CloudFormation template found in the module 2 folder within the Auth workshop folder and click **Next**.

1. On the next screen, Step 2, enter a Stack such as `WildRydesAPI` and click **Next**.

1. On the Configure Stack Options page, accept all the defaults and click **Next**.

1. Choose to **Acknwledge that the CloudFormation template may create IAM resources with custom names**. Finally, click **Create stack**.

1. It will take a few minutes for the Stack to create. Wait until the stack is fully launched and shows a Status of **CREATE_COMPLETE**.

1. With the `WildRydesAPI` stack selected, click on the **Outputs** tab and copy the value shown for the `WildRydesApiInvokeUrl` to the clipboard.

</p></details>

## 2. Integrate API into Wild Rydes application
## 3. Enable authentication via Cognito User Pools
## 4. Authorize requests with IAM and request signing
## 5. Update IAM role for Cognito users to be able to invoke API