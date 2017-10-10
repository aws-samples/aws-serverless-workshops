# 모듈 2: 실시간 데이터 스트리밍 Real-time Data Streaming

이 모듈에서는 유니콘 함대의 센서 데이터를 수집하고 저장하는 Amazon Kinesis 스트림을 생성합니다. 제공된 커맨드 라인 클라이언트를 사용하면 Wild Ryde의 유니콘에서 센서 데이터를 생성하고 스트림에서 읽을 수 있습니다. 다음 모듈에서는 Amazon Kinesis Analytics, AWS Lambda 및 Amazon DynamoDB를 사용하여 이 데이터를 분석하고 유지하는 기능을 추가합니다.

## 아키텍쳐 개요

이 모듈의 아키텍쳐는 Amazon Kinesis 스트림, 생산자(producer), 소비자(consumer)를 포함합니다:

<kbd>![아키텍쳐](../images/data-streaming-architecture.png)</kbd>

우리의 생산자(producer)는 유니콘(Shadowfax)에 연결된 센서로 현재 Wild Ryde에서 승객을 태우고 있습니다. 이 센서는 유니콘의 현재 위치, 1초 전의 거리, 매직 포인트 및 히트 포인트를 포함하여 1초마다 데이터를 전송하므로 운영 팀이 Wild Rydes 본사에서 유니콘 함대의 상태를 모니터링 할 수 있습니다.

Amazon Kinesis 스트림은 생산자(producer)가 보낸 데이터를 저장하고 분석할 수 있는 인터페이스를 제공합니다. 우리의 소비자(consumer)는 스트림을 테일링하고 스트림에서 데이터 포인트를 효과적으로 실시간으로 출력하는 간단한 커맨드 라인 유틸리티이므로 스트림에 저장되는 데이터를 확인 할 수 있습니다.

모듈을 시작하기 전에 [클라이언트 설치 지침][client-installation] 에 따라 Kinesis 커맨드 라인 클라이언트를 다운로드 했는지 확인하십시오.

## 구현 지침

### 1. Amazon Kinesis 스트림 만들기

Amazon Kinesis Streams 콘솔을 사용해서 **wildrydes** 라는 이름의 **1** shard 를 가진 새 스트림을 만듭니다.

<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>

1. AWS 콘솔에서 **Services** 를 클릭한 다음, Analytics 섹션에서 **Kinesis** 를 선택합니다.

1. **Go to the Streams console** 를 선택합니다. 

1. **Create Kinesis stream** 를 클릭합니다.

1. **Kinesis stream name** 에 `wildrydes` 를 입력하고, **Number of shards** 에 `1` 을 입력한 다음, **Create Kinesis stream** 를 클릭하십시오.

1. 약 60 초 이내에 Kinesis 스트림이 **ACTIVE** 로 바뀌면서 실시간 스트리밍 데이터를 저장할 준비가 된 상태로 변경됩니다.

	<kbd>![스트림 생성 스크린샷](../images/data-streaming-stream-created.png)</kbd>

</p></details>

### 2. 스트림에 메시지 만들기

macOS, Linux 또는 Windows 용 커맨드 라인 생산자(producer) 클라이언트를 이용해서 스트림에 메시지를 생성하십시오.

<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>

1. 생산자를 실행하여 센서 데이터를 스트림으로 내보내십시오. **YOUR\_REGION\_HERE** 를 여러분이 선택한 리전으로 설정하십시오. 예를 들어, 미국 서부 US West (Oregon) 에서 스트림을 만든 경우 us-west-2 로 바꾸면 됩니다.

	```console
	./producer -region YOUR_REGION_HERE
	```

	생산자(producer)는 스트림에 메시지를 두번 보낸뒤 화면에 마침표 `.` 를 출력합니다

	```console
	$ ./producer -region us-east-1
	..................................................
	```

1. Amazon Kinesis Streams 콘솔에서, **wildrydes** 를 클릭하고 **Monitoring** 탭을 선택하십시오.

1. 몇 분 정도가 지난뒤에, **Put Record (success count)** 그래프에서 초당 한번씩 입력받는걸 기록하게 됩니다.

	<kbd>![Put Record graph screenshot](../images/data-streaming-put-records.png)</kbd>

</p></details>

## 구현한 내용 확인하기

1. 소비자(consumer)를 실행하여 스트림에서 센서 데이터 읽기를 시작합니다. **YOUR\_REGION\_HERE** 를 여러분이 선택한 리전으로 설정하십시오. 예를 들어, 미국 서부 US West (Oregon) 에서 스트림을 만든 경우 us-west-2 로 바꾸면 됩니다.

	```console
	./consumer -region YOUR_REGION_HERE
	```

	소비자(consumer)는 생산자(producer) 가 보낸 메시지를 다음과 같은 형태로 출력합니다:

	```json
	{
	    "Name": "Shadowfax",
	    "StatusTime": "2017-06-05 09:17:08.189",
	    "Latitude": 42.264444250051326,
	    "Longitude": -71.97582884770408,
	    "Distance": 175,
	    "MagicPoints": 110,
	    "HealthPoints": 150
	}
	{
	    "Name": "Shadowfax",
	    "StatusTime": "2017-06-05 09:17:09.191",
	    "Latitude": 42.265486935100476,
	    "Longitude": -71.97442977859625,
	    "Distance": 163,
	    "MagicPoints": 110,
	    "HealthPoints": 151
	}
	```

1. 생산자(producer)로 실험하기:

	1. Control + C 키보드를 눌러서 생산자(producer)를 중지하고, 메시지가 중지되는걸 확인하십시오.

	1. 생산자(producer)를 다시 시작하고, 메시지가 재게되는지 확인하십시오.

	1. 다른 탭이나 콘솔에서 생산자(producer)의 다른 인스턴스를 시작하십시오. 특정 유니콘 이름을 제공하고 소비자(consumer)의 출력에서 두 유니콘의 데이터 요소를 확인합니다.

		```console
		./producer -region YOUR_REGION_HERE -name Bucephalus
		```

생산자(producer)로 실험하기를 끝낸뒤에는 스트리밍 집계 모듈로 이동할 수 있습니다: [스트리밍 집계 Streaming Aggregation][streaming-aggregation-module].

## 추가 도전 과제

- [AWS SDKs][sdks]를 사용해서 원하는 프로그래밍 언어로 **wildrydes** 의 소비자(consumer)를 작성하십시오. 출력 형식을 시험해보십시오.

[sdks]: https://aws.amazon.com/tools/
[streaming-aggregation-module]: ../3_StreamingAggregation/README.md
[client-installation]: ../README.md#kinesis-command-line-clients
