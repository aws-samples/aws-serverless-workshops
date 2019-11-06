# Create data processing pipeline

**Time to complete:** 45-60 minutes.

## What are we building?
![Architecture diagram](assets/WildRydesML_1.png)
TODO - Add 1,2,3 annotations

We'll be building a pipeline that consists of:

1. A lambda function to take ride telemtry data from S3, and fan-out to multiple invocations of downstream lambda functions (annotated item #1)
2. An SQS queue to trigger the downstream consumers from the fan-out lambda function (annotated item #2)
3. A lambda function consumer (annotated item #3) that will take items from the queue, look up the relevant weatherstation ID (based on lat/long proximity), and write the data record(s) out to a new location in S3

## Why are we building it?
If you recall, we're trying to build a system to make better unicorn magic point usage predictions so we can accurately price our service.  To do that, we need to get our data in order.  We need a pipeline that will take our unicorn ride data, join it with the relevant weather station data, and output to a location that can be used downstream by our data scientist from within the Sagemaker notebook.  This is the beginning stages of building our training datasets.

**Refer to the troubleshooting section at the end of this README if you experience issues along the way**

### Step 0: Create an S3 Bucket
This is where your data will live before, during, and after formatting. It's also where your machine learning model will output to.

<details>
<summary><strong>Create an S3 bucket with a globally unique name, (it will be referred to later as `YOUR_BUCKET_NAME`)</strong></summary><p>
In your Cloud9 terminal, run the following code:

```
# Command should be ran from /home/ec2-user/environment/aws-serverless-workshops/MachineLearning/1_DataProcessing in your cloud 9 environment
# run `pwd` to see your current directory 

aws s3 mb s3://YOUR_BUCKET_NAME --region YOUR_REGION >> scratchpad.txt
```
</p></details>

### Step 1: Create an SQS queue for fan-out
Our vehicle fleet generates ride data in a single, massive .json file, [ride_data.json](assets/ride_data.json). Feel free to check it out.  It includes the raw ride telemtry.  We need to split out the file into individual JSON entries, 1 for each ride data event entry.

To take advantage of the parallelism available with Lambda, we are going to fan-out each entry to a queue that will be picked up by individual Lambda functions.

<details>
<summary><strong>Create an SQS queue and name it `IngestedRawDataFanOutQueue`</strong></summary><p>
In your Cloud9 terminal, run the following code:

```
# Command should be ran from /home/ec2-user/environment/aws-serverless-workshops/MachineLearning/1_DataProcessing in your cloud 9 environment
# run `pwd` to see your current directory 

aws sqs create-queue --queue-name IngestedRawDataFanOutQueue --region us-east-1 >> scratchpad.txt

# scratchpad.txt now has the queue URL, you'll need it for the next command to grab the ARN.

aws sqs get-queue-attributes --queue-url "YOUR_QUEUE_URL/IngestedRawDataFanOutQueue" --attribute-names QueueArn >> scratchpad.txt
```
</p></details>

Save the queue URL and ARN to a `scratchpad.txt` file we'll use later.


### Step 2: Create the lambda functions

<details>
<summary><strong>Create a CloudFormation stack from `cloudformation/3_lambda_functions.yml` named `wildrydes-ml-mod1-3`.</strong></summary><p>
In your Cloud9 terminal, run the following code:

```
# Command should be ran from /home/ec2-user/environment/aws-serverless-workshops/MachineLearning/1_DataProcessing in your cloud 9 environment
# run `pwd` to see your current directory 

TODO - double check this syntax
Run some code in the terminal to >> a scratchpad.txt with the appropriate parameters you'll need for this template (also include DataProcessingRole Arn)

aws cloudformation create-stack \
    --stack-name wildrydes-ml-mod1-3 \
    --parameters ParameterKey=DataBucket,ParameterValue=YOUR_BUCKET_NAME \
    ParameterKey=IngestedRawDataFanOutQueueArn,ParameterValue=YOUR_QUEUE_ARN \
    --region YOUR_REGION \
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://cloudformation/3_lambda_functions.yml
```
</p></details>

This gives you:
* lambda function skeletons
* DLQs
* IAM permissions

While these are necessary, they're not the focus of this part of the lab.  This is why we're creating them in a CloudFormation template for you.  

### Step 3: Wire up the lambda functions
The previous step gave you the foundation for the lambda functions that will either be triggered by S3 events or SQS queues.  Now, you need to wire up the lambda function with to appropriate event sources and set the appropriate environment variables.

<details>
<summary><strong>1. Add a lambda trigger to IngestUnicornRawDataFunction for your for your S3 bucket `raw/` prefix</strong></summary><p>

1. Open the lambda console to your lambda function named `IngestUnicornRawDataFunction`
1. In the Designer view, click **Add trigger**
1. Select **S3**
1. Choose the data bucket you created
1. For the prefix, type `raw/`
1. Click **Add**
1. Click **Save**
</p></details>

<details>
<summary><strong>2. Update OUTPUT_QUEUE environment variable for IngestUnicornRawDataFunction to your queue URL</strong></summary><p>

1. Open the lambda console to your lambda function named `IngestUnicornRawDataFunction`
1. Create an environment variable with:
    * Key == "OUTPUT_QUEUE"
    * Value == `https://sqs.<your-region>.amazonaws.com/<your_account_number>/IngestedRawDataFanOutQueue`
2. Click save
</p></details>

<details>
<summary><strong>3. Add a lambda trigger to TransformAndMapDataFunction for your for your S3 bucket `raw/` prefix</strong></summary><p>

1. Open the lambda console to your lambda function named `TransformAndMapDataFunction`
1. In the Designer view, click **Add trigger**
1. Select **SQS**
1. Choose the `IngestedRawDataFanOutQueue` queue you created
1. Click **Add**
1. Click **Save**
</p></details>

<details>
<summary><strong>4. Update OUTPUT_BUCKET environment variable for TransformAndMapDataFunction to your queue URL</strong></summary><p>

1. Open the lambda console to your lambda function named `TransformAndMapDataFunction`
1. Create an environment variable with:
    * Key == "OUTPUT_BUCKET"
    * Value == `YOUR_DATA_BUCKET` (*The name of the data bucket you created earlier*)
2. Click save
</p></details>

To recap:
* Now we have 2 lambda functions, split by a queue that:
  1. Reads from S3
  2. Fans-out per entry in S3 file
  3. Second lambda function picks up items on queue and matches the nearest weather station
* Preconfigured IAM role for the lambda functions scoped to the appropriate services
* Review the code for `TransformAndMapDataFunction`, the function is doing a lookup for the nearest weatherstation
* We also have a CloudWatch dashboard to monitor progress!

### Step 4: Test your pipeline
It's time to upload our ride telemtry data into our pipeline.

<details>
<summary><strong>Upload <code>assets/ride_data.json</code> into <code>YOUR_DATA_BUCKET/raw/</code></strong></summary><p>

In your Cloud9 terminal, run the following code:

```
TODO get this command
aws s3 upload ride_data.json
```
</p></details>

Your fan-out is in progress!  Checkout [your CloudWatch dashboard](link) to monitor progress (or view your [SQS console](link)).  It will take ~8 minutes to process all 200k entries. 

### Step 5: Cleanup (to be completed after all sections are done)
1. Empty `YOUR_BUCKET_NAME`
2. Delete `YOUR_BUCKET_NAME`
3. Delete `IngestedRawDataFanOutQueue`
4. Delete CloudFormation Stack `wildrydes-ml-mod1-3`

## Troubleshooting
Run the following commands in your Cloud9 environment terminal to assist in troubleshooting:
```
python assets/helper.py
```
The output will be similar to the following:
```
[x] S3 bucket exists (Step 0)
[x] SQS queue exists (Step 1)
[x] Lambda functions, and CloudFormation Stack wildrydes-ml-mod1-3 exists (Step 2)
[ ] Lambda trigger for IngestUnicornRawDataFunction (Step 3)
[x] OUTPUT_QUEUE for IngestUnicornRawDataFunction (Step 3)
[x] Lambda trigger for TransformAndMapDataFunction (Step 3)
[ ] OUTPUT_BUCKET for TransformAndMapDataFunction (Step 3)
[ ] processed/ directory exists with _some_ data (Step 4)
```


### For reference
<details>
<summary><strong>:see_no_evil: Do it For Me (use in case of emergency)</strong></summary><p>

1. Navigate to your Cloud9 environment
2. Run the following commands to create your resources:
    ```
    cd ~/environment/aws-serverless-workshops/MachineLearning/0_ExternalData
    aws cloudformation create-stack \
    --stack-name wildrydes-ml-mod1-99 \
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://cloudformation/99_complete.yml
    ```
3. Run the following command until you get `CREATE_COMPLETE` in the output:
    ```
    aws cloudformation describe-stacks \
    --stack-name wildrydes-ml-mod1-99 \
    --query 'Stacks[0].StackStatus' \
    --output text
    ```

<h3>Cleanup</h3>
1. Delete `wildrydes-ml-mod1-99`
</p></details>