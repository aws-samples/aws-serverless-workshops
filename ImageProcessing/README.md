# Module: AWS Step Functions를 사용하여 서버리스 이미지 처리 워크 플로우 조정

이 모듈에서는 AWS Step Functions를 사용하여 여러 AWS Lambda 함수를 조정하여 이미지 처리 워크 플로를 작성합니다.

Wild Rydes팀은 가입 후, 사용자 셀카를 업로드하는 새로운 기능을 추가하려고합니다. 이것은 몇 가지 작업을 수행합니다.

1. 좋은 고객 경험을 제공하기 위해 유니콘이 픽업 중 라이더를 쉽게 식별 할 수 있습니다. 이것은 또한 보안을 강화하여, 범죄자를 식별하여 유니콘을 타기 전에 제어가능합니다.
1. 동일한 사용자가 새 사용자 프로모션을 악용하기 위해 여러 계정에 등록하는 것을 방지합니다.

![selfie picture](./images/selfie/selfie-picture.jpeg)

사용자가 자신의 사진을 업로드하면 몇 가지 확인 및 처리 단계가 수행되어야합니다.

1. 사진이 라이더를 식별하기 위해 app/unicorns가 사용할 수있는 깨끗한 얼굴을 보여 주는지 확인하십시오.
1. 사용자가 아직 등록하지 않았는지 확인하기 위해 이전에 색인된 얼굴 모음과 대조하십시오.
1. 응용 프로그램에 표시 할 축소판 그림으로 사진의 크기를 조정하십시오.
1. 사용자 얼굴을 콜렉션에 색인화하여 나중에 일치시킬 수 있도록하십시오.
1. 사진의 메타 데이터를 사용자 프로필과 함께 저장하십시오. 

서버리스 환경에서 위의 각 단계는 AWS Lambda 기능을 사용하여 쉽게 구현할 수 있습니다. 그러나 이전 단계가 완료된 후에 하나의 람다 함수를 호출하는 흐름을 어떻게 관리하고 각 이미지에서 일어난 일을 추적 할 수 있습니까? 람다 기능 중 하나가 시간 초과되어 재 시도해야 할 경우? 람다 함수 중 일부는 병렬 처리로 처리 지연을 줄이기 위해, 실행중인 람다 함수를 어떻게 병렬로 조정할 수 있고 끝내기를 기다릴 수 있습니까? AWS Step Functions를 사용하면 이러한 문제를 쉽게 해결할 수 있으며 감사 추적 및 시각화를 통해 각 플로우에서 발생한 문제를 추적 할 수 있습니다.

## 아키텍처 개요
이 모듈의 아키텍처는 **Amazon Rekognition**의 얼굴 탐지 기능을 활용하고, **Amazon S3**에 저장된 업로드 된 이미지의 크기를 조정하고, 사용자 프로필로 이미지 메타 데이터를 **Amazon DynamoDB**에 저장하는 여러 개의 **AWS Lambda** 함수로 구성됩니다. 람다 함수의 오케스트레이션은 **AWS Step Functions** 상태 머신에 의해 관리됩니다.

<img src="./images/wild-rydes-architecture.png" width="60%">

아래는 **AWS Step Functions**로 시각화 한 워크 플로우의 흐름도입니다.

<img src="./images/4th-state-machine-graph.png" width="60%">

이 모듈에서는 AWS Step Functions 관리 콘솔에서 수동으로 워크 플로우를 시작합니다. 실제 응용 프로그램에서는 응용 프로그램이 호출하는 단계 함수 상태 시스템을 호출하는 Amazon API Gateway를 구성하거나 Amazon CloudWatch 이벤트 또는 S3 이벤트 알림을 통해 Amazon S3 업로드 이벤트에 의해 트리거되도록 설정할 수 있습니다.

## 구현 방법

다음 섹션에서는 구현 개요와 자세한 단계별 지침을 제공합니다. 개요는 이미 AWS Management Console에 익숙하거나 둘러보기를 거치지 않고 직접 서비스를 탐색하려는 경우 구현을 완료 할 수있는 충분한 컨텍스트를 제공해야합니다.

최신 버전의 Chrome, Firefox 또는 Safari 웹 브라우저를 사용하는 경우 섹션을 확장해야 단계별 지침이 표시됩니다.

</p></details>
 
### 1. Amazon Rekognition 컬렉션 생성하기
Face Collection은 인덱싱 된 얼굴 이미지를 검색 가능한 벡터로 저장하는 Amazon Rekognition의 컨테이너입니다.

AWS 커맨드 라인 인터페이스를 사용하여 아마존 Rekognition에서 `rider-photos` 컬렉션을 생성하십시오.

<details>
<summary><strong>단계별 지침 (자세히 보기)</strong></summary><p>

