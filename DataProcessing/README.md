# Serverless Data Processing Workshop

In this workshop you'll explore approaches for processing data using serverless architectures. You'll build processing infrastructure to enable operations personnel in [Wild Rydes](http://www.wildrydes.com/) headquarters to monitor the health of the unicorn fleet. Each unicorn is equipped with a sensor that reports its location and vitals and you'll explore approaches for processing this data in batches and real-time.

To build this infrastructure, you will use [AWS Lambda](https://aws.amazon.com/lambda/), [Amazon S3](https://aws.amazon.com/s3/), [Amazon Kinesis](https://aws.amazon.com/kinesis/), [Amazon DynamoDB](https://aws.amazon.com/dynamodb/), and [Amazon Athena](https://aws.amazon.com/athena/). You'll create functions in Lambda to process files and streams, use DynamoDB to persist unicorn vitals, create a serverless application to aggregate these data points using Kinesis Analytics, archive the raw data using Kinesis Firehose and Amazon S3, and you'll use Amazon Athena to run ad-hoc queries against the raw data.

## Prerequisites

### AWS Account

In order to complete this workshop you'll need an AWS Account with access to create AWS Identity and Access Management (IAM), Amazon Simple Storage Service (S3), Amazon DynamoDB, AWS Lambda, Amazon Kinesis Streams, Amazon Kinesis Analytics, Amazon Kinesis Firehose, and Amazon Athena resources.

The code and instructions in this workshop assume only one student is using a given AWS account at a time. If you try sharing an account with another student, you'll run into naming conflicts for certain resources. You can work around this by either using a suffix in your resource names or using distinct Regions, but the instructions do not provide details on the changes required to make this work.

### Region

Choose an AWS Region to execute the workshops which support the complete set of services covered in the material including AWS Lambda, Amazon Kinesis Streams, Amazon Kinesis Firehose, Amazon Kinesis Analytics, and Amazon Athena. Use the [Region Table][region-table] to determine which services are available in a Region. Regions that support these services include **US East (N. Virginia)** and **US West (Oregon)**.

### Kinesis Command-Line Clients

The modules which involve streaming data and Amazon Kinesis utilize two command-line clients to simulate and display sensor data from the unicorns in the fleet.

#### Producer

The producer generates sensor data from a unicorn taking a passenger on a Wild Ryde. Each second, it emits the location of the unicorn as a latitude and longitude point, the distance traveled in meters in the previous second, and the unicorn's current level of magic and health points.

#### Consumer

The consumer reads and displays formatted JSON messages from an Amazon Kinesis stream which allow us to monitor in real-time what's being sent to the stream. Using the consumer, you can monitor the data the producer is sending and how your applications are processing that data.

#### Setup

The producer and consumer are small programs written in the [Go Programming language][go]. The below instructions walk through downloading binaries for macOS, Windows, or Linux and preparing them for use. If you prefer to inspect and build them yourself, the [source code][client-src] is included in this repository and can be compiled using [Go][go].


1. Using the AWS Command Line Interface or the provided links, copy the command-line clients built for your platform from an S3 bucket to your local system:

	**macOS** ([producer][mac-producer], [consumer][mac-consumer])

	```console
	aws s3 cp --recursive s3://wildrydes-us-east-1/DataProcessing/kinesis-clients/macos/ .
	chmod a+x producer consumer
	```

	**Windows** ([producer.exe][win-producer], [consumer.exe][win-consumer])

	```console
	aws s3 cp --recursive s3://wildrydes-us-east-1/DataProcessing/kinesis-clients/windows/ .
	```

	**Linux** ([producer][linux-producer], [consumer][linux-consumer])

	```console
	aws s3 cp --recursive s3://wildrydes-us-east-1/DataProcessing/kinesis-clients/linux/ .
	chmod a+x producer consumer
	```

1. Run the producer with `-h` to view its command-line arguments:

	**macOS** / **Linux**

	```console
	$ ./producer -h
	  -name string
      Unicorn Name (default "Shadowfax")
      -region string
      Region (default "us-east-1")
      -stream string
      Stream Name (default "wildrydes")
	```

	**Windows**

	```console
	C:\Downloads>producer.exe -h
	  -name string
      Unicorn Name (default "Shadowfax")
      -region string
      Region (default "us-east-1")
      -stream string
      Stream Name (default "wildrydes")
	```

	Note the defaults. Running this command without any arguments will produce data about a unicorn named **Shadowfax** to a stream named **wildrydes** in **US East (N. Virginia)**.

1. Run the consumer with `-h` to view its command-line arguments:

	**macOS** / **Linux**

	```console
	$ ./consumer -h
      -region string
      Region (default "us-east-1")
      -stream string
      Stream Name (default "wildrydes")
	```

	**Windows**

	```console
	C:\Downloads>consumer.exe -h
      -region string
      Region (default "us-east-1")
      -stream string
      Stream Name (default "wildrydes")
	```

	Note the defaults. Running this command without any arguments will read from the stream named **wildrydes** in **US East (N. Virginia)**.

1. The command-line clients require authentication credentials with the permission to put and get records from Amazon Kinesis Streams. These credentials can be provided to the clients by either:

	1. 	Using a shared credentials file

		This credentials file is the same one used by other SDKs and the AWS Command Line Interface. If you're already using a shared credentials file, you can use it for this purpose, too. If you've not yet configured credentials, run `aws configure` to interactively configure the CLI:
		
		```console
		$ aws configure
		AWS Access Key ID [None]: YOUR_ACCESS_KEY_ID_HERE
		AWS Secret Access Key [None]: YOUR_SECRET_ACCESS_KEY_HERE
		```
		
		If you'd like to use a named profile, you'll need to set an environment variable with the key `AWS_PROFILE` and the value of the profile name to use:
		
		```console
		export AWS_PROFILE=workshop
		```

	1. Using environment variables

		The clients can also use credentials set in your environment to sign requests to AWS. Set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables locally with your credentials.
		
		**macOS** / **Linux**
		
		```console
		export AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID_HERE
		export AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY_HERE
		```
		**Windows**
		
		```console
		set AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID_HERE
		set AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY_HERE
		```

	See the [AWS SDK for Go configuration documentation][sdk-config] for more details.

## Modules

1. [File Processing](1_FileProcessing/README.md)
1. [Real-time Data Streaming](2_DataStreaming/README.md)
1. [Streaming Aggregation](3_StreamingAggregation/README.md)
1. [Stream Processing](4_StreamProcessing/README.md)
1. [Data Archiving](5_DataArchiving/README.md)

After you have completed the workshop you can delete all of the resources that were created by following the [clean-up guide].

[region-table]: https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/
[go]: https://www.golang.org
[client-src]: kinesis-clients
[mac-producer]: https://s3.amazonaws.com/wildrydes-us-east-1/DataProcessing/kinesis-clients/macos/producer
[mac-consumer]: https://s3.amazonaws.com/wildrydes-us-east-1/DataProcessing/kinesis-clients/macos/consumer
[win-producer]: https://s3.amazonaws.com/wildrydes-us-east-1/DataProcessing/kinesis-clients/windows/producer.exe
[win-consumer]: https://s3.amazonaws.com/wildrydes-us-east-1/DataProcessing/kinesis-clients/windows/consumer.exe
[linux-producer]: https://s3.amazonaws.com/wildrydes-us-east-1/DataProcessing/kinesis-clients/linux/producer
[linux-consumer]: https://s3.amazonaws.com/wildrydes-us-east-1/DataProcessing/kinesis-clients/linux/consumer
[sdk-config]: https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html
[clean-up guide]: 9_CleanUp/README.md
