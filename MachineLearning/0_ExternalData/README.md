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
Use the console or CLI to upload travel data to the raw S3 bucket.

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

</p></details>

#### Monitor data transformation
Once your travel data lands in the raw data bucket, a Lambda function will supplement each record with weather information.

#### Train and host a model

#### Make inferences against the model


## The Dataset
The dataset we're using is [NOAA Global Historical Climatology Network Daily (GHCN-D)](https://registry.opendata.aws/noaa-ghcn/) ([dataset readme](https://docs.opendata.aws/noaa-ghcn-pds/readme.html)).  We're only interested in the NY groundstations:

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

### Trimming Down the dataset with Athena
*Copy the dataset from the public location to your own S3 bucket*
```
aws athena start-query-execution \
--query-string "CREATE EXTERNAL TABLE IF NOT EXISTS default.noaatmp (  `id` string,  `year_date` string,  `element` string,  `data_value` string,  `m_flag` string,  `q_flag` string,  `s_flag` string,  `obs_time` string ) ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' WITH SERDEPROPERTIES (  'serialization.format' = ',',  'field.delim' = ',') LOCATION 's3://noaa-ghcn-pds/csv/' TBLPROPERTIES ('has_encrypted_data'='false');" \
--result-configuration "OutputLocation=s3://[YOUR PRIVATE S3 BUCKET]/output/" \
--region us-east-1
```

*Convert your CSV dataset into Parquet*
```
aws athena start-query-execution \
--query-string "CREATE table default.noaatmpparquet WITH (format='PARQUET', external_location='s3://[YOUR PRIVATE S3 BUCKET]/parquet/') AS SELECT * FROM default.noaatmp WHERE q_flag = '' AND id IN ('US1NYNY0074', 'USC00305798', 'USC00305799', 'USC00305804', 'USC00305806', 'USC00305816', 'USW00014732', 'USW00014786', 'USW00093732', 'USW00094728', 'USW00094789') AND year_date LIKE '2019%';" \
--region us-east-1
```

```
aws athena get-query-execution \
--region us-east-1 \
--query-execution-id "${last_query_id}"
```

Now from inside your sagemaker notebook you can reference this athena table: https://aws.amazon.com/blogs/machine-learning/run-sql-queries-from-your-sagemaker-notebooks-using-amazon-athena/

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
