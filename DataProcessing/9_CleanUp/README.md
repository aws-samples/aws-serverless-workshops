# 워크삽 리소스 정리

본 문서는 빅데이터 분석 워크삽을 진행하면서 생성한 리소스를 정리하는 방법을 정리한 문서 입니다.

## 리소스 정리 가이드 

### 1. File Processing

#### AWS Lambda

- **WildRydesFileProcessor** 함수 삭제 

#### AWS IAM

- **WildRydesFileProcessorRole** 역할 삭제

#### Amazon DynamoDB

- **UnicornSensorData** 테이블 삭제

#### Amazon S3

- **wildrydes-uploads-yourname**와 비슷한 형식으로 [file-processing-module][file-processing-module]에서 생성한 버킷 삭제

### 2. Real-time Data Streaming

#### Amazon Kinesis Streams

- **wildrydes** 스트림 삭제

### 3. Streaming Aggregation

#### Amazon Kinesis Analytics

- **wildrydes** 어플리케이션 삭제

#### Amazon Kinesis Streams

- **wildrydes-aggregated** 스트림 삭제

### 4. Stream Processing

#### AWS Lambda

- **WildRydesStreamProcessor** 함수 삭제

#### AWS IAM

- **WildRydesFileProcessorRole** 역할 삭제

### 5. Data Archiving

#### Amazon Athena

- **wildrydes** 테이블 삭제

	1. Amazon Athena 쿼리 에디터에 다음을 입력:

	```sql
	DROP TABLE wildrydes;
	```

	2. **Run Query** 클릭

#### AWS Lambda

- **WildRydesStreamToFirehose** 함수 삭제

#### AWS IAM

- **WildRydesLambdaKinesisRole** 역할  삭제

#### Amazon Kinesis Firehose

- **wildrydes** 스트림 삭제

#### Amazon S3

- **wildrydes-data-yourname** 와 비슷한 형식으로 [data-archiving-module][data-archiving-module] 에서 생성한 버킷 삭제

[file-processing-module]: ../1_FileProcessing/README.md
[data-archiving-module]: ../5_DataArchiving/README.md
