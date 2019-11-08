# Create data processing pipeline

**Time to complete:** 45-60 minutes.

## What are we building?
![Architecture diagram](assets/WildRydesML_1.png)

We'll be building a pipeline that consists of:

1. A Lambda function to take ride telemetry data from S3, and fan-out to multiple invocations of downstream Lambda functions (annotated item #1)
1. An SQS queue to trigger the downstream consumers from the fan-out Lambda function (annotated item #2)
1. A Lambda function consumer (annotated item #3) that will take items from the queue, look up the relevant weather station ID (based on lat/long proximity), and write the data record(s) out to a new location in S3

## Why are we building it?
If you recall, we're trying to build a system to make better unicorn magic point usage predictions so we can accurately price our service.  To do that, we need to get our data in order.  We need a pipeline that will take our unicorn ride data, join it with the relevant weather station data, and output to a location that can be used downstream by our data scientist from within the SageMaker notebook.  This is the beginning stages of building our training datasets.

**Refer to the troubleshooting section at the end of this README if you experience issues along the way**

### Step 0: Create an S3 Bucket
This is where your data will live before, during, and after formatting. It's also where your machine learning model will output to.

<details>
<summary><strong>Create an S3 bucket with a globally unique name, (it will be referred to later as `YOUR_BUCKET_NAME`)</strong></summary><p>
In your Cloud9 terminal, run the following code:

```
# Command should be ran from /home/ec2-user/environment/aws-serverless-workshops/MachineLearning/1_DataProcessing in your cloud 9 environment
# run `pwd` to see your current directory
# Run this command to navigate to the correct folder
cd /home/ec2-user/environment/aws-serverless-workshops/MachineLearning/1_DataProcessing

# Run this command to create your bucket
aws s3 mb s3://YOUR_BUCKET_NAME >> scratchpad.txt

# Run this command to verify your bucket was created successfully
aws s3 ls s3://YOUR_BUCKET_NAME

# If you don't see an error you're good.
```
</p></details>

### Step 1: Create an SQS queue for fan-out
Our vehicle fleet generates ride data in a single, massive .json file, [ride_data.json](assets/ride_data.json). Feel free to check it out.  It includes the raw ride telemetry.  We need to split out the file into individual JSON entries, 1 for each ride data event entry.

To take advantage of the parallelism available with Lambda, we are going to fan-out each entry to a queue that will be picked up by individual Lambda functions.

<details>
<summary><strong>Create an SQS queue and name it `IngestedRawDataFanOutQueue`</strong></summary><p>
In your Cloud9 terminal, run the following code:

```
# Command should be ran from /home/ec2-user/environment/aws-serverless-workshops/MachineLearning/1_DataProcessing in your cloud 9 environment
# run `pwd` to see your current directory

aws sqs create-queue --queue-name IngestedRawDataFanOutQueue >> scratchpad.txt

# scratchpad.txt now has the queue URL, you'll need it for the next command to grab the ARN. Keep the quotes and replace YOUR_QUEUE_URL with the value in scratchpad.txt.

aws sqs get-queue-attributes --queue-url "YOUR_QUEUE_URL" --attribute-names QueueArn >> scratchpad.txt
```
</p></details>

Save the queue URL and ARN to a `scratchpad.txt` file we'll use later.


### Step 2: Create the Lambda functions

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
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://cloudformation/3_lambda_functions.yml
```

There are a couple options to track the CloudFormation stack creation process:
1. In your Cloud9 terminal, run the following code:
    ```
    # Run this command to verify the stack was successfully created. You should expect to see "CREATE_COMPLETE".
    # If you see "CREATE_IN_PROGRESS", your stack is still being created. Wait and re-run the command.
    # If you see "ROLLBACK_COMPLETE", pause and see what went wrong.
    aws cloudformation describe-stacks \
        --stack-name wildrydes-ml-mod1-3 \
        --query "Stacks[0].StackStatus"
    ```
1. Go to [CloudFormation in the AWS Console](https://console.aws.amazon.com/cloudformation)
</p></details>

This gives you:
* Lambda function skeletons
* Dead Letter Queues (DLQ)
* IAM permissions
* CloudWatch dashboard

While these are necessary, they're not the focus of this part of the lab.  This is why we're creating them in a CloudFormation template for you.  

### Step 3: Wire up the Lambda functions
The previous step gave you the foundation for the Lambda functions that will either be triggered by S3 events or SQS queues.  Now, you need to wire up the Lambda function to appropriate event sources and set the appropriate environment variables. We're going to use values from scratchpad.txt, so have that handy.

<details>
<summary><strong>1. Update OUTPUT_QUEUE environment variable for IngestUnicornRawDataFunction to your queue URL (in scratchpad.txt)</strong></summary><p>

1. Open the [Lambda console](https://console.aws.amazon.com/lambda)
1. Open the function containing `IngestUnicornRawDataFunction` in the name
1. Scroll down and create an environment variable with:
    * Key == "OUTPUT_QUEUE"
    * Value == `YOUR_QUEUE_URL`
1. Click **Save**
</p></details>

<details>
<summary><strong>2. Add a Lambda trigger to IngestUnicornRawDataFunction for your for your S3 bucket `raw/` prefix</strong></summary><p>

1. Scroll up and click **Add trigger** in the Designer view
1. Select **S3**
1. Choose the data bucket you created
1. For the prefix, type `raw/`
1. Click **Add**

If the trigger won't save, make sure the S3 bucket does not have an identical active event ([Bucket](https://console.aws.amazon.com/s3) > Properties > Events).
</p></details>

<details>
<summary><strong>3. Update OUTPUT_BUCKET environment variable for TransformAndMapDataFunction to your queue URL</strong></summary><p>

1. Open the [Lambda console](https://console.aws.amazon.com/lambda)
1. Open the function containing  `TransformAndMapDataFunction` in the name
1. Scroll down and create an environment variable with:
    * Key == "OUTPUT_BUCKET"
    * Value == `YOUR_DATA_BUCKET` (*The name of the data bucket you created earlier*)
1. Click **Save**
</p></details>

<details>
<summary><strong>4. Add a Lambda trigger to TransformAndMapDataFunction for your for your S3 bucket `raw/` prefix</strong></summary><p>

1. Scroll up and click **Add trigger** in the Designer view
1. Select **SQS**
1. Choose the `IngestedRawDataFanOutQueue` queue you created
1. Click **Add**
</p></details>

To recap:
* Now we have:
  1. A Lambda function that reads a large JSON file from S3 and places a message in a queue for each ride
  1. A queue able to buffer messages for each ride
  1. A Lambda function that picks up messages in the queue and matches the nearest weather station
* Preconfigured IAM role for the Lambda functions scoped to the appropriate services
* Review the code for `TransformAndMapDataFunction`, the function is doing a lookup for the nearest weather station
* We also have a [CloudWatch dashboard](https://console.aws.amazon.com/cloudwatch/home?#dashboards:name=Wild_Rydes_Machine_Learning) to monitor progress!

### Step 4: Test your pipeline
It's time to upload our ride telemetry data into our pipeline.

<details>
<summary><strong>Upload <code>assets/ride_data.json</code> into <code>YOUR_DATA_BUCKET/raw/</code></strong></summary><p>

In your Cloud9 terminal, run the following code:

```
# Run this command to upload the ride data
aws s3 cp assets/ride_data.json s3://YOUR_BUCKET_NAME/raw/ride_data.json

# Run this command to verify the file was uploaded (you should see the file name listed)
aws s3 ls s3://YOUR_BUCKET_NAME/raw/
```
</p></details>

Your fan-out is in progress!  Checkout the [CloudWatch dashboard](https://console.aws.amazon.com/cloudwatch/home?#dashboards:name=Wild_Rydes_Machine_Learning) to monitor progress (or view your [SQS console](https://console.aws.amazon.com/sqs)).  It will take ~8 minutes to process all 200k entries.

### Troubleshooting
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
1. Run the following commands to create your resources:
    ```
    cd ~/environment/aws-serverless-workshops/MachineLearning/0_ExternalData
    aws cloudformation create-stack \
    --stack-name wildrydes-ml-mod1-99 \
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://cloudformation/99_complete.yml
    ```
1. Run the following command until you get `CREATE_COMPLETE` in the output:
    ```
    aws cloudformation describe-stacks \
    --stack-name wildrydes-ml-mod1-99 \
    --query 'Stacks[0].StackStatus' \
    --output text
    ```

<h3>Cleanup</h3>
1. Delete `wildrydes-ml-mod1-99`
</p></details>

## Next steps:

We're ready to proceed with building and training a [machine learning model](../2_ModelBuilding).
