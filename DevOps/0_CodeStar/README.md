# Module 0: CodeStar Project

In this module you'll use the [AWS CodeStar](https://aws.amazon.com/codestar/) service to create a project that will include:

* An [AWS CodeCommit](https://aws.amazon.com/codecommit/) Git repository, pre-populated with a sample RESTful API written in Node.js
* An [AWS CodeBuild](https://aws.amazon.com/codebuild/) build project
* An [AWS CodePipeline](https://aws.amazon.com/codepipeline/) continuous delivery pipeline

## CodeStar Overview

AWS CodeStar is a cloud-based service for creating, managing, and working with software development projects on AWS. You can quickly develop, build, and deploy applications on AWS with an AWS CodeStar project. An AWS CodeStar project creates and integrates AWS services for your project development toolchain. Depending on your choice of AWS CodeStar project template, that toolchain might include source control, build, deployment, virtual servers or serverless resources, and more.

## Environment Setup

Each of the following sections provide an implementation overview and detailed, step-by-step instructions. The overview should provide enough context for you to complete the implementation if you're already familiar with the AWS Management Console or you want to explore the services yourself without following a walkthrough.

If you're using the latest version of the Chrome, Firefox, or Safari web browsers the step-by-step instructions won't be visible until you expand the section.

### Region Selection

This workshop can be deployed in any AWS region that supports the following services:

- Amazon API Gateway
- Amazon DynamoDB
- Amazon S3
- AWS CodeBuild
- AWS CodePipeline
- AWS CodeStar
- AWS Lambda
- AWS X-Ray

This workshop is available in the **Ireland** and **Sydney** regions.


Once you've chosen a region, you should deploy all of the resources for this workshop there. Make sure you select your region from the dropdown in the upper right corner of the AWS Console before getting started.


### 1. Create a CodeStar project

**Goal**: Use the AWS Console to create a CodeStar project called `uni-api` using the **Node.js Lambda Webservice** template.  Use a web browser to confirm that the API Gateway endpoint created by CodeStar returns the message, `{"Output":"Hello World!"}`, in its response.

<details>
<summary><strong>HOW TO create a CodeStar Project (expand for details)</strong></summary><p>

1. In the AWS Management Console choose **Services** then select **CodeStar** under Developer Tools.

1. If this is not your first CodeStar project, please skip to step 4 to create a new project.  If this is your first CodeStar project, you will see the CodeStar welcome screen below.  Click the **Start a project** button to get started.

    ![CodeStar 1](images/codestar-1.png)

1. If this is your first CodeStar project, you will be prompted to confirm that you are granting CodeStar permission to create other AWS resources on your behalf, such as CodeCommit repositories, CodePipeline pipelines, and CodeBuild projects.  Click **Yes, create role** to proceed.

    ![CodeStar 2](images/codestar-2.png)

1. If you have previously created CodeStar projects, you will see them listed in the project list.  Click **Create a new project** to proceed.

    ![CodeStar 3](images/codestar-3.png)

1. To narrow the choices for CodeStar projects, select **Web service**, **Node.js**, and **AWS Lambda** in the left navigation.  This should narrow the project options to the **Express.js** web service project, using AWS Lambda.  Select this box to proceed.

    ![CodeStar 4](images/codestar-4.png)

1. Type `uni-api` as the **Project name**, select **AWS CodeCommit** as the repository, and click the **Next** button in the lower right corner of the browser window to proceed.

    ![CodeStar 5](images/codestar-5.png)

1. Cick the **Create Project** button in the lower right corner of the browser window to proceed.

    ![CodeStar 5b](images/codestar-5b.png)

1. Your IAM user name (not pictured below) will be displayed.  Type a user **Display Name** and **Email** in the according text boxes and click the **Next** button in the lower right corner of the browser window to proceed.

    ![CodeStar 6](images/codestar-6.png)

1. The next screen asks how you will edit your project code.  You will come back to this configuration later in this module and can click the **Skip** button in the lower right corner of the browser window to proceed.

    ![CodeStar 7](images/codestar-7.png)

1. The screen below is your CodeStar project dashboard.  After creating a new project, there will be a short delay as CodeStar provisions the resources for CodeCommit, CodeBuild, CodePipeline, and additional resources related to your project template, Lambda functions in this case.  When the progress bar in the upper right of the browser window reaches 100% complete, the provisioning phase of project creation is complete.

    ![CodeStar 8](images/codestar-8.png)

1. Once provisioning is complete, there will be a brief delay as the CodePipeline pipeline executes for the first time.  The pipeline consists of three stages:

    * Source stage: source code is copied from the CodeCommit repository
    * Build stage: a CodeBuild project executes the commands defined in the project's buildspec.yml to compile the source code into a deployable artifact, in this case, a Serverless Application Model (SAM) artifact in this case
    * Deploy stage: CloudFormation is used to deploy the SAM artifact, representing Lambda functions and an API Gateway environment.

    When these stages are complete, an API Gateway **Application endpoint** will appear in the dashboard.

    ![CodeStar 9](images/codestar-9.png)

1. Open the **Application endpoint** in a browser window and confirm the response message to read `{"Output":"Hello World!"}`

    ![CodeStar 10](images/codestar-10.png)

</p></details>
<p>

Congratulations!  You have successfully create a serverless web service project using CodeStar.  In the next section, you will use a Git client to clone the repository to your workstation.

## Clone CodeCommit Git Repository

**Goal:** From the CodeStar dashboard for the `uni-api` project, find the CodeCommit instructions to clone the Git repository to your local workstation.

<details>
<summary><strong>HOW TO clone the CodeCommit git repository (expand for details)</strong></summary><p>

1. In the upper right corner of the CodeStar project dashboard browser window, click the **Connect Tools** button.

    ![CodeStar 11](images/codestar-11.png)
    
    You can also click the **Connect** button in the bottom left corner of the **Commit history** project tile.
    
    ![CodeStar 11](images/codestar-11b.png)
    
1. You can select instructions to clone the CodeCommit respository using **Visual Studio**, **Eclipse**, or **Command line tools**.  Click **See instructions** for instructions for cloning to **macOS**, **Windows**, and **Linux** operating systems.  Complete the instructions to clone the CodeCommit Git repository to your local workstation.

    ![CodeStar 12](images/codestar-12.png)

</p></details>
<p>

Congratulations!  You have successfully cloned the `uni-api` project to your local workstation.  In future modules, you will use this local version to commit changes to the source code, push them to the project Git repository, and trigger automatic execution of the project's continuous delivery pipeline.



## Completion

You have successfully created a CodeStar project, tested the sample REST API, and cloned the project Git repository to your workstation.  In the next [Serverless Application Model (SAM) Module](../1_ServerlessApplicationModel), you will learn more about SAM and how to use it test your API on your workstation.
