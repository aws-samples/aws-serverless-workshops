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
    aws cloudformation create-stack \
    --stack-name wildrydes-ml-mod0-4 \
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://cloudformation/4_inference.yml
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
    --stack-name wildrydes-ml-mod1-3 \
    --logical-resource-id DataProcessingExecutionRole \
    --query "StackResources[0].PhysicalResourceId" >> scratchpad.txt
    ```

</p></details>

### Step 2: Create Lambda function and API Gateway skeletons
At this point, we have a trained model on s3.  Now, we're ready to load the model into Lambda at runtime and make inferences against the model.  The Lambda function that will make inferences is hosted behind an API Gateway that will accept POST HTTP requests.

<details>
<summary><strong>Create Lambda function for Model Inferences named <code>ModelInferenceFunction</code> and an HTTP API by launching <code>cloudformation/4_Lambda_function.yml</code> Stack and naming it <code>wildrydes-ml-mod3-4</code></strong></summary><p>

1. Navigate to your Cloud9 environment
1. Make sure you're in the correct terminal directory first
    ```
    cd /home/ec2-user/environment/aws-serverless-workshops/MachineLearning/3_Inference
    ```
1. Run the following command:
    ```
    aws cloudformation create-stack \
    --stack-name wildrydes-ml-mod3-4 \
    --parameters ParameterKey=DataBucket,ParameterValue=YOUR_BUCKET_NAME \
    ParameterKey=DataProcessingExecutionRoleName,ParameterValue=DATA_PROCESSING_ROLE_NAME_FROM_SCRATCHPAD.TXT \
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://cloudformation/4_Lambda_function.yml
    ```
</p></details>

### Step 3: Update Lambda Function
The previous step gave us a Lambda function that will load the ML model from S3, make inferences against it in Lambda, and return the results from behind API Gateway.  For this to work, we need to connect some critical pieces.

<details>
<summary><strong>Update the <code>ModelInferenceFunction</code> environment variable MODEL_PATH to the correct value from YOUR_DATA_BUCKET</strong></summary><p>

1. Open the Lambda console to your Lambda function named `ModelInferenceFunction`
1. Create an environment variable with:
    * Key == "MODEL_PATH"
    * Value == *your path from YOUR_DATA_BUCKET, it will be in the format of linear-learner-yyyy-mm-dd-00-40-46-627/output/model.tar.gz*
1. Click save

</p></details>

Take a moment to review the code in (Lambda-functions/Lambda_function.py)[Lambda-functions/Lambda_function.py].

### Step 4: Wire up API Gateway
The last thing we need to connect is the HTTP API Gateway to your `ModelInferenceFunction`

<details>
<summary><strong>Update the <code>ModelInferenceApi</code> API Gateway root resource to proxy requests to your <code>ModelInferenceFunction</code></strong></summary><p>

1. Open the [API Gateway console](https://console.aws.amazon.com/apigateway/home)
1. Select the root `/` resource
1. Select **Actions** > **Create Method**
1. Select `ANY` in the dropdown, click the checkbox next to it
1. Select your `ModelInferenceFunction` in the **Lambda Function** dropdown.
1. Click **Save**
1. Click **OK** to the permissions dialogue box
</p></details>

<details>
<summary><strong>Deploy your API Gateway</strong></summary><p>

1. Open the [API Gateway console](https://console.aws.amazon.com/apigateway/home)
1. Under **Actions** select **Deploy API**
1. Select `[New Stage]` for ** **Deployment Stage**
1. Enter `prod` for **Stage name**
1. Click **Deploy**
</p></details>

Take note of your **Invoke URL**

### Step 5: Test your API
1. Copy the stage url, and invoke a `POST` request against your new HTTP endpoint to make an inference! _Example:_ `curl -d '{ "distance": 30, "healthpoints": 30, "magicpoints": 2500, "TMAX": 333, "TMIN": 300, "PRCP": 0 }' -H "Content-Type: application/json" -X POST STAGE_URL`

### Now What?
Let's recap - you've put together a pipeline, that:
* On the front end, ingests ride telemetry data from our unicorns
* enhances the data with the nearest weather station ID
* train a machine learning model to predict heavier than usual magic point usage
* created an HTTP interface to make predictions against?

#### How can Wild Rydes use this to improve the business?
With the ability to now, get real-time information of whether or not a ride is going to "cost" more to the unicorn based on mileage _plus_ weather (instead of just mileage), our pricing workflow can be updated to include this http endpoint.  Enabling our company to give better, more realistic pricing based on actual usage.

#### What does this mean to Wild Rydes customers?
Not to be forgotten, how can this improve the end users' experience?  Well, in true customer obsession, if we're _under_ pricing during inclement weather, isn't it reasonable to question if we're _over_ charging the customer in ideal conditions?  Or maybe, without the losses in inclement conditions, we can pass the savings back on to the customers in ideal conditions? With this architecture in place, we can iterate on it over time to improve accuracy of models and ultimately test this hypothesis.

## Next step:
Once you're done testing the API call to your model, you can [clean up the resources](../4_Cleanup) so you're not charged.

<!-- #### OLD

**Figure It Out :metal:**

Our model has been trained and is stored on S3.  Now we need a serverless environment to do inferences within.  Remember that the model was trained in an algorithm based on Apache MXNet.  To make inferences against the model in Lambda, we'll need a version of MXNet built for the [current Lambda runtime](https://docs.aws.amazon.com/Lambda/latest/dg/Lambda-runtimes.html).

1. _Expert Optional step requiring extra time (skip to step 3):_ Follow the [instructions](building-mxnet-1.2.1.md) to build MXNet from source
1. _Expert Optional step requiring extra time (skip to step 3):_ Use the code from [Lambda_function.py](Lambda-functions/inference/Lambda_function.py) as the `index.py`, and prepare a python Lambda function with the additional dependencies (using [these](https://docs.aws.amazon.com/Lambda/latest/dg/Lambda-python-how-to-create-deployment-package.html#python-package-dependencies) instructions as a guide).  You can use `pip install` to get the remaining dependencies install based on their imports in `index.py`.
1. The previous 2 steps have already been completed for you as MXNet can take 20-30 minutes to build from source depending on the compute resources you're using.  You can find the finished artifacts in this [code zip archive](assets/inferencefunction.zip).
1. Create a new python 2.7 Lambda function based on this zip file.
1. Update the `MODEL_PATH` environment variable in your Lambda function configuration to your model s3 location from the training job in the previous section.  Do not include the `s3://BUCKET_NAME/` prefix.
1. Create a new API Gateway with a method that proxies request to your Lambda function
1. Deploy your API gateway and issue HTTP requests against it to make inferences!

<details>
<summary><strong>Hold My Hand :white_check_mark: (expand for details)</strong></summary><p>

1. Create a new python 2.7 Lambda function with the provided ![code zip archive](assets/inferencefunction.zip)
1. Update the `MODEL_PATH` environment variable in your Lambda function configuration to your model s3 location from the training job in the previous section.  Do not include the `s3://BUCKET_NAME/` prefix.
1. Create a new API Gateway with a single root `POST` method action that proxies requests to the function you created in step 1. Accept any dialogues requesting to add invoke permissions from API Gateway to your Lambda function.
1. Deploy the API Gateway via a stage called `prod`.
1. Copy the stage url, and invoke a `POST` request against your new HTTP endpoint to make an inference! _Example:_ `curl -d '{ "distance": 30, "healthpoints": 30, "magicpoints": 2500, "TMAX": 333, "TMIN": 300, "PRCP": 0 }' -H "Content-Type: application/json" -X POST STAGE_URL/prod`

</p></details> -->
