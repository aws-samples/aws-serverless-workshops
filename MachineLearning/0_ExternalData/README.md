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

The following provides an overview of the steps needed to complete this module. This section is intended to provide enough details to complete the module for students who are already familiar with the AWS console and CLI. If you'd like detailed, step-by-step instructions, please use the heading links to jump to the appropriate section.

#### Upload raw travel data
Use the console or CLI to upload travel data to the raw S3 bucket. Once you upload the raw travel data file, a process will be started involving three AWS Lambda functions and two Amazon Simple Queue Service (SQS) queues. You can use the [Amazon SQS console](https://console.aws.amazon.com/sqs/home?region=us-east-1#) to track how your Lambda functions are processing the data. With our record size of about ten thousand records, expect this to take about two minutes.

<details>
<summary><strong>:white_check_mark: Step-by-step directions (expand for details)</strong></summary><p>

Manually:

*TODO*

CLI:
```
aws cloudformation describe-stacks \
  --stack-name wildrydes-machine-learning-module-0 \
  --query "Stacks[0].Outputs[?OutputKey=='RawDataBucketName'].OutputValue" \
  --output text | xargs -I {} \
      aws s3 cp data/ride_data.json s3://{}
```
</p></details><br>

Sequence of events:

1. Upload ride_data.json into the `raw-bucket` generated from your CF template
1. S3 event triggers the Process Unicorn Data function
1. Process Unicorn Data function will read the file line by line and place the record on an SQS queue
1. Find Nearest Ground Station function reads from the SQS queue, finds the closest weather station, and applies a label indicating if the ride was a "heavy utilization" scenario
1. Find Nearest Ground Station function places the record on another SQS queue
1. Processed Data to S3 function puts the record back into s3 in the transformed bucket in CSV format

#### Weather Data Prep

The dataset we're using is [NOAA Global Historical Climatology Network Daily (GHCN-D)](https://registry.opendata.aws/noaa-ghcn/) ([dataset readme](https://docs.opendata.aws/noaa-ghcn-pds/readme.html)).  There are roughly one billion records in this public data set. We should pair that down. Since our unicorns operate within the New York City area, we're only interested in those ground stations:

```
US1NYNY0074  40.7969  -73.9330    6.1 NY NEW YORK 8.8 N                              
USC00305798  40.6000  -73.9667    6.1 NY NEW YORK BENSONHURST                        
USC00305799  40.8667  -73.8833   27.1 NY NEW YORK BOTANICAL GRD                      
USC00305804  40.7333  -73.9333    3.0 NY NEW YORK LAUREL HILL                        
USC00305806  40.8500  -73.9167   54.9 NY NEW YORK UNIV ST                            
USC00305816  40.7000  -74.0167    3.0 NY NEW YORK WB CITY                            
USW00014732  40.7794  -73.8803    3.4 NY NEW YORK LAGUARDIA AP                  72503
USW00014786  40.5833  -73.8833    4.9 NY NEW YORK FLOYD BENNETT FLD                  
USW00093732  39.8000  -72.6667   25.9 NY NEW YORK SHOALS AFS                         
USW00094728  40.7789  -73.9692   39.6 NY NEW YORK CNTRL PK TWR              HCN 72506
USW00094789  40.6386  -73.7622    3.4 NY NEW YORK JFK INTL AP                   74486
```

<details>
<summary><strong>:white_check_mark: Step-by-step directions (expand for details)</strong></summary><p>

Manually:

1. Navigate to your CloudFormation stack
1. In the outputs tab, grab the `AthenaSelectQuery` value
1. Open Amazon Athena, and run that command.
1. Go back to CloudFormation, in the outputs tab, grab the `AthenaCSVLocation` value and drill into today's date until you find a CSV for the query you just ran.  It will contain the results of your query in CSV format that you can later provide the path to your notebook.
1. Now you have the relevant weather data in CSV format

CLI:
1. Kick off the Athena query, escaping quotes in the query string. The execution takes about 20 seconds.
```
aws athena start-query-execution \
  --query-string "[INSERT ATHENA SELECT QUERY]" \
  --result-configuration "OutputLocation=s3://[INSERT TRANSFORMED BUCKET NAME]/nygroundstationdata/" \
  --region us-east-1
```
1. Check on the status. We're looking for 'SUCCEEDED'.
```
aws athena get-query-execution \
  --query-execution-id "[INSERT EXECUTION ID FROM ABOVE]" \
  --query "QueryExecution.Status.State" \
  --output text
```
</p></details><br>

Now from inside your Amazon SageMaker notebook you can [reference this Athena table (external link)](https://aws.amazon.com/blogs/machine-learning/run-sql-queries-from-your-sagemaker-notebooks-using-amazon-athena/).

#### Train and host a model

<details>
<summary><strong>:white_check_mark: Step-by-step directions (expand for details)</strong></summary><p>

1. Navigate to **Amazon SageMaker** in AWS Console
1. Click **Open Jupyter** link under Actions
1. When redirected to the notebook instance, click **New** then select **Terminal** from list. A new tab will open.
1. When in the terminal, type the following commands:
```
curl https://raw.githubusercontent.com/jmcwhirter/aws-serverless-workshops/master/MachineLearning/0_ExternalData/notebooks/nearest_neighbor.ipynb -o SageMaker/nearest_neighbor.ipynb
```
1. Open the `nearest_neighbor.ipynb` notebook and follow the instructions.

</p></details>

#### Make inferences against the model



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
3. Delete the stack
  ```
  aws cloudformation delete-stack \
    --stack-name wildrydes-machine-learning-module-0
  ```
</p></details>
