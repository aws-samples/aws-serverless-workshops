# Building the Wild Rydes Backend Components Layer

In this module, you will deploy backend application components to AWS. These
backend components include AWS Lambda functions, API Gateway Endpoints and a
DynamoDB table. You will also create the IAM polices and roles required by
these components.

There are two ways to complete this module.  For learning purposes, we
recommend that workshop participants step through the Console instructions
while deploying the primary Ireland region, and then for time reasons, use the
provided CloudFormation instructions to quickly set up the second Singapore
region during module 3.

Both sets of instructions are provided – simply expand your preferred path.

<details>
<summary><strong>Console step-by-step instructions (expand for details)</strong></summary>

The following objects will be used as you create the resources in the console for this module:

* `Wild_Rydes_DynamoDB_Get.json` - This is the policy needed in order to read
  from DynamoDB using the `tickets-get.js` and `health-check.js` Lambda functions
* `Wild_Rydes_DynamoDB_Put.json` - This is the policy needed in order to write
  to DynamoDB using the `tickets-post.js` Lambda function
* `Wild_Rydes_DynamoDB_Replication.json` - This is the policy needed in order
  to use DynambDB Streams to replicate to a second region using the `replicate.js` Lambda function
* `replicate.js` Lambda function to replicate new DynamoDB records to our failover region
* `health-check.js` - Lambda function for checking the status of our application health
* `tickets-get.js` - Lambda function triggered by API Gateway to put application data into DynamoDB
* `tickets-post.js` - Lambda function triggered by API Gateway to read application data from DynamoDB

There are several steps needed to deploy the API and Lambda functions via the
console. The basic steps are:

1. Create the appropriate IAM policies and roles our four AWS Lambda functions
2. Create the required Amazon DynamoDB table
3. Create the four AWS Lambda functions
4. Create the Amazon API Gateway for the primary application region
5. Testing to ensure our backend components are all working as expected

Let’s go ahead and create all the needed polices and roles for our workshop

## 1. Create IAM Policies and Roles

Log into the AWS Console then select the **IAM** service. Now select
**Policies** from the left and click on the **Create policy** button.

![Create Policy](images/create-policy-1.png)

Select **Create Your Own Policy** from the next screen. Under Policy Name,
enter `Wild_Rydes_DynamoDB_Get`.

Next, open the policy below and cut and paste it into the editor in the AWS Console

Download policy: [Wild_Rydes_DynamoDB_Get.json](Wild_Rydes_DynamoDB_Get.json)

Click on **Validate Policy** followed by **Create Policy**.

![Create Policy Editor](images/create-policy-2.png)

Now repeat these exact same steps two more times in order to create the
following two additional polices that will be needed during the workshop.

**Download policy**: [Wild_Rydes_DynamoDB_Put.json](Wild_Rydes_DynamoDB_Put.json)

**Download policy**:
[Wild_Rydes_DynamoDB_Replication.json](Wild_Rydes_DynamoDB_Replication.json)

Next you will create the three roles that correspond to the three polices that
were just created. Each of these roles will be used by a different Lambda
function thereby limiting the permissions of each function. This follows an
AWS Best Practice of granting [least privilege](http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).

In the Console, select the **IAM** service and choose **Roles** from the left,
and click on the “Create role” button:

![Create Role](images/create-role-1.png)

Select the type of “AWS Service” and choose Lambda from the list below then
select **Next: Permissions**.

![Choose Role Type](images/create-role-lambda.png)

Find the `Wild_Rydes_DynamoDB_Get` policy you just created on the next screen
and select **Next: Review**

![Select Policy to Role](images/create-role-select-policy.png)

On the next screen, enter `Wild_Rydes_DynamoDB_Get` for the Role Name and select **Create role**

![Choose Role Final](images/create-role-final.png)

Repeat the same steps two more times, this time creating the role for
`Wild_Rydes_DynamoDB_Put` and `Wild_Rydes_DynamoDB_Replication` and attaching
the corresponding policy you created earlier.

## 2. Create the DynamoDB Table

Next we will create the DynamoDB Table for our application data. Ensure you
are set to Ireland (eu-west-1) in the upper right corner of the console. If
you mistakenly create the DynamoDB table in the wrong region, the application
will not work.

In the console, open **DynamoDB** (it can be found under Database).  Select
**Create Table**. Your screen may be slightly different depending on whether
this is your first DynamoDB table in this region or not.

![DymamoDB Create Button](images/dynamodb-create-button.png)

