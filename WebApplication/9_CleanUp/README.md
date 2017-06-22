# 워크샵 정리 가이드(리소스 삭제)

이 페이지는 이전 모듈에서 작성된 자원을 정리하는 지시 사항을 제공합니다.

## 리소스 정리 지침

### 1. 모듈 4 정리방법
모듈 4에서 작성된 REST API 를 삭제하십시오. Amazon API Gateway 콘솔에서 API를 선택할 때 **Actions** 드롭 다운 메뉴에 **Delete API** 옵션이 있습니다.

<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>

1. AWS Management 콘솔에서, **Services** 를 클릭한 다음 Application Services 에서 **API Gateway** 를 선택하십시오.

1. 모듈 4에서 작성한 API 를 선택하십시오.

1. **Actions** 드롭 다운 메뉴를 펼쳐서 **Delete API** 를 선택하십시오.

1. 메시지가 표시되면 API 이름을 입력하고 **Delete API** 를 선택하십시오.

</p></details>


### 2. 모듈 3 정리방법
모듈 3에서 작성한 AWS Lambda 함수, IAM 역할 및 Amazon DynamoDB 테이블 삭제

<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>

#### Lambda Function

1. AWS Management 콘솔에서, **Services** 를 클릭한 다음 Compute 에서 **Lambda** 를 선택하십시오.

1. 모듈 3 에서 만든 `RequestUnicorn` 함수를 선택하십시오.

1. **Actions** 드롭 다운 메뉴에서, **Delete function** 을 선택하십시오.

1. 확인 메시지가 나타나면 **Delete** 를 선택하십시오.

#### IAM Role

1. AWS Management 콘솔에서, **Services** 를 클릭한 다음 Security, Identity & Compliance 에서 **IAM** 을 선택하십시오.

1. 네비게이션 메뉴에서 **Roles** 을 선택하십시오.

1. `WildRydesLambda` 를 필터 입력칸에 넣으십시오.

1. 모듈 3에서 작성한 역할(role)을 선택하십시오.

1. **Role actions** 드롭 다운 메뉴에서, **Delete role** 를 선택하십시오.

1. 확인 메시지가 나타나면 **Yes, Delete** 를 선택하십시오.

#### DynamoDB 테이블

1. AWS Management 콘솔에서 **Services** 를 클릭한 다음 Databases 에서 **DynamoDB** 를 선택하십시오.

1. 네비게이션 메뉴에서 **Tables** 를 선택하십시오.

1. 모듈 3 에서 생성한 **Rides** 테이블을 선택하십시오.

1. **Actions** 드롭 다운 메뉴에서 **Delete table** 을 선택하십시오.

1. **Delete all CloudWatch alarms for this table** 체크박스를 선택한 뒤에 **Delete** 를 선택하십시오.

</p></details>

### 3. 모듈 2 정리방법
제공된 AWS CloudFormation 템플릿을 사용해서 모듈 2를 완성한 경우, AWS CloudFormation 콘솔을 사용해서 스택을 삭제하기만 하면 됩니다. 그렇지 않다면, 모듈 2 에서 생성한 Amazon Cognito 사용자 풀을 삭제하십시오.

<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>

1. AWS Management 콘솔에서 **Services** 를 클릭한 다음 Mobile Services 에서 **Cognito** 를 선택하십시오.

1. **Manage your User Pools** 를 선택하십시오.

1. 모듈 2 에서 만든 **WildRydes** 를 선택합니다.

1. 페이지 오른쪽 위 모서리에 있는 **Delete Pool** 를 선택하십시오.

1. `delete` 를 입력하고 확인 메시지가 나타나면 **Delete Pool** 를 선택하십시오.

</p></details>

### 4. 모듈 1 정리방법
제공된 AWS CloudFormation 템플릿을 사용하려 모듈 1을 완성한 경우, AWS CloudFormation 콘솔을 사용하여 스택을 삭제하기만 하면 됩니다. 그렇지 않다면, 모듈 1 에서 생성한 Amazon S3 버킷을 삭제하십시오.

<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>

1. AWS Management 콘솔에서 **Services** 를 선택한 다음 Storage 에서 **S3** 를 선택하십시오.

1. 모듈 1 에서 작성한 버킷을 선택하십시오.

1. **Delete bucket** 을 선택하십시오.

1. 확인 메시지가 나타나면 버킷의 이름을 입력하고 확인(confirm)을 선택하십시오.

</p></details>


### 5. CloudWatch Logs
AWS Lambda 는 Amazon CloudWatch Logs 에 함수당 새로운 로그 그룹을 자동으로 생성하고 함수가 호출 될 때마다 로그를 기록합니다. **RequestUnicorn** 함수에 대한 로그 그룹을 삭제해야합니다. 또한 CloudFormation 스택으로 만든 경우, 해당 스택에 사용자 정의 리소스와 연관된 로그 그룹이 있어야 삭제 할 수 있습니다.

<details>
<summary><strong>단계별 지침 (자세한 내용을 보려면 펼쳐주세요)</strong></summary><p>

1. AWS Management 콘솔 에서 **Services** 를 클릭한 다음 Management Tools 에서 **CloudWatch** 를 선택하십시오.

1. 네비게이션 메뉴에서 **Logs** 를 선택하십시오.

1. **/aws/lambda/RequestUnicorn** 로그 그룹을 선택하십시오. 만약 계정에 로그 그룹이 여러개 있는 경우, 로그 그룹을 쉽게 찾으려면 **Filter** 입력칸에 `/aws/lambda/RequestUnicorn` 를 입력하면 됩니다.

1. **Actions** 드롭 다운 메뉴에서 **Delete log group** 를 선택하십시오.

1. 확인 메시지가 나타나면 **Yes, Delete** 를 선택하십시오.

1. 모듈을 완성하기 위해 CloudFormation 템플릿을 사용한 경우, `/aws/lambda/wildrydes-webapp` 로 시작하는 모든 로그 그룹에 대해 3~5 단계를 반복하십시오.

</p></details>
