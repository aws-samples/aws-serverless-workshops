# Workshop Clean-up

This page provides instructions for cleaning up the resources created during the preceding modules.

## Resource Clean-up Instructions

### 1. File Processing

#### AWS Lambda

- Delete the function **WildRydesFileProcessor**.

#### AWS IAM

- Delete the role **WildRydesFileProcessorRole**.

#### Amazon DynamoDB

- Delete the table **UnicornSensorData**.

#### Amazon S3

- Delete the bucket you created in the first section of the [module][file-processing-module]. It should be named similarly to **wildrydes-uploads-yourname**.

### 2. Real-time Data Streaming

#### Amazon Kinesis Streams

- Delete the stream **wildrydes**.

### 3. Streaming Aggregation

#### Amazon Kinesis Analytics

- Delete the application **wildrydes**.

#### Amazon Kinesis Streams

- Delete the stream **wildrydes-aggregated**.

### 4. Stream Processing

#### AWS Lambda

- Delete the function **WildRydesStreamProcessor**.

#### AWS IAM

- Delete the role **WildRydesFileProcessorRole**.

### 5. Data Archiving

#### Amazon Athena

- Delete the table **wildrydes**.

	1. In the Amazon Athena query editor, type:

	```sql
	DROP TABLE wildrydes;
	```

	2. Click **Run Query**.

#### AWS Lambda

- Delete the function **WildRydesStreamToFirehose**.

#### AWS IAM

- Delete the role **WildRydesLambdaKinesisRole**.

#### Amazon Kinesis Firehose

- Delete the delivery stream **wildrydes**.

#### Amazon S3

- Delete the bucket you created in the first section of the [module][data-archiving-module]. It should be named similarly to **wildrydes-data-yourname**.

[file-processing-module]: ../1_FileProcessing/README.md
[data-archiving-module]: ../5_DataArchiving/README.md