For the table name, enter `SXRTickets` and enter `id` as the Primary Key
Partition Key and then click **Create**. That’s all that is required for now
to set up the table.

![DymamoDB Create SXRTickets](images/dynamodb-create-sxrtickets.png)

## 3. Create Four Lambda functions

Next, you will create four Lambda functions. First, navigate to **Lambda** in
the console (again ensuring you are still in the Ireland region) and click
**Create a function**

![Create Lambda function](images/create-lambda-function.png)

Next select “Author from scratch”

![Lambda author from scratch](images/lambda-author-scratch.png)

Name your first function `Wild_Rydes_Lambda_Get` and assign the role with the **matching** name you created previously to it and click **Create function**

Ensure the runtime is `Node.js 6.10`.  If it isn’t, simply select it.

For the Handler, enter `tickets-get.handler` and then paste the following code into the editor you see on your screen:

[Lambda tickets-get.js](tickets-get.js)

Next, under `Environment Variables`, enter they key **TABLE_NAME** and the value **SXRTickets**

![Create Lambda Wild Rydes Get](images/create-lambda-wild-rydes-get.png)

Once everything is set correctly, click **Save** near the top center of the screen.

We still need to create three more lambda functions.  All of them use `Node.js 6.10` as the runtime.  Repeat the same steps you used above.  The table below provides the information needed for all four functions.  Note that you have already done the first one.

| Function Name          | Handler Name          | Execution Role                  | Env Var Key   | Env Var Value  |
| ---------------------  | --------------------- | ------------------------------- | ------------- | -------------- |
| [Wild_Rydes_Lambda_Get](tickets-get.js)  | tickets-get.handler   | Wild_Rydes_Lambda_Get           | TABLE_NAME    | SXRTickets     |
| [Wild_Rydes_Lambda_Put](tickets-put.js)  | tickets-put.handler   | Wild_Rydes_Lambda_Put           | TABLE_NAME    | SXRTickets     |
| [SXRReplication](replicate.js)         | use default           | Wild_Rydes_DynamoDB_Replication | TABLE_NAME    | SXRTickets     |
|                        |                       |                                 | TARGET_REGION | ap-southeast-1 |
| [SXRHealthCheckFunction](health-check.js) | health-check.handler  | Wild_Rydes_Lambda_Get           | TABLE_NAME    | SXRTickets     |


## 4. Create API Gateway Endpoint

In the console, under Application Services, open Amazon API Gateway and click on **Get Started**.  Click on OK if you are given a *Create Example API* dialogue.

![Create Example API](images/create-example-api.png)

Select **New API** and enter the API Name of `Wild_Rydes_API` and choose the Endpoint Type of *Regional* and then click **Create API**

![Create new API](images/create-new-api.png)

Next, from the *Actions* drop-down, choose **Create Resource** and name the resource *ticket* and select the *Enable API Gateway CORS* option and then click **Create Resource**

![Create api child CORS](images/api-child-resource-cors.png)

Next we will create two methods – one for Get and one for Post/Put

From the *Actions* drop-down select **Create Method** and then choose `GET` as your first method and select the check-box to confirm creation:

![Create api method get](images/api-method-get.png)

Keep *Lambda Function* selected, enable *Use Lambda Proxy Integration* and choose `eu-west-1` as the Lambda Region and then start typing in the Lambda Function box and choose *Wild_Rydes_Lambda_Get* and then click **Save**

![Setup api method get](images/api-method-get-setup.png)

Click OK when asked to *Add Permission to Lambda Function*

![api lambda permission](images/api-lambda-permission.png)

Now we’ll create our POST method following the same basic steps – from the *Actions* drop-down select **Create Method** but this time we’ll choose POST.

Ensure you choose *Wild_Rydes_Lambda_Put* as your function this time.

![Setup api method post](images/api-method-post-setup.png)

Again, click **OK** when asked to *Add Permission to Lambda Function*

Finally, we will enable Cross-Origin.  From the Actions drop-down, select “Enable CORS”

![actions enable cors apigw](images/actions-enable-cors.png)

Simply Accept the Default Settings and click on the “Enable CORS and Replace Existing CORS Headers” button:

![accept replace cors apigw](images/accept-replace-cors.png)

Click “Yes, replace existing values” if prompted.

Next we will deploy the API – this is done from the “Actions” pull-down, selecting “Deploy API”

![deploy api to prod](images/deploy-api-prod.png)

Then select “New Stage” for Deployment Stage and enter the Stage Name of “Prod” and click “Deploy”

![deploy api to prod](images/deploy-api-prod-new-stage.png)

