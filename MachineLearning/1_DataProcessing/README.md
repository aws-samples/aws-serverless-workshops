# Create data processing pipeline

**Time to complete:** 30-45 minutes.

## What are we building?
![Architecture diagram](assets/WildRydesML_1.png)

We'll be building a pipeline that consists of:

1. A Lambda function to take ride telemetry data from S3, and fan-out to multiple invocations of downstream Lambda functions (annotated item #1)
1. An SQS queue to trigger the downstream consumers from the fan-out Lambda function (annotated item #2)
1. A Lambda function consumer (annotated item #3) that will take items from the queue, look up the relevant weather station ID (based on lat/long proximity), and write the data record(s) out to a new location in S3

## Why are we building it?
If you recall, we're trying to build a system to make better unicorn magic point usage predictions so we can accurately price our service.  To do that, we need to get our data in order.  We need a pipeline that will take our unicorn ride data, join it with the relevant weather station data, and output to a location that can be used downstream by our data scientist from within the SageMaker notebook.  This is the beginning stages of building our training datasets.

### Short cut: Deploy everything for me

We don't recommend this route unless you ran into a snag and are worried about completing the workshop on time.

<details>
<summary><strong>:see_no_evil: BREAK GLASS! (use in case of emergency)</strong></summary><p>

1. Navigate to your Cloud9 environment
1. Make sure you're in the correct directory first
    ```
    cd ~/environment/aws-serverless-workshops/MachineLearning/1_DataProcessing
    ```
1. Run the following command to create your resources:
    ```
    aws cloudformation create-stack \
    --stack-name wildrydes-ml-mod1-1 \
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://cloudformation/99_complete.yml
    ```
1. Run the following command until you get `CREATE_COMPLETE` in the output:
    ```
    aws cloudformation describe-stacks \
    --stack-name wildrydes-ml-mod1-1 \
    --query 'Stacks[0].StackStatus' \
    --output text
    ```
1. In your Cloud9 terminal, run the following code:

    ```
    # Run this command to upload the ride data
    aws s3 cp assets/ride_data.json s3://YOUR_BUCKET_NAME/raw/ride_data.json

    # Run this command to verify the file was uploaded (you should see the file name listed)
    aws s3 ls s3://YOUR_BUCKET_NAME/raw/
    ```
</p></details>

### Step 1: Create an S3 Bucket
This is where your data will live before, during, and after formatting. It's also where your machine learning model will output to.

<details>
<summary><strong>Create an S3 bucket with a globally unique name, (it will be referred to later as `YOUR_BUCKET_NAME`)</strong></summary><p>

1. In your Cloud9 terminal, run the following code:
    ```
    # Run this command to create your bucket
    aws s3 mb s3://YOUR_BUCKET_NAME >> ~/environment/scratchpad.txt

    # Run this command to verify your bucket was created successfully
    aws s3 ls s3://YOUR_BUCKET_NAME

    # If you don't see an error you're good.
    ```
</p></details>

### Step 2: Create an SQS queue for fan-out
Our vehicle fleet generates ride data in a single, massive .json file, [ride_data.json](assets/ride_data.json). Feel free to check it out.  It includes the raw ride telemetry.  We need to split out the file into individual JSON entries, one for each ride data event entry.

To take advantage of the parallelism available with Lambda, we are going to fan-out each entry to a queue that will be picked up by individual Lambda functions.

<details>
<summary><strong>Create an SQS queue and name it `IngestedRawDataFanOutQueue`</strong></summary><p>

1. Navigate to your Cloud9 environment
1. Make sure you're in the correct directory first
    ```
    cd ~/environment/aws-serverless-workshops/MachineLearning/1_DataProcessing
    ```
1. Run the following command to create your resources:
    ```
    aws sqs create-queue --queue-name IngestedRawDataFanOutQueue >> ~/environment/scratchpad.txt
    ```
1. `scratchpad.txt` now has the queue URL, you'll need it for the next command to grab the ARN
1. In the Cloud9 file explorer, navigate to **WildRydesIDE**
1. Double click `scratchpad.txt` to open the file
1. Keep the quotes and replace **YOUR_QUEUE_URL** with the **QueueUrl** value in `scratchpad.txt`
    ```
    aws sqs get-queue-attributes --queue-url "YOUR_QUEUE_URL" --attribute-names QueueArn >> ~/environment/scratchpad.txt
    ```
</p></details>

Save the queue URL and ARN to a `scratchpad.txt` file we'll use later.


### Step 3: Create the Lambda functions

<details>
<summary><strong>Create a CloudFormation stack from `cloudformation/1_lambda_functions.yml` named `wildrydes-ml-mod1-1`.</strong></summary><p>

*NOTE:* you need to replace **YOUR_BUCKET_NAME** and **YOUR_QUEUE_ARN**
1. In your Cloud9 terminal, run the following code:
    ```
    # Command should be ran from /home/ec2-user/environment/aws-serverless-workshops/MachineLearning/1_DataProcessing in your cloud 9 environment
    # run `pwd` to see your current directory

    aws cloudformation create-stack \
        --stack-name wildrydes-ml-mod1-1 \
        --parameters ParameterKey=DataBucket,ParameterValue=YOUR_BUCKET_NAME \
        ParameterKey=IngestedRawDataFanOutQueueArn,ParameterValue=YOUR_QUEUE_ARN \
        --capabilities CAPABILITY_NAMED_IAM \
        --template-body file://cloudformation/1_lambda_functions.yml
    ```

There are a couple options to track the CloudFormation stack creation process:
1. In your Cloud9 terminal, run the following code:
    ```
    # Run this command to verify the stack was successfully created. You should expect to see "CREATE_COMPLETE".
    # If you see "CREATE_IN_PROGRESS", your stack is still being created. Wait and re-run the command.
    # If you see "ROLLBACK_COMPLETE", pause and see what went wrong.
    aws cloudformation describe-stacks \
        --stack-name wildrydes-ml-mod1-1 \
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

**:heavy_exclamation_mark: DO NOT move past this point until you see CREATE_COMPLETE as the status for your CloudFormation stack**

### Step 4: Wire up the Lambda functions
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
<summary><strong>4. Add an SQS trigger to TransformAndMapDataFunction for your IngestedRawDataFanOutQueue queue</strong></summary><p>

1. Scroll up and click **Add trigger** in the Designer view
2. Select **SQS**
3. Choose the `IngestedRawDataFanOutQueue` queue you created
4. Click **Add**
</p></details>

To recap:
* Now we have:
  1. A Lambda function that reads a large JSON file from S3 and places a message in a queue for each ride
  1. A queue able to buffer messages for each ride
  1. A Lambda function that picks up messages in the queue and matches the nearest weather station
* Preconfigured IAM role for the Lambda functions scoped to the appropriate services
* Review the code for `TransformAndMapDataFunction`, the function is doing a lookup for the nearest weather station
* We also have a [CloudWatch dashboard](https://console.aws.amazon.com/cloudwatch/home?#dashboards:name=Wild_Rydes_Machine_Learning) to monitor progress!

### Step 5: Test your pipeline
It's time to upload our ride telemetry data into our pipeline.

<details>
<summary><strong>Upload <code>assets/ride_data.json</code> into <code>YOUR_DATA_BUCKET/raw/</code></strong></summary><p>

1. In your Cloud9 terminal, run the following code:
    ```
    # Run this command to upload the ride data
    aws s3 cp assets/ride_data.json s3://YOUR_BUCKET_NAME/raw/ride_data.json

    # Run this command to verify the file was uploaded (you should see the file name listed)
    aws s3 ls s3://YOUR_BUCKET_NAME/raw/
    ```
</p></details>

**Your fan-out is in progress!**

It will take ~8 minutes to process all ~20k entries. Monitor the progress using:
* [CloudWatch dashboard](https://console.aws.amazon.com/cloudwatch/home?#dashboards:name=Wild_Rydes_Machine_Learning)
  * This shows you the number of invocations for each Lambda function on the left and some SQS message metrics on the right.
* [SQS console](https://console.aws.amazon.com/sqs)
  * This shows the number of messages flowing through `IngestedRawDataFanOutQueue`. There are also dead letter queues set up in case things go wrong.
* Run `aws s3 ls s3://YOUR_BUCKET_NAME/processed/ | wc -l` in your Cloud9 terminal
  * This provides a count of the number of entries in your processed folder as the pipeline progresses.
  * When complete you should have 19,995 records.

## Next step:

We're ready to proceed with building and training a [machine learning model](../2_ModelBuilding).
