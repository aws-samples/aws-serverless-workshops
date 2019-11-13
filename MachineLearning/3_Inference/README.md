# Make inferences against the model

**Time to complete:** 15-20 minutes.

## What are we building?
![Architecture diagram](assets/WildRydesML_4.png)

Now that are model is trained, we need a way to make inferences against it.  In this section we'll be building an HTTP rest endpoint (API Gateway) where we can POST JSON data against our model sitting on S3.  A Lambda function will load the model, and make an inference directly against the model and return it in the HTTP response.

We will be doing model inferences *outside* of SageMaker.

## Why are we building it?
With the ability to now, get real-time information of whether or not a ride is going to "cost" more to the unicorn based on mileage _plus_ weather (instead of just mileage), our pricing workflow can be updated to include this http endpoint.  Enabling our company to give better, more realistic pricing based on actual usage.

Why Lambda?  Our unicorn fleet isn't a single breed.  We offer the largest selection of rare unicorn breeds for customers of all needs.  We expect that after further research, each breed is actually responding differently to various weather conditions.  By hosting our models on S3 and using Lambda to make inferences, we can have a dynamic HTTP interface to make predictions against a ML model specific to a unicorn breed without having to pay for separate SageMaker endpoints (1 per unicorn breed - we have thousands).

### Short cut: Deploy everything for me

We don't recommend this route unless you ran into a snag and are worried about completing the workshop on time.

<details>
<summary><strong>:see_no_evil: BREAK GLASS! (use in case of emergency)</strong></summary><p>

1. Navigate to your Cloud9 environment
1. Run the following command:
    ```
    cd /home/ec2-user/environment/aws-serverless-workshops/MachineLearning/3_Inference
    aws cloudformation create-stack \
    --stack-name wildrydes-ml-mod3-4 \
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://cloudformation/99_complete.yml
    ```
1. Go back to CloudFormation, in the resources tab, find the `DataBucket` and click on the link.  Drill into the the path that starts will `linear-learner-*` until you find `model.tar.gz`.  Select the checkmark next to this file, and select "Copy Path"
1. Go back to CloudFormation, in the resources tab, find the `ModelInferenceFunction` and click on the link.  Scroll down to the environment variables section and update the `MODEL_PATH` environment variable with the value you copied from the previous step.  Delete the `s3://BUCKET_NAME/` from the pasted value so that only the key (folder + filename) remains.  Save the changes.
1. Go back to CloudFormation, in the outputs tab, copy the curl command for making inferences against your function hosting your model and execute.
1. _Optional_: You can also test the Lambda function by putting using the test API UI in the API Gateway console.

</p></details>

### Step 1: Get CloudFormation parameters
<details>
<summary><strong>Grab the name of your IAM DataProcessingExecutionRole and add it to scratchpad.txt for use later</strong></summary><p>

1. Navigate to your Cloud9 environment
1. Run the following command:
    ```
    aws cloudformation describe-stack-resources \
    --stack-name wildrydes-ml-mod1-1 \
    --logical-resource-id DataProcessingExecutionRole \
    --query "StackResources[0].PhysicalResourceId" >> ~/environment/scratchpad.txt
    ```

</p></details>

### Step 2: Create Lambda function and API Gateway skeletons
At this point, we have a trained model on S3.  Now, we're ready to load the model into Lambda at runtime and make inferences against the model.  The Lambda function that will make inferences is hosted behind an API Gateway that will accept POST HTTP requests.

<details>
<summary><strong>Create Lambda function for Model Inferences named <code>ModelInferenceFunction</code> and an HTTP API by launching <code>cloudformation/4_Lambda_function.yml</code> Stack and naming it <code>wildrydes-ml-mod3-4</code></strong></summary><p>

1. Navigate to your Cloud9 environment
1. Make sure you're in the correct terminal directory first
    ```
    cd /home/ec2-user/environment/aws-serverless-workshops/MachineLearning/3_Inference
    ```
1. Run the following command to create your resources:
    ```
    aws cloudformation create-stack \
    --stack-name wildrydes-ml-mod3-4 \
    --parameters ParameterKey=DataBucket,ParameterValue=YOUR_BUCKET_NAME \
    ParameterKey=DataProcessingExecutionRoleName,ParameterValue=DATA_PROCESSING_ROLE_NAME_FROM_SCRATCHPAD.TXT \
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://cloudformation/4_lambda_function.yml
    ```
1. Run the following command to check on the status of your CloudFormation stack:
    ```
    # Run this command to verify the stack was successfully created. You should expect to see "CREATE_COMPLETE".
    # If you see "CREATE_IN_PROGRESS", your stack is still being created. Wait and re-run the command.
    # If you see "ROLLBACK_COMPLETE", pause and see what went wrong.
    aws cloudformation describe-stacks \
        --stack-name wildrydes-ml-mod3-4 \
        --query "Stacks[0].StackStatus"
    ```
</p></details><br>

**DO NOT move past this point until you see CREATE_COMPLETE as the status for your CloudFormation stack**

### Step 3: Update Lambda Function
The previous step gave us a Lambda function that will load the ML model from S3, make inferences against it in Lambda, and return the results from behind API Gateway.  For this to work, we need to connect some critical pieces.