You have now completed the setup of all the API and backend components needed for your primary region



</details>

<details>
<summary><strong>CLI step-by-step instructions (expand for details)</strong></summary>


Navigate to the `api` folder within your local Git repository and take a look at the files within. You will see three files

* `ticket-service.yaml` – This is a CloudFormation template (using SAM syntax) that describes the infrastructure needed to for the API and how each component should be configured.
* `tickets-get.js` – This is the Node.js code required by our Lambda function needed to retrieve tickets from DynamoDB
* `tickets-post.js` – This is the Node.js code required by our second Lambda function to create new tickets in DynamoDB



There is no modification necessary to this application code so we can go ahead and deploy it to AWS. Since it comes with a CloudFormation template, we can use this to upload our code and create all of the necessary AWS resources for us rather than doing this manually using the console which would take much longer. Remember that we will be setting all of this up again in a second region so using templates makes this process easily repeatable.  Feel free to open the template and take a look at the resources it is creating and how they are defined.

## 1. Create an S3 bucket to store the app code

We'll first need a bucket to store our source code in AWS.

#### High-level Instructions

Go ahead and create a bucket using the AWS Console or the CLI. S3 bucket names must be globally unique so choose a name for your bucket using something unique to you such as your name e.g. `wildrydes-firstname-lastname`. If you get an error that your bucket name already exists, try adding additional numbers or characters until you find an unused name.

You can create a bucket using the CLI with the following command:

     aws s3 mb s3://wildrydes-multiregion-blake-mitchell --region eu-west-1

Note that in this and in the following CLI commands, we are explicitly passing in the region. Like many things in AWS, S3 buckets are regional. If you do not specify a region, a default will be used which may not be what you want.

## 2. Package up the API code and push to S3

Because this is a SAM Template, we must first package it. This process will upload the source code to our S3 bucket and generate a new template referencing the code in S3 where it can be used by AWS Lambda.

#### High-level instructions

Go ahead and create two new Lambda functions using the the Node.js code from `tickets-post.js` and `tickets-get.js`.

You can do this using the following CLI command. Note that you must replace `[bucket-name]` in this command with the bucket you just created):

    aws cloudformation package \
    --region eu-west-1 \
    --template-file ticket-service.yaml \
    --output-template-file ticket-service-output.yaml \
    --s3-bucket [bucket_name]

If all went well, you should get a success message and instructions to deploy your new template.

## 3. Deploy a stack of resources

Next, we need to spin up the resources needed to run our code and expose it as an API.

#### High-level instructions

<details>
<summary><strong>CLI/CloudFormation step-by-step instructions (expand for details)</strong></summary>

You can now take the newly generated template and use it to create resources in AWS. Go ahead and run the following CLI command:

    aws cloudformation deploy \
    --region eu-west-1 \
    --template-file ticket-service-output.yaml \
    --stack-name ticket-service-api \
    --capabilities CAPABILITY_IAM


This command may take a few minutes to run. In this time you can hop over to the console and watch all of the resources being created for you. Open up the AWS Console in your browser and check you are in the correct region (EU Ireland) before selecting the CloudFormation service from the menu. You should your stack listed as `ticket-service-api`. You can click on this stack to see all of the resources it created.

***[TODO: Image of Cloudformation here with key areas marked]***

Once your stack has successfully completed, navigate to the Outputs tab of your stack where you will find an API URL. Take note of this URL as we will need it later to configure our UI.

***[TODO: Screenshot of the Resources tab]***

You can also take a look at some of the other resources created by this template. Under the Resources section of the Cloudformation stack you can click on the Lambda functions and the API Gateway. Note how the gateway was configured with the `GET` method calling our `TicketGetFunction` Lambda function and the `POST` method calling our `TicketPostFunction` Lambda function. You can also see that an empty DynamoDB table was set up as well as IAM roles to allow our functions to speak to DynamoDB.

</details>

You can confirm that your API is working by copying your API URL and appending `/ticket` to it before navigating to it into your browser. It should return the following:

    {"Items":[],"Count":0,"ScannedCount":0}

***[TODO: Screenshot of the API in a browser]***

## Completion

Congratulations! You have successfully deployed an API running on AWS Lambda and API Gateway by using CloudFormation. In the next module you will deploy a UI that uses this API to expose it to our users.

</details>

## Completion

Congratulations you have configured the backend components required by the
ticketing application. In the next module you will deploy a frontend that uses
these components.

Module 2: [Build a UI layer](../2_UI/README.md)