1. 터미널 창에서 다음 명령을 실행하고 `REPLACE_WITH_YOUR_CHOSEN_AWS_REGION` 부분을 선택한 리전의 문자열로 대체하십시오. ([Rekognition 리전](http://docs.aws.amazon.com/general/latest/gr/rande.html#rekognition_region) 참조)

		aws rekognition create-collection --region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION --collection-id rider-photos
	
	예를 들어:
	
		aws rekognition create-collection --region us-east-1 --collection-id rider-photos
		aws rekognition create-collection --region us-west-2 --collection-id rider-photos
		aws rekognition create-collection --region eu-west-1 --collection-id rider-photos
	
	
2. 성공하면 다음과 같은 서비스에서 확인을 받아야합니다:

	```JSON
	{
    	"CollectionArn": "aws:rekognition:us-west-2:012345678912:collection/rider-photos",
    	"StatusCode": 200
	}
	```
</p></details>

### 2. AWS CloudFormation을 사용하여 Amazon S3, AWS Lambda 및 Amazon DynamoDB 리소스 배포

다음 AWS CloudFormation 템플릿은 이러한 리소스를 생성합니다.

* Amazon S3 버킷 2개:
	* **RiderPhotoS3Bucket** 라이더가 업로드 한 사진을 저장합니다.
	* 몇 개의 테스트 이미지가 **RiderPhotoS3Bucket** 버킷에 복사됩니다.
	* **ThumbnailS3Bucket** 라이더 사진의 크기가 조정 된 썸네일을 저장합니다.
* **RiderPhotoDDBTable** 라이더의 사진과 함께 라이더의 프로필 메타 데이터를 저장하는 하나의 Amazon DynamoDB 테이블
* 각 처리 단계를 수행하는 AWS Lambda 함수들

원하는 리전을 선택하세요.  

리전 | 실행하기
------|-----
US East (N. Virginia) | [![Launch Module in us-east-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=wildrydes-step-module-resources&templateURL=https://s3.amazonaws.com/wild-rydes-step-module-us-east-1/0-cfn/wild-rydes-step-module-us-east-1.output.yaml)
US West (Oregon) | [![Launch Module in us-west-2](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=wildrydes-step-module-resources&templateURL=https://s3-us-west-2.amazonaws.com/wild-rydes-step-module-us-west-2/0-cfn/wild-rydes-step-module-us-west-2.output.yaml)
EU (Ireland) | [![Launch Module 1 in eu-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=wildrydes-step-module-resources&templateURL=https://s3-eu-west-1.amazonaws.com/wild-rydes-step-module-eu-west-1/0-cfn/wild-rydes-step-module-eu-west-1.output.yaml)

<details>
<summary><strong>AWS CloudFormation 실행 (자세히 보기)</strong></summary><p>

1. 위의 **Launch Stack** 링크를 클릭해서 원하는 리전을 찾으십시오.

1. Select Template 페이지에서 **Next** 를 클릭하십시오.

1. 세부 정보 선택 페이지에서, 모두 기본값으로 그대로 둔 상태에서 **Next** 를 클릭하십시오.

1. 옵션 (Option) 페이지에서, 모두 기본값으로 그대로 둔 상태에서 **Next** 를 클릭하십시오.

1. 리뷰 (Review) 페이지에서, AWS CloudFormation 권한중에서 **"create IAM resources"** 와 **"create IAM resources with custom names"** 의 권한을 부여하는 체크박스를 선택하십시오.

1. 변환 (Transforms) 섹션에서 **"Create Change Set"** 를 클릭하십시오.

1. **"Execute"** 를 클릭하십시오.

1. `wildrydes-step-module-resources` 스택이 `CREATE_COMPLETE` 상태가 될때까지 기다리십시오.

1. `wildrydes-step-module-resources` 스택을 선택하고, **Outputs** 탭을 클릭하십시오. 여기에 표시된 리소스 정보는 다음 단계에서 참조합니다. (메모장 등에 붙여넣으세요) 

</p></details>



### 3. 초기 AWS Step Functions 상태 머신 작성하기

라이더가 사진을 업로드 한 뒤, 처리 파이프라인에서 가장 먼저 해야할일은 얼굴 인식 알고리즘을 실행해서 사진에 인식 가능한 얼굴이 있는지 확인하는것입니다 (사진의 얼굴이 없거나, 혹은 여러개라면 라이더를 인식할 수 없어서 유니콘을 사용할 수 없습니다) 얼굴은 선글라스를 착용하면 안됩니다 (라이더를 인식하기가 더 어려워집니다). 이러한 유효성 검사가 실패하면 사용자가에 알리고 워크 플로를 종료하십시오.

**Amazon Rekognition** 딥 러닝 기반의 이미지  분석 API를 활용해서 위의 검사를 구현하는 AWS Lambda 함수는 이미 이전 단계에서 AWS CloudFormation 에 의해 배포되었습니다. **Outputs** 섹션에서 람다 함수의 ARN에 대한 `FaceDetectionFunctionArn` 를 확인하십시오. 

유효성 검사가 실패 할 때 호출되는 AWS Lambda 함수는 AWS CloudFormation 에 의해 배포 된  `NotificationPlaceholderFunction` 입니다. 이 단계의 목적은 사진 유효성 검증 실패 및 오류의 이유를 사용자에게 알리는것입니다. 따라서 다른 사진을 업로드 할 수 있습니다. 현재는 메시지를 보내는 대신 메시지를 준비하는 임시 구현입니다.

이제 초기 얼굴 검출 단계로 AWS Step Functions 상태 머신을 생성할 수 있습니다.

![초기 상태 머신 다이어그램](./images/1st-state-machine-graph.png)

<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>

1. AWS Step Functions 상태 머신의 흐름은 JSON 문서 형태로 정의됩니다. 좋아하는 텍스트 편집기에서(Notepad++ 혹은 VS Code 등) `rider-photo-state-machine.json` 라는 파일을 만듭니다.

1. 다음을 복사하여 JSON 파일에 붙여 넣으십시오.

	```JSON
	{
	  "Comment": "Rider photo processing workflow",
	  "StartAt": "FaceDetection",
	  "States": {
	    "FaceDetection": {
	      "Type": "Task",
	      "Resource": "REPLACE_WITH_FaceDetectionFunctionArn",
	      "ResultPath": "$.detectedFaceDetails",
	      "End": true,
	      "Catch": [
	        {
	          "ErrorEquals": [
	            "PhotoDoesNotMeetRequirementError"
	          ],
	          "ResultPath": "$.errorInfo",
	          "Next": "PhotoDoesNotMeetRequirement"
	        }
	      ]
	    },
	    "PhotoDoesNotMeetRequirement": {
	      "Type": "Task",
	      "Resource": "REPLACE_WITH_NotificationPlaceholderFunctionArn",
	      "End": true
	    }
	  }
	}

	```
	
	위의 JSON 파일은 [Amazon States Language](https://states-language.net/spec.html) 를 사용하여 상태 머신을 정의합니다. 잠시 시간을 내서 구조를 이해하십시오. 
	 
	이 상태 머신이 시작되면, AWS Step Functions 인터프리터는 시작 상태를 식별해서 실행을 시작합니다. 이 상태를 실행 한 다음 상태가 종료 상태(END State) 로 표시되는지 확인합니다. 그럴 경우 상태 머신은 종료되고 결과를 리턴합니다. 상태가 End State 가 아니면 해석기는 다음에 실행할 상태를 결정하기 위해서 "Next" 필드를 찾습니다. 터미널 상태 (성공, 실패 또는 종료)에 도달하거나 런타임 오류가 발핼할 때까지 이 프로세스를 반복합니다.
	 
	`FaceDetection` 상태(state) 의 `ResultPath` 매개 변수(Parameter) 는 상태의 출력을 상태로 전달된 원래 입력과 AWS Lambda 함수의 출력을 보유하는 `detectedFaceDetails` 필드의 합집합으로 만듭니다.
	 
	`FaceDetection` 상태(state) 의 `Catch` 매개 변수(Parameter) 는 AWS Lambda 함수에 의해 던져진 커스텀 타입 에러와 매치될 수 있고, 잡힌 에러 타입에 기반한 실행 흐름을 바꿀 수 있습니다.


1. JSON 파일에서 `REPLACE_WITH_FaceDetectionFunctionArn` 를 얼굴 인식(face detection) AWS Lambda 함수의 ARN 으로 바꿔줍니다.
	> 얼굴 인식(face detection) AWS Lambda 함수의 ARN을 찾으려면, AWS CloudFormation 콘솔에서, `wildrydes-step-module-resources` 스택으로 이동해서, **Outputs** 섹션에서 `FaceDetectionFunctionArn` 를 찾습니다)

1. JSON 파일에서 `REPLACE_WITH_NotificationPlaceholderFunctionArn` 모의로 유저에게 알람을 보내는 AWS Lambda 함수의 ARN 으로 바꿔줍니다.
	> 모의로 유저에게 알람을 보내는 AWS Lambda 함수의 ARN 을 찾으려면, AWS CloudFormation 콘솔에서, `wildrydes-step-module-resources` 스택으로 이동해서, **Outputs** 섹션에서 `NotificationPlaceholderFunctionArn` 를 찾습니다)
 

1. AWS Management 콘솔에서, **Services** 를 선택한 다음 **Step Functions** 를 선택하십시오. 

1. 이전에 AWS Step Functions 를 사용하지 않았다면 시작 페이지를 볼 수 있습니다. 이 경우 **Get Started** 를 클릭하면, 새 상태 머신을 만드는 페이지로 연결됩니다. 그렇지 않으면, **Create a State Machine** 버튼을 클릭하십시오. 

1. 상태 머신의 이름으로 `RiderPhotoProcessing-1` 를 입력하십시오.

1. `rider-photo-state-machine.json` 파일늬 JSON을 **Code** 편집기(Editor) 부분에 붙여 넣으십시오. 

1. **Preview** 화면 옆의 새로고침 버튼을 눌러서 워크 플로우를 시작화하십시오:
 
	![초기 상태 머신 만들기](./images/create-initial-state-machine-2.png)


1. **Create State Machine** 를 클릭해서 상태 머신을 작성하십시오.

1. 팝업 창에서, 자동 생성된 IAM 역할을 선택하십시오 (이름은 `StatesExecutionRole-{region-name}` 와 같아야합니다).

	![상태 머신에 대한 IAM 역할 선택](./images/pick-state-role.png)

1. **New execution** 버튼을 클릭하여 새 실행을 시작합니다.

1. AWS Step Functions 상태 머신으로 전달 된 입력 데이터를 처리하도록 지정합니다.

   Step Functions 상태 머신의 각 실행에는 고유한 ID(unique ID)가 있습니다. 실행을 시작할 때 하나를 지정하거나 서비스가 생성하도록 할 수 있습니다. "enter your execution id here" 라는 텍스트 필드에서, 실행 ID(execution ID) 를 지정하거나, 혹은 비워둘 수 있습니다. 
   
   입력 데이터(input date)의 경우, follow JSON 을 입력하십시오. `s3Bucket` 필드를 자신의 S3 버킷 값으로 바꿔주십시오. 
   
	`s3Bucket` 필드의 경우, `wildrydes-step-module-resources` 스택의 **Outputs** 섹션에서 `RiderPhotoS3Bucket` 정보를 보십시오. 
	
	`userId` 필드는 나중에 처리 단계에서 userId 를 사용하여 프로필 사진이 연결된 사용자를 기록하기 때문에 필요합니다.

	
	```JSON
	{
	  "userId": "user_a", 
	  "s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	  "s3Key": "1_happy_face.jpg"
	} 
	```
	> 이것은 사전 처리 작업 흐름에 사진을 업로드 한 userId 와 Amazon S3 버킷 및 사진이 있는 키를 알려줍니다.  
	
	![새로운 실행 테스트](./images/test-execution-1.png)

1. 이제 상태 머신을 실행을 볼 수 있습니다. 콘솔에서 여러 탭을 탐색하여 이 실행을 위해 사용할 수 있는 정보를 확인하십시오:

	![첫번째 실행 결과](./images/1st_execution_result.png)

1. 선글라스를 착용한 사진의 s3 키를 전달해서 다른 실행 방법을 만들고, 실행 방법이 다른지 확인하십시오:  

	```JSON
	{
	  "userId": "user_b",
	  "s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	  "s3Key": "2_sunglass_face.jpg"
	} 
	```
![선글라스 실행 결과](./images/initial-machine-sunglasses.png)
</p></details>


### 4. 중복을 방지하고 얼굴을 색인에 추가하는 단계 추가

업로드 된 사진이 기본 얼굴 인식을 통과한 경우, 다음 단계는 동일한 사용자가 여러번 가입하지 못하도록 얼굴이 이미 콜렉션에 저장되지 않았는지 확인하는것입니다. 이 섹션에서는  `FaceSearchFunction` AWS Lambda 함수를 활용하여 **CheckFaceDuplicate** 상태 머신을 시스템에 추가합니다.

![두번째 상태 머신 다이어그램](./images/2nd-state-machine-graph.png)

<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요</strong></summary><p>

1. `rider-photo-state-machine.json` 파일을 편집해서 워크 플로우에 새로운 단계를 추가하십시오.

   먼저, `PhotoDoesNotMeetRequirement` 상태 다음에 새로운 상태인 `CheckFaceDuplicate` 를 추가하십시오. 그런 다음 `REPLACE_WITH_FaceSearchFunctionArn` 를 AWS CloudFormation output 정보에서 `FaceSearchFunctionArn` 로 바꾸십시오: 


	```JSON
	,
    "CheckFaceDuplicate": {
      "Type": "Task",
      "Resource": "REPLACE_WITH_FaceSearchFunctionArn",
      "ResultPath": null,
      "End": true,
      "Catch": [
        {
          "ErrorEquals": [
            "FaceAlreadyExistsError"
          ],
          "ResultPath": "$.errorInfo",
          "Next": "PhotoDoesNotMeetRequirement"
        }
      ]
    }
	```
1. `FaceDetection` 상태에서 상태 머신의 종료 상태로 표시하는 라인을 찾습니다.

	```JSON
	     	 "End": true,

	```
	그리고 아래와 같이 변경하십시오
	
	```JSON
      		"Next": "CheckFaceDuplicate",

	```
	아곳운 `FaceDetection` 상태가 성공적으로 실행되면 AWS Step Functions 에 알려주고, 다음 단계로 `CheckFaceDuplicate` 상태를 실행합니다. 

1. 이 시점에서, 여러분의 `rider-photo-state-machine.json` 파일은 다음과 같이 보일것입니다. (AWS Lambda ARN 은 예제입니다): 
	<details>
	<summary><strong>(펼치면 보여집니다)</strong></summary><p>

	```JSON
	{
	  "Comment": "Rider photo processing workflow",
	  "StartAt": "FaceDetection",
	  "States": {
	    "FaceDetection": {
	      "Type": "Task",
	      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-FaceDetectionFunction-4AYSKX2EGPV0",
	      "ResultPath": "$.detectedFaceDetails",
	      "Next": "CheckFaceDuplicate",
	      "Catch": [
	        {
	          "ErrorEquals": [
	            "PhotoDoesNotMeetRequirementError"
	          ],
	          "ResultPath": "$.errorInfo",
	          "Next": "PhotoDoesNotMeetRequirement"
	        }
	      ]
	    },
	    "PhotoDoesNotMeetRequirement": {
	      "Type": "Task",
	      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-NotificationPlaceholderFunct-CDRLZC8BRFWP",
	      "End": true
	    },
	    "CheckFaceDuplicate": {
	      "Type": "Task",
	      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-FaceSearchFunction-1IT67V4J214DC",
	      "ResultPath": null,
	      "End": true,
	      "Catch": [
	        {
	          "ErrorEquals": [
	            "FaceAlreadyExistsError"
	          ],
	          "ResultPath": "$.errorInfo",
	          "Next": "PhotoDoesNotMeetRequirement"
	        }
	      ]
	    }
	  }
	}
	```
	</p></details>

1. AWS Step Functions 콘솔로 돌아가서, 업데이트 된 JSON 정의를 복사해서 붙여넣고 새로운 상태 머신인 `RiderPhotoProcessing-2` 를 생성하십시오:

	![상태 머신을 만들기](./images/create-machine-with-dedup.png)

	> **참고**: AWS Step Functions 상태 머신은 변경 불가능합니다. 따라서, 상태 머신 정의를 변경하려고 할 때 마다 항상 새 상태 머신을 만들어야 합니다. 
	
1. 이전에 사용한 테스트 입력을 사용하여 새 상태 머신을 테스트하십시오:

	```JSON
	{
	  "userId": "user_a",
	  "s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	  "s3Key": "1_happy_face.jpg"
	} 
	```
	사진의 얼굴을 Rekognition 컬렉션에 색인화하기위한 단계를 아직 추가하지 않았으므로, 이 시점에서 `CheckFaceDuplicate` 단계가 항상 성공합니다. 


</p></details>

### 5. 병렬 처리 (parallel processing) 단계 추가

업로드 된 사진이 `FaceDetection` 와 `CheckFaceDuplicate` 단계를 통과하면, 라이더의 얼굴을 색인화하고 사진의 크기를 조정하여 앱에 표시할 수 있습니다. AWS Step Functions에 Parallel 상태를 추가 할 것 입니다. 

얼굴 인덱스를 수행하고 축소판을 생성하는 두 개의 AWS Lambda 함수의 ARN은 AWS 람다 함수의 ARN은 AWS CloudFormation 출력의 `IndexFaceFunctionArn` 와 `ThumbnailFunctionArn` 에서 각각 찾을 수 있습니다. 

<img src="./images/3rd-state-machine-graph.png" width="60%">

<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>

1. `rider-photo-state-machine.json` 파일을 편집하여 워크 플로우에 병렬 단계 (두개의 하위 단계가 있음) 를 추가하십시오. 

   우선, `CheckFaceDuplicate` 상태 다음에 새로운 상태인 `ParallelProcessing` 를 추가하십시오. 또한 다음 사항을 확인하십시오:
   
   *   `REPLACE_WITH_IndexFaceFunctionArn` 를 AWS CloudFormation 의 output 정보 중에서 `IndexFaceFunctionArn` 로 변경하십시오.
   *   `REPLACE_WITH_ThumbnailFunctionArn` 를 AWS CloudFormation 의 output 정보 중에서 `ThumbnailFunctionArn` 로 변경하십시오. 

	```JSON
    ,
    "ParallelProcessing": {
      "Type": "Parallel",
      "Branches": [
        {
          "StartAt": "AddFaceToIndex",
          "States": {
            "AddFaceToIndex": {
              "Type": "Task",
              "Resource": "REPLACE_WITH_IndexFaceFunctionArn",
              "End": true
            }
          }
        },
        {
          "StartAt": "Thumbnail",
          "States": {
            "Thumbnail": {
              "Type": "Task",
              "Resource": "REPLACE_WITH_ThumbnailFunctionArn",
              "End": true
            }
          }
        }
      ],
	   "ResultPath": "$.parallelResult",
      "End": true
    }
	```
	
1. `CheckFaceDuplicate` 상태에서 상태 머신의 종료 상태로 표시하는 라인을 찾으십시오.

	```JSON
	     	 "End": true,

	```
	그리고 아래와 같이 변경하십시오
	
	```JSON
      		"Next": "ParallelProcessing",

	```
	`CheckFaceDuplicate` 상태가 성공적으로 실행되면, AWS Step Functions 에 알려주고, 프로세스 다음 단계로 `ParallelProcessing` 상태를 실행합니다. 

1. 이 시점에서, 여러분의 `rider-photo-state-machine.json` 파일은 다음과 같이 보일것입니다. (AWS Lambda ARN은 예제입니다): 
	
	<details>
	<summary><strong>(펼치면 보여집니다)</strong></summary><p>

	```JSON
	{
	  "Comment": "Rider photo processing workflow",
	  "StartAt": "FaceDetection",
	  "States": {
	    "FaceDetection": {
	      "Type": "Task",
	      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-FaceDetectionFunction-4AYSKX2EGPV0",
	      "ResultPath": "$.detectedFaceDetails",
	      "Next": "CheckFaceDuplicate",
	      "Catch": [
	        {
	          "ErrorEquals": [
	            "PhotoDoesNotMeetRequirementError"
	          ],
	          "ResultPath": "$.errorInfo",
	          "Next": "PhotoDoesNotMeetRequirement"
	        }
	      ]
	    },
	    "PhotoDoesNotMeetRequirement": {
	      "Type": "Task",
	      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-NotificationPlaceholderFunct-CDRLZC8BRFWP",
	      "End": true
	    },
	    "CheckFaceDuplicate": {
	      "Type": "Task",
	      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-FaceSearchFunction-1IT67V4J214DC",
	      "ResultPath": null,
	      "Next": "ParallelProcessing",
	      "Catch": [
	        {
	          "ErrorEquals": [
	            "FaceAlreadyExistsError"
	          ],
	          "ResultPath": "$.errorInfo",
	          "Next": "PhotoDoesNotMeetRequirement"
	        }
	      ]
	    },
	    "ParallelProcessing": {
	      "Type": "Parallel",
	      "Branches": [
	        {
	          "StartAt": "AddFaceToIndex",
	          "States": {
	            "AddFaceToIndex": {
	              "Type": "Task",
	              "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-IndexFaceFunction-15658V8WUI67V",
	              "End": true
	            }
	          }
	        },
	        {
	          "StartAt": "Thumbnail",
	          "States": {
	            "Thumbnail": {
	              "Type": "Task",
	              "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-ThumbnailFunction-A30TCJMIG0U8",
	              "End": true
	            }
	          }
	        }
	      ],
	      "ResultPath": "$.parallelResult",
	      "End": true
	    }
	  }
	}
	```
	</p></details>

1. AWS Step Functions 콘솔로 돌아가서, 업데이트 된 JSON 정의를 복사한뒤 붙여넣어서 새로운 상태 머신인 `RiderPhotoProcessing-3` 를 생성하십시오:

	![병렬 단계로 상태 머신 만들기](./images/create-machine-with-parallel.png)

	> **참고**: AWS Step Functions 상태 머신은 변경 불가능합니다. 따라서, 상태 머신 정의를 변경하려고 할 때 마다 항상 새 상태 머신을 만들어야 합니다.
	
1. 이전에 사용한 테스트 입력을 사용하여 새 상태 머신을 테스트하십시오. :

	```JSON
	{
	  "userId": "user_a",
	  "s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	  "s3Key": "1_happy_face.jpg"
	} 
	```

1. 마지막 단계가 성공하면, AWS CLI 를 사용하여 Rekognition 컬렉션에서 색인이 생성된 얼굴 목록을 확인할 수 있습니다 (`REPLACE_WITH_YOUR_CHOSEN_AWS_REGION` 부분을 선택한 지역의 지역 문자열로 대체하십시오):

	```
	aws rekognition list-faces --collection-id rider-photos --region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION
	```
	
	> `delete-faces` 명령은 테스트 할 때 유용합니다:

	```
	aws rekognition delete-faces --collection-id rider-photos --face-ids REPLACE_WITH_ID_OF_FACE_TO_DELETE --region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION
	```

1. 또한 Amazon S3 Console 을 이용해서 AWS CloudFormation 에서 만든 Amazon S3 버킷을 확인해서 크기가 조정된 썸네일 이미지를 저장할 수 있습니다. 버킷에서 축소된 썸네일 이미지를 찾아야합니다.

	> S3 버킷의 이름은 AWS CloudFormation output 정보에서 `ThumbnailS3Bucket` 로 찾을 수 있습니다. S3 콘솔에서 `wildrydes-step-module-resources-thumbnails3bucket` 로 검색해도 됩니다.

1. 다른 `userId` 지만 동일한 s3key 와 s3bucket 매개 변수를 사용하는 새 워크 플로를 시작하면 어떻게 됩니까?  


</p></details>

### 6. 메타 데이터 지속성 단계 추가

우리의 이미지 처리 워크 플로의 마지막 단계는 프로필 사진의 메타 데이터를 사용자 프로필로 유지하는것입니다.

메타 데이터를 지속시키는 AWS Lambda 함수의 ARM은 AWS CloudFormation output 의 `PersistMetadataFunctionArn` 에서 찾을 수 있습니다.

<img src="./images/4th-state-machine-graph.png" width="60%">


<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>

1. `rider-photo-state-machine.json` 파일을 편집하여 최종 영속성 단계를 추가하십시오. 
 
   먼저, `ParallelProcessing` 상태 다음에 새로운 상태인 `PersistMetadata` 를 추가하십시오. 또한 다음 사항을 확인하십시오:
   
   * `REPLACE_WITH_PersistMetadataFunctionArn` 를 AWS CloudFormation output 정보의  `PersistMetadataFunctionArn ` 로 변경하십시오.

	```JSON
	    ,
	    "PersistMetadata": {
	      "Type": "Task",
	      "Resource": "REPLACE_WITH_PersistMetadataFunctionArn",
	      "ResultPath": null,
	      "End": true
	    }

	```

1. `ParallelProcessing` 상태에서 종료 상태로 표시하는 행을 찾으십시오.

	```JSON
	     	 "End": true

	```
	그리고 아래와 같이 변경하십시오
	
	```JSON
      		"Next": "PersistMetadata"

	```
	> **참고**: 병렬 상태에 있는 개별 브랜치 레벨이 아닌 `ParallelProcessing` 레벨에서 `"End"` 라인을 편집할 때 주의하십시오. 
	
	이것은 `ParallelProcessing` 상태가 성공적으로 실행되면 AWS Step Functions 에 알려주고 프로세스의 다음 단계로 `PersistMetadata` 상태를 실행합니다. 

1. 이 시점에서, `rider-photo-state-machine.json` 파일은 다음과 같이 보일것입니다 (AWS Lambda ARN은 예제입니다): 
	<details>
	<summary><strong>(펼치면 보여집니다)</strong></summary><p>

	```JSON
	{
	  "Comment": "Rider photo processing workflow",
	  "StartAt": "FaceDetection",
	  "States": {
	    "FaceDetection": {
	      "Type": "Task",
	      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-FaceDetectionFunction-4AYSKX2EGPV0",
	      "ResultPath": "$.detectedFaceDetails",
	      "Next": "CheckFaceDuplicate",
	      "Catch": [
	        {
	          "ErrorEquals": [
	            "PhotoDoesNotMeetRequirementError"
	          ],
	          "ResultPath": "$.errorInfo",
	          "Next": "PhotoDoesNotMeetRequirement"
	        }
	      ]
	    },
	    "PhotoDoesNotMeetRequirement": {
	      "Type": "Task",
	      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-NotificationPlaceholderFunct-CDRLZC8BRFWP",
	      "End": true
	    },
	    "CheckFaceDuplicate": {
	      "Type": "Task",
	      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-FaceSearchFunction-1IT67V4J214DC",
	      "ResultPath": null,
	      "Next": "ParallelProcessing",
	      "Catch": [
	        {
	          "ErrorEquals": [
	            "FaceAlreadyExistsError"
	          ],
	          "ResultPath": "$.errorInfo",
	          "Next": "PhotoDoesNotMeetRequirement"
	        }
	      ]
	    },
	    "ParallelProcessing": {
	      "Type": "Parallel",
	      "Branches": [
	        {
	          "StartAt": "AddFaceToIndex",
	          "States": {
	            "AddFaceToIndex": {
	              "Type": "Task",
	              "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-IndexFaceFunction-15658V8WUI67V",
	              "End": true
	            }
	          }
	        },
	        {
	          "StartAt": "Thumbnail",
	          "States": {
	            "Thumbnail": {
	              "Type": "Task",
	              "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-ThumbnailFunction-A30TCJMIG0U8",
	              "End": true
	            }
	          }
	        }
	      ],
	      "ResultPath": "$.parallelResult",
	      "Next": "PersistMetadata"
	    },
	    "PersistMetadata": {
	      "Type": "Task",
	      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:wild-ryde-step-module-PersistMetadataFunction-9PDCT2DT7K70",
	      "ResultPath": null,
	      "End": true
	    }
	  }
	}	
	```
	</p></details>

1. AWS Step Functions 콘솔로 돌아가서, 업데이트 된 JSON 정의를 복사 후 붙여넣기 해서 새로운 `RiderPhotoProcessing-4` 상태 머신을 생성하십시오:

	![지속성 단계가 있는 상태 시스템 만들기](./images/create-machine-with-persistence.png)
	
1. 테스트 입력으로 새 상태머신을 테스트하십시오:

	```JSON
	{
	  "userId": "user_a",
	  "s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	  "s3Key": "1_happy_face.jpg"
	} 
	```
	
	이전 상태 머신을 테스트 할 때 이미 인덱싱된 이미지를 참조하면, 실행시 다음과 같이 `CheckFaceDuplicate` 단계를 실패합니다:
	![이미 색인 된 얼굴](./images/already-indexed-face.png)

	여러분은 `aws rekognition list-faces` 와 `aws rekognition delete-faces` 명령어를 사용해서 테스트하는 동안 이전에 인덱스 된 얼굴 정보를 정리할 수 있습니다. `RiderPhotoS3Bucket` 에 다른 사진을 업로드 하고 새로운 사진의 s3 키를 사용해서 테스트 할 수도 있습니다. 
	
	
</p></details>

## 구현한 내용 검사하기

1. 제공된 여러가지 테스트 이미지를 사용하여 최종 상태머신 (`RiderPhotoProcessing-4`) 을 테스트 하십시오 

	선글라스가 있는 사진:

	```JSON
	{
	  "userId": "user_b",
	  "s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	  "s3Key": "2_sunglass_face.jpg"
	} 
	```

	여러개의 얼굴이 있는 사진:
	
	```JSON
	{
	  "userId": "user_c",
	  "s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	  "s3Key": "3_multiple_faces.jpg"
	} 
	```
	
	얼굴이 없는 사진:

	```JSON
	{
	  "userId": "user_d",
	  "s3Bucket": "REPLACE_WITH_YOUR_BUCKET_NAME",
	  "s3Key": "4_no_face.jpg"
	} 
	```
	
1. S3에 대한 사진을 업로드하고, 일부 실행을 테스트하십시오. 동일한 사람의 사진이 두 개 이상인 경우 둘 다 업로드하고 각 사진에서 워크 플로를 실행하십시오. (테스트 입력에서는 서로 다른 `userId` 필드를 사용해야 합니다). **CheckFaceDuplicate** 단계가 동일한 얼굴이 두 번 이상 색인되지 않도록 합니다. 

1. Amazon DynamoDB 콘솔로 이동하여, "wildrydes-step-module-resources-RiderPhotoDDBTable" 로 시작하는 이름의 테이블을 찾습니다. (CloudFormation 스택 output 정보에서도 테이블 이름을 찾을 수 있습니다). 테이블에 표시되는 항목을 확인하십시오. 
	
	![](./images/dynamodb_example.png)

1. Amazon S3 콘솔로 이동하여 처리한 사진의 썸네일 이미지가 썸네일 S3 버킷에 있는지 확인하십시오. 

이제 AWS Step Functions 를 사용하여 다단계 이미지 처리 워크 플로우를 구축했습니다! 워크 플로우는 앞부분에 AWS API Gateway 를 사용하거나 Amazon S3 업로드 이벤트에서 트리거해서 어플리케이션에 통합 할 수 있습니다.  

## 추가 크레딧
**PhotoDoesNotMeetRequirement** 단계의 의도는 프로필 사진 확인이 실패해서 다른 사진을 업로드 하려고 시도할 수 있음을 사용자에게 알리는 것입니다. 현재 알림을 실제로 보내지 않고 단순히 메시지를 반환하는 AWS Lambda 함수인  `NotificationPlaceholderFunction` 를 사용하고 있습니다.Amazon Simple Email Service (SES) 를 사용하여 Lambda 함수에서 전자 메일 알림을 전송하도록 구현합니다. 

## 자원 삭제 !!중요!! 

1. AWS Step Functions 콘솔에서 `RiderPhotoProcessing-*` 상태 머신을 삭제하십시오.

	<details>
	<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>
	
	AWS Step Functions Management 콘솔에서, **Dashboard** 로 이동해서, 삭제할 상태 머신을 선택한다음, **Delete** 를 클릭하십시오.
	
	![상태 머신 삭제하기](./images/delete-machines.png) 
	
	</p></details>

1. 라이더 이미지와 썸네일 이미지를 저장하는데 사용되는 Amazon S3 버킷을 비웁니다.

	<details>
	<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>
	
	1. Amazon S3 Management 콘솔에서, S3 버킷 옆에 있는 ![](./images/bucket-icon.png) 아이콘을 클릭하십시오. (S3 버킷의 이름은 `wildrydes-step-module-resource-riderphotos3bucket-7l698ggkdcf3` 와 비슷합니다).
	 
		![버킷 선택](./images/s3-console-select-bucket.png) 
	1. **Empty Bucket** 버튼을 선택하십시오.
	
		![버킷 비우기](./images/s3-console-empty-bucket.png)
		
	1. 버킷 이름을 팝업 상자에 복사/붙여넣기 한 다음, **Confirm** 을 클릭하십시오.
	
		![버킷 비우기](./images/s3-empty-bucket-dialog.png)
		
	1. 단계를 반복하여 썸네일 이미지를 저장하는데 사용되는 Amazon S3 버킷을 비웁니다 (S3 버킷의 이름은 `wildrydes-step-module-resources-thumbnails3bucket-1j0t3m28k7mxo` 와 비슷합니다).

	</p></details>

1. AWS Lambda 함수, Amazon S3 버킷 및 Amazon DynamoDB 테이블을 시작한 `wildrydes-step-module-resources` AWS CloudFormation 스택을 삭제하십시오.

	<details>
	<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>
	
	1. AWS CloudFormation Management 콘솔에서, `wildrydes-step-module-resources` 스택을 선택하십시오.
	
 	1. **Actions** 드랍다운 메뉴 아래의 **Delete Stack** 를 선택하십시오.
 	
		![cloudformation 스택 삭제](./images/cloudformation-delete.png)
	
	1. **Yes, Delete** 를 클릭하십시오.
	
	</p></details>
	
1. Amazon Rekognition 컬렉션을 삭제합니다.

	<details>
	<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>
	
	1. `REPLACE_WITH_YOUR_CHOSEN_AWS_REGION` 부분을 사용한 AWS 리전으로 변경한뒤에 터미널 화면에서 다음 명령을 실행하십시오. 

			aws rekognition delete-collection --region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION --collection-id rider-photos
	
		예를 들면 다음과 같습니다:
	
			aws rekognition delete-collection --region us-east-1 --collection-id rider-photos
			aws rekognition delete-collection --region us-west-2 --collection-id rider-photos
			aws rekognition delete-collection --region eu-west-1 --collection-id rider-photos
	
	
	2. 성공한 경우, 다음과 같은 서비스에서 확인을 받아야 합니다:

		```JSON
		{
	    	"StatusCode": 200
		}
		```
	
	</p></details>