<details>
<summary><strong>Update the <code>ModelInferenceFunction</code> environment variable MODEL_PATH to the correct value from YOUR_DATA_BUCKET, and OUTPUT_BUCKET to YOUR_DATA_BUCKET</strong></summary><p>

1. Open the Lambda console to your Lambda function named `ModelInferenceFunction`
1. Create an environment variable with:
    * Key == "MODEL_PATH"
    * Value == *your path from YOUR_DATA_BUCKET, it will be in the format of linear-learner-yyyy-mm-dd-00-40-46-627/output/model.tar.gz*
1. Create an environment variable with:
    * Key == "OUTPUT_BUCKET"
    * Value == *YOUR_DATA_BUCKET*
1. Click save

</p></details>

<details>
<summary><strong>Take a moment to review the code in <code>lambda-functions/lambda_function.py</code>.</strong></summary><p>

*Note: If you're not interested in learning how to host your own ML model on Lambda, you can stop reading now and close this step and continue in the README.  There are no steps here to complete, only additional information on steps required to recreate this yourself.*

Amazon SageMaker can be used to build, train, and deploy machine learning models.  We're leveraging it to build and train our model.  Due to our business possibly having thousands of models, 1 per unicorn breed, its actually better for us to host this model ourselves on Lambda.  Below are the high level steps that we've completed on your behalf for this workshop, but you're free to explore if you need to recreate this.

1. Build MXNet from source for 1) the current support Lambda runtime and 2) the current MXNet version that SageMaker uses. [Instructions here](building-mxnet-1.2.1.md).
1. The code in [lambda-functions/lambda_function.py](lambda-functions/lambda_function.py) will load the model from S3, load mxnet, and make inferences against our model.  You'd need to install these dependencies locally in an environment similar to the runtime for Lambda and package those dependencies following [this instructions](https://docs.aws.amazon.com/Lambda/latest/dg/Lambda-python-how-to-create-deployment-package.html#python-package-dependencies).  If you unzip [lambda-functions/inferencefunction.zip](lambda-functions/inferencefunction.zip), you'll see the result of those steps as reference.
1. **`download_model` function**: Once we've got MXNet built for our environment, and the Lambda package built, we can proceed reviewing the code.  The Lambda function loads the model from S3 on the fly at the time of request and unzips it locally.
1. **`create_data_iter` function**: The HTTP request data is formated in a numpy array, required by the mxnet linear learner model interface to make inferences
1. **`make_prediction` function**: An inference is made and then packaged for an HTTP response to the caller.

</p></details>

### Step 4: Wire up API Gateway
The last thing we need to connect is the HTTP API Gateway to your `ModelInferenceFunction`

<details>
<summary><strong>Update the <code>ModelInferenceApi</code> API Gateway root resource to proxy requests to your <code>ModelInferenceFunction</code></strong></summary><p>

1. Open the [API Gateway console](https://console.aws.amazon.com/apigateway/home)
2. Select the root `/` resource
3. Select **Actions** > **Create Method**
4. Select `ANY` in the dropdown, click the checkbox next to it
5. Select your `ModelInferenceFunction` in the **Lambda Function** dropdown.
6. Click **Save**
7. Click **OK** to the permissions dialogue box
</p></details>

<details>
<summary><strong>Deploy your API Gateway</strong></summary><p>

1. Open the [API Gateway console](https://console.aws.amazon.com/apigateway/home)
1. Under **Actions** select **Deploy API**
2. Select `[New Stage]` for **Deployment Stage**
3. Enter `prod` for **Stage name**
4. Click **Deploy**
</p></details>

Take note of your **Invoke URL**

### Step 5: Test your API
1. Copy the stage url, and invoke a `POST` request against your new HTTP endpoint to make an inference! _Example:_
    ```
    curl -d '{ "distance": 30, "healthpoints": 30, "magicpoints": 2500, "TMAX": 333, "TMIN": 300, "PRCP": 0 }' -H "Content-Type: application/json" -X POST STAGE_URL
    ```

### Now What?
Let's recap - you've put together a pipeline, that:
* On the front end of the data pipeline, we collect and ingest ride telemetry data from our unicorns
* We've enhanced that data with the nearest, active weather station ID
* We've trained a machine learning model to predict heavier than usual magic point usage based on different weather characteristics for that day
* We've hosted this model behind an HTTP interface that loads the model dynamically

#### How can Wild Rydes use this to improve the business?
With the ability to now, get real-time information of whether or not a ride is going to "cost" more to the unicorn based on mileage _plus_ weather (instead of just mileage), our pricing workflow can be updated to include this http endpoint.  Enabling our company to give better, more realistic pricing based on actual usage.

#### What does this mean to Wild Rydes customers?
Not to be forgotten, how can this improve the end users' experience?  Well, in true customer obsession, if we're _under_ pricing during inclement weather, isn't it reasonable to question if we're _over_ charging the customer in ideal conditions?  Or maybe, without the losses in inclement conditions, we can pass the savings back on to the customers in ideal conditions? With this architecture in place, we can iterate on it over time to improve accuracy of models and ultimately test this hypothesis.

## Next step:
Once you're done testing the API call to your model, you can [clean up the resources](../4_Cleanup) so you're not charged.
