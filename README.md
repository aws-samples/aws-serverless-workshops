# Wild Rydes 서버리스 워크삽 가이드

이 문서는 AWS Lambda, Amazon API Gateway, Amazon DynamoDB, AWS Step Functions, Amazon Kinesis 및 기타 서비스를 사용하여 다양한 서버리스 응용 프로그램을 구축하는 과정을 안내하는 워크샵 가이드와 자료들을 제공합니다.

# 분야별

- [**웹 응용 프로그램**](WebApplication) - 본 워크샵에서는 동적 서버리스 웹 응용 프로그램을 작성하는 방법을 보여줍니다. Amazon S3를 사용하여 정적 웹 리소스를 호스팅하는 방법, Amazon Cognito를 사용하여 사용자 및 인증을 관리하는 방법, Amazon API Gateway, AWS Lambda 및 Amazon DynamoDB를 사용하여 백엔드 처리를위한 RESTful API를 작성하는 방법을 학습합니다.

- [**빅데이터 처리**](DataProcessing) - 본 워크샵은 서버리스 애플리케이션으로 데이터를 수집, 저장 및 처리하는 방법을 보여줍니다. 이 워크샵에서는 AWS Lambda를 사용하여 Amazon S3에서 파일을 자동으로 처리하는 방법, Amazon Kinesis Streams 및 Amazon Kinesis Analytics를 사용하여 실시간 스트리밍 응용 프로그램을 작성하는 방법, Amazon Kinesis Firehose 및 Amazon S3를 사용하여 데이터 스트림을 보관하는 방법 및 Amazon Athena를 사용하여 해당 파일에 대해 임의 (ad-hoc) 쿼리를 실행하는 방법

- [**데브옵스(DevOps)**](DevOps) - 본 워크샵에서는 [Serverless Application Model (SAM)](https://github.com/awslabs/serverless-application-model)을 사용하여 서버리스 응용 프로그램을 만드는 방법을 보여줍니다. Amazon API Gateway, AWS Lambda 및 Amazon DynamoDB를 사용합니다. 워크 스테이션의 SAM을 사용하여 응용 프로그램에 대한 업데이트를 릴리스하는 방법, AWS CodePipeline 및 AWS CodeBuild를 사용하여 serverless 응용 프로그램에 대한 CI/CD 파이프 라인을 작성하는 방법 및 응용 프로그램에 대한 다중 환경을 관리하기위한 파이프 라인을 향상시키는 방법을 배우게 됩니다.

- [**이미지 처리**](ImageProcessing) - 본 워크샵에서는 백엔드에서 Step Functions 기반 워크 플로우 오케스트레이션을 사용하여 서버리스 이미지 처리 응용 프로그램을 빌드하는 방법을 보여줍니다. Amazon Rekogntion의 심층 학습 기반 얼굴 인식 기능을 활용하면서 AWS Step Functions를 사용하여 여러 AWS Lambda 기능을 조율하는 기초를 배웁니다.
