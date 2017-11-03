# Building an API Layer

In this module you will deploy application code to AWS Lambda to build the API that will allow our users to create their support tickets.

Navigate to the `api` folder within your local Git repository and take a look at the files within. You will see three files

* `ticket-service.yaml` – This is a CloudFormation template (using SAM syntax) that describes the infrastructure needed to for the API and how each component should be configured.
* `tickets-get.js` – This is the Node.js code required by our Lambda function needed to retrieve tickets from DynamoDB
* `tickets-post.js` – This is the Node.js code required by our second Lambda function to create new tickets in DynamoDB

There is no modification necessary to this application code so we can go ahead and deploy it to AWS. Since it comes with a CloudFormation template, we can use this to upload our code and create all of the necessary AWS resources for us rather than doing this manually using the console which would take much longer. Remember that we will be setting all of this up again in a second region so using templates makes this process easily repeatable.  Feel free to open the template and take a look at the resources it is creating and how they are defined.

## 1. Create an S3 bucket to store the app code

We'll first need a bucket to store our source code in AWS.

#### High-level Instructions

Go ahead and create a bucket using the AWS Console or the CLI. S3 bucket names must be globally unique so choose a name for your bucket using something unique to you such as your name e.g. `wildrydes-firstname-lastname`. If you get an error that your bucket name already exists, try adding additional numbers or characters until you find an unused name.

<details>
<summary><strong>Console step-by-step instructions (expand for details)</strong></summary>

1. In the AWS Console choose **Services** then select **S3** under Storage.
2. Choose **+ Create Bucket**
3. Provide a globally unique name for your bucket such as `wildrydes-firstname-lastname`.
4. Select the primary region for this workshop from the dropdown (EU Ireland).

Choose **Create** in the lower left of the dialog without selecting a bucket to copy settings from.

<kbd>![Create Bucket](../images/mr-api-create-bucket.png)</kbd>

</details>

<details>
<summary><strong>CLI step-by-step instructions (expand for details)</strong></summary>

You can create a bucket using the CLI with the following command:

     aws s3 mb s3://[bucket_name] --region eu-west-1

Note that in this and in the following CLI commands, we are explicitly passing in the region. Like many things in AWS, S3 buckets are regional. If you do not specify a region, a default will be used which may not be what you want.

</details>

## 2. Package up the API code and push to S3

Because this is a SAM Template, we must first package it. This process will upload the source code to our S3 bucket and generate a new template referencing the code in S3 where it can be used by AWS Lambda.

#### High-level instructions

Go ahead and create two new Lambda functions using the the Node.js code from `tickets-post.js` and `tickets-get.js`.

<details>
<summary><strong>Console step-by-step instructions (expand for details)</strong></summary>

***[TODO: How to do this using the Console]***

</details>

<details>
<summary><strong>CLI/CloudFormation step-by-step instructions (expand for details)</strong></summary>

You can do this using the following CLI command. Note that you must replace `[bucket-name]` in this command with the bucket you just created):

    aws cloudformation package \
    --region eu-west-1 \
    --template-file ticket-service.yaml \
    --output-template-file ticket-service-output.yaml \
    --s3-bucket [bucket_name]

If all went well, you should get a success message and instructions to deploy your new template.

</details>

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
