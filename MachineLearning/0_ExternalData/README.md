# Module 0: Leveraging External Data in Exploratory Work

In data analysis you often have hunches that you need to prove or disprove.  This module walks through the steps of loading and cleansing an external dataset - in this case, 3rd party weather data (see below for data set details).

Here are the Cloudformation templates to launch the full stack in it's completed state:

Region| Launch
------|-----
US East (N. Virginia) | [![Launch Module 1 in us-east-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=wildrydes-machine-learning-module-0&templateURL=https://s3.amazonaws.com/wildrydes-us-east-1/WorkshopTemplate/1_ExampleTemplate/example.yaml)

<details>
<summary><strong>CloudFormation Launch Instructions (expand for details)</strong></summary><p>

Manually:

1. Click the **Launch Stack** link above for the region of your choice.

1. Click **Next** on the Select Template page.

1. On the Options page, leave all the defaults and click **Next**.

1. On the Review page, check the box to acknowledge that CloudFormation will create IAM resources and click **Create**.

1. On the Review page click **Create**.

1. Wait for the `wildrydes-machine-learning-module-0` stack to reach a status of `CREATE_COMPLETE`.

1. With the `wildrydes-machine-learning-module-0` stack selected, click on the **Outputs** tab

CLI:
```
aws cloudformation create-stack \
--stack-name wildrydes-machine-learning-module-0 \
--capabilities CAPABILITY_NAMED_IAM \
--template-body file://cloudformation/infrastructure.yml
```

</p></details>


## Solution Architecture

![Architecture diagram](assets/WildRydesML.png)

Source for Draw.io: [diagram xml](assets/WildRydesML.xml)


## Implementation Overview

The following provides an overview of the steps needed to complete this module. Each section is intended to provide enough details to complete the module for students who are already familiar with the AWS console and CLI. If you'd like detailed, step-by-step instructions, look for a check mark and expand that section.

#### Upload raw travel data

We have data collected from our unicorns of which we're going to focus on two attributes: magic points and distance. We hold a strong belief that a unicorn is heavily utilized when the number of magic points is more than 50 times the distance traveled. We can apply this business logic as a new attribute to our data using AWS Lambda.

Use the console or CLI to upload travel data to the raw S3 bucket. Once you upload the raw travel data file, a process will be started involving three AWS Lambda functions and two Amazon Simple Queue Service (SQS) queues. You can use the [Amazon SQS console](https://console.aws.amazon.com/sqs/home?region=us-east-1) to track how your Lambda functions are processing the data and/or use the CloudWatch Dashboard built as part of this lab.

High level steps:

1. Manually upload ride_data.json into the raw bucket generated from your CF template
1. S3 event automatically triggers the Parse Unicorn Data function
1. Parse Unicorn Data function will read the JSON file and places each entry on an SQS queue
1. Find Nearest Ground Station function reads from the SQS queue, finds the closest weather station, and applies a label indicating if the ride was a "heavy utilization" scenario
1. Find Nearest Ground Station function places the record on another SQS queue
1. Processed Data to S3 function puts the record back into s3 in the transformed bucket in CSV format

<details>
<summary><strong>:white_check_mark: Step-by-step directions (expand for details)</strong></summary><p>

Console:

1. Navigate to your [AWS CloudFormation](https://console.aws.amazon.com/cloudformation/home?region=us-east-1) stack in the AWS Console
1. In the outputs tab, take note of the **RawDataBucketName** value
1. Open [Amazon S3](https://s3.console.aws.amazon.com/s3/home?region=us-east-1) in the AWS Console
1. Navigate to the raw data bucket and click into it
1. Click **Upload**
1. Click **Add files**

CLI:
```
aws cloudformation describe-stacks \
  --stack-name wildrydes-machine-learning-module-0 \
  --query "Stacks[0].Outputs[?OutputKey=='RawDataBucketName'].OutputValue" \
  --output text | xargs -I {} \
      aws s3 cp data/ride_data.json s3://{}
```
</p></details><br>

Our travel data has been processed and stored back in S3. We want to see if weather is impacting the magic points used by our unicorns. Let's get some weather related data to fold in.

#### Ground Station Data Prep

The dataset we're using is [NOAA Global Historical Climatology Network Daily (GHCN-D)](https://registry.opendata.aws/noaa-ghcn/) ([dataset readme](https://docs.opendata.aws/noaa-ghcn-pds/readme.html)).  There are roughly one billion records in this public data set. We should pair that down. Since our unicorns operate within the New York City area, we're only interested in those ground stations:

```
US1NYNY0074  40.7969  -73.9330    6.1 NY NEW YORK 8.8 N
USW00014732  40.7794  -73.8803    3.4 NY NEW YORK LAGUARDIA AP
USW00094728  40.7789  -73.9692   39.6 NY NEW YORK CNTRL PK TWR
USW00094789  40.6386  -73.7622    3.4 NY NEW YORK JFK INTL AP
```

:white_check_mark: **Step-by-step directions**

1. Navigate to your [AWS CloudFormation](https://console.aws.amazon.com/cloudformation/home?region=us-east-1) stack in the AWS Console
1. In the outputs tab, grab the **AthenaSelectQuery** value
1. Open [Amazon Athena](https://console.aws.amazon.com/athena/home?region=us-east-1) and run that command.
1. Go back to [AWS CloudFormation](https://console.aws.amazon.com/cloudformation/home?region=us-east-1), in the outputs tab, click into the **AthenaCSVLocation** link and drill into today's date until you find a CSV for the query you just ran.  It will contain the results of your query in CSV format that you can later provide the path to your notebook.
1. Check the box next to the CSV file, click **Actions**, **Copy**
1. Navigate to your transformed data bucket
1. Create a new folder by clicking **Create folder** and type `nygroundstationdata`
1. Navigate into **nygroundstationdata**, click **Actions**, **Paste**
1. Now you have the relevant weather data in CSV format in our transformed data bucket.

Without provisioning any servers we were able to use Amazon Athena to get the records we need from 94 GB of data in about 20 seconds. Now our ride data has been augmented with business logic and we have weather data from relevant weather stations. We can now mold this data using our SageMaker notebook.

#### Additional Data Prep and Model Training

The role of a data scientist involves pulling data from various sources. We will use a SageMaker notebook to walk through additional data preparation and model training. Below are directions to access the notebook. Within the notebook you'll find another set of detailed directions.

:white_check_mark: **Step-by-step directions**

1. Navigate to [Amazon SageMaker](https://console.aws.amazon.com/sagemaker/home?region=us-east-1#/notebook-instances) in AWS Console
1. Open the notebook instance named `WildRydesNotebook-***`
1. Click the **Open Jupyter** link under Actions
1. When redirected to the notebook instance, click **New** then select **Terminal** from list. A new tab will open.
1. When in the terminal, type the following commands:
```
curl https://raw.githubusercontent.com/jmcwhirter/aws-serverless-workshops/master/MachineLearning/0_ExternalData/notebooks/linear_learner.ipynb -o SageMaker/linear_learner.ipynb
```
1. Exit the terminal tab/window
1. Open the **linear_learner.ipynb** notebook and follow the instructions.

At this point, you should have a trained model in S3. You may have set up the optional endpoint to test your work. Instead of using an endpoint with an always on server, let's explore using Lambda to make inferences against our model.

#### Make inferences against the model
At this point, we have a trained model on s3.  Now, we're ready to load the model into lambda at runtime and make inferences against the model.  The Lambda function that will make inferences is hosted behind an API Gateway that will accept POST HTTP requests.

First we need to update the Lambda function environment variable to reference our trained model on s3.  Then we can issue HTTP POST requests with a JSON body via our client of choice to see our model in action!

:white_check_mark: **Step-by-step directions**

1. Go back to CloudFormation, in the resources tab, find the `ModelBucket` and click on the link.  Drill into the the path that starts will `linear-learner-*` until you find `model.tar.gz`.  Select the checkmark next to this file, and select "Copy Path"
1. Go back to CloudFormation, in the resources tab, find the `ModelInferenceFunction` and click on the link.  Scroll down to the environment variables section and update the `MODEL_PATH` parameter with the value you copied from the previous step.  Delete the `s3://BUCKET_NAME/` from the pasted value so that only the key (folder + filename) remains.  Save the changes.
1. Go back to CloudFormation, in the outputs tab, copy the curl command for making inferences against your function hosting your model.
1. _Optional_: You can also test the lambda function by putting using the test API UI in the API Gateway console.


## Clean up

Remove the data from your raw and transformed buckets. Once this is complete, you can delete the stack via CLI or console.

<details>
<summary><strong>:white_check_mark: Step-by-step directions (expand for details)</strong></summary><p>

Manually:

*TODO*

CLI:
1. Delete data in your raw bucket
  ```
  aws cloudformation describe-stacks \
    --stack-name wildrydes-machine-learning-module-0 \
    --query "Stacks[0].Outputs[?OutputKey=='RawDataBucketName'].OutputValue" \
    --output text | xargs -I {} \
        aws s3 rm s3://{} --recursive
  ```
2. Delete data in your transformed bucket
  ```
  aws cloudformation describe-stacks \
    --stack-name wildrydes-machine-learning-module-0 \
    --query "Stacks[0].Outputs[?OutputKey=='TransformedDataBucketName'].OutputValue" \
    --output text | xargs -I {} \
        aws s3 rm s3://{} --recursive
  ```
3. Delete data in your model bucket
  ```
  aws cloudformation describe-stacks \
    --stack-name wildrydes-machine-learning-module-0 \
    --query "Stacks[0].Outputs[?OutputKey=='ModelBucketName'].OutputValue" \
    --output text | xargs -I {} \
        aws s3 rm s3://{} --recursive
  ```
4. Delete the stack
  ```
  aws cloudformation delete-stack \
    --stack-name wildrydes-machine-learning-module-0
  ```
</p></details>
