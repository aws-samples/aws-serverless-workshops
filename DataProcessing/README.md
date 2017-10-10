# 서버리스 데이터 처리 워크샵

이 워크샵에서는 서버리스 아키텍쳐를 사용해서 데이터를 처리하는 방법을 살펴봅니다. 여러분은 유니콘 함대(Unicorn fleet)의 건강 상태를 모니터링 하기 위해 [Wild Rydes](http://www.wildrydes.com/) 본사의 운영 요원을 지원할 수 있도록 처리 인프라를 구축하게 됩니다. 각 유니콘에는 위치와 건강 상태를 알려주는 센서가 장착되어 있으며, 이 데이터를 일괄 처리 및 실시간으로  처리하는 방법을 알아봅니다.

이 인프라를 구축하려면 다음과 같은 AWS의 서비스를 이용합니다. [AWS Lambda](https://aws.amazon.com/lambda/), [Amazon S3](https://aws.amazon.com/s3/), [Amazon Kinesis](https://aws.amazon.com/kinesis/), [Amazon DynamoDB](https://aws.amazon.com/dynamodb/), 그리고 [Amazon Athena](https://aws.amazon.com/athena/). 여러분은 파일과 스트림을 처리하기 위해 Lambda를 이용해서 함수를 만들고, DynamoDB를 이용해서 유니콘의 건강 상태를 유지하고, Kinesis Analytics를 사용해서 이러한 데이터 포인트를 집계하는 서버리스 응용 프로그램을 만들고, Kinesis Firehose 및 Amazon S3를 사용해서 원시 데이터(raw data)를 보관하며 Amazon Athena는 원시 데이터(raw data)에 대해 임의 쿼리(ad-hoc query)를 실행합니다. 

## 사전 준비 사항

### AWS 계정

이 워크샵을 완료하려면 AWS Identity and Access Management (IAM), Amazon Simple Storage Service (S3), Amazon DynamoDB, AWS Lambda, Amazon Kinesis Streams, Amazon Kinesis Analytics, Amazon Kinesis Firehose 를 만들 수 있는 액세스 권한이 있는 AWS 계정이 필요합니다. 그리고 Amazon Athena 리소스에 액세스 할 수 있어야 합니다.

이 워크샵의 코드와 지침은 한번에 한명의 학생에게만 주어진 AWS 계정을 사용한다고 가정합니다. 다른 학생과 계정을 공유하려고 하면, 특정 리소스 이름에 대해서 충돌이 발생합니다. 리소스 이름에 접미어를 사용하거나 고유한 이름을 부여해서 문제를 해결할 순 있지만, 이 지침에는 관련 작업을 수행하는데 필요한 변경 사항에 대한 세부 정보는 나오지 않습니다.

### 리전

AWS Lambda, Amazon Kinesis Streams, Amazon Kinesis Firehose, Amazon Kinesis Analytics, 그리고 Amazon Athena 를 포함해서 워크샵에서 다루는 전체 서비스를 지원하는 AWS 리전을 선택하십시오. [리전 표][region-table] 를 사용해서 지역에서 사용할 수 있는 서비스를 확인할 수 있습니다. 앞에서 말한 서비스를 지원하는 지역은 **US East (N. Virginia)** 와 **US West (Oregon)** 이 포함됩니다.

### Kinesis 커맨드 라인 클라이언트

스트리밍 데이터 및 Amazon Kinesis 와 관련된 모듈은 두개의 커맨드 라인 클라이언트를 사용해서 유니콘 함대(Unicorn fleet)중에서 센서 데이터를 시뮬레이션 하고 표시합니다.

#### 생산자 (Producer)

생산자(producer)는 유니콘이 승객을 야생 라이딩으로 태워주면서 센서 데이터를 생성합니다. 매 초마다 유니콘의 위치는 위도와 경도로 표시되고 거리는 1초전 데이타의 미터로 표시되며, 유니콘의 현재 마력과 건강 상태를 나타냅니다.

#### 소비자 (Consumer)

소비자(consumer)는 Amazon Kinesis 스트림에서 형식화 된 JSON 메시지를 읽고 표시해서, 스트림으로 전송되는 내용을 실시간으로 모니터링 할 수 있습니다. 소비자(consumer)를 사용하면 생산자(Producer)가 보내는 데이터와 응용 프로그램에서 해당 데이터를 처리하는 부분을 모니터링 할 수 있습니다.

#### 설정하기

생산자(producer) 와 소비자(consumer) 는 [Go 프로그래밍 언어][go] 로 작성된 작은 프로그램입니다. 아래 지침은 macOS, Windows, 또는 Linux 용 바이너리를 다운로드해서 사용할 수 있도록하는 준비 과정입니다. 만약 직접 소스코드를 확인하고 빌드를 하고 싶다면, [소스 코드][client-src] 는 이 저장소에 포함되어 있으며 [Go][go] 를 사용해서 컴파일 할 수 있습니다.


1. AWS 커맨드 라인 인터페이스 또는 제공된 링크를 사용해서, 플랫폼 용으로 빌드된 커맨드 라인 클라이언트를 S3 버킷에서 로컬 시스템으로 복사하십시오.

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

1. 생산자 (producer) 에서 `-h` 명령어를 사용해서 커맨드 라인 arguments 를 살펴봅니다.

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

	기본값에 유의하십시오. arguments 인자 값 없이 명령을 실행하면 **US East (N. Virginia)** 리전의 **wildrydes** 스트림 이름의 **Shadowfax** 라는 유니콘에 대한 데이터가 생성됩니다.

1. 소비자(consumer) 에서 `-h` 명령어를 사용해서 커맨드 라인 arguments 를 살펴봅니다.

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

	기본값에 유의하십시오. arguments 인자 값 없이 명령을 실행하면 **US East (N. Virginia)** 리전에서 **wildrydes** 스트림에서 데이터를 읽어옵니다. 

1. 커맨드 라인 클라이언트에는 Amazon Kinesis Streams에서 레코드를 가져오거나(get) 쓸 수 있는 권한(pus) 있는 자격 증명(credentials)이 필요합니다. 이러한 자격 증명은 다음 중 하나를 통해 클라이언트에 제공 될 수 있습니다.

	1. 	공유 자격 증명 파일 사용 (Using shared credentials file)

		이 자격 증명 파일(credential) 은 다른 SDK 및 AWS 커맨드 라인 인터페이스에서 사용되는것과 동일한 것입니다. 이미 공유 자격 증명 파일을 사용하고 있다면, 이 용도로도 사용 할 수 있습니다. 아직 자격 증명을 설정하지 않았다면  `aws configure` 명령어를 실행해서 CLI를 설정하십시오. (먼저 AWS CLI가 설치되있어야 합니다)
		
		```console
		$ aws configure
		AWS Access Key ID [None]: YOUR_ACCESS_KEY_ID_HERE
		AWS Secret Access Key [None]: YOUR_SECRET_ACCESS_KEY_HERE
		```

	1. 환경 변수 사용 (Using environment variables)

		클라이언트는 사용자 환경에 설정된 자격 증명을 사용하여 요청을 AWS에 서명 할 수도 있습니다. `AWS_ACCESS_KEY_ID` 와 `AWS_SECRET_ACCESS_KEY` 환경 변수를 여러분의 인증서와 함께 로컬에 설정하십시오.
		
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

	자세한 내용은 [AWS SDK for Go 설정 가이드][sdk-config] 를 참조하십시오.

## 모듈

1. [파일 처리 (File Processing)](1_FileProcessing/README.md)
1. [실시간 데이타 스트리밍 (Real-time Data Streaming)](2_DataStreaming/README.md)
1. [스트리밍 집계 (Streaming Aggregation)](3_StreamingAggregation/README.md)
1. [스트림 처리 (Stream Processing)](4_StreamProcessing/README.md)
1. [데이터 보관 (Data Archiving)](5_DataArchiving/README.md)

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
