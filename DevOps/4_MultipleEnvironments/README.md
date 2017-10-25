# 모듈 4: 다중 환경의 CI/CD 파이프라인(Multiple Environment CI/CD Pipeline)

이번 모듈에서는 이전 [Module 2](../2_ContinuousDeliveryPipeline/README.md)에서 생성한 [AWS CodePipeline](https://aws.amazon.com/codepipeline/)에 테스트 및 베타 환경을 추가하여 다중 환경의 파이프라인으로 업그레이드 하도록 하겠습니다.

## 테스트 환경 통합 개요

파이프라인에 테스트를 통합하기 위해서는 테스트 어플리케이션을 기존 Unicorn API에 새롭게 도입을 해야 합니다. Unicorn API와 마찬가지로 테스트 어플리케시션 또한 Lambda 함수와 SAM CloudFormation 템플레이트(`test-sam.yaml`) 로 이루어져 있습니다. 기존의 Unicorn API의 Lambda 함수 및 SAM 템플레이트 업데이트 뿐만아니라 추가적으로 [AWS CodeBuild](https://aws.amazon.com/codebuild/)의 `buildspec.yml`도 기존 배포와 더불어 테스트 어플리케이션을 지원하도록 명령어들이 변경 되었습니다. 새로운 명령어들은 테스트에 필요한 종속 패키지들을 설치, SAM 템플레이트를 패키징, 일련의 과정을 거쳐 생성되는 SAM 테스트 템플레이트를 프로젝트 결과물에 추가를 하도록 구성 되어 있습니다.

통합 테스트에는 API 테스트를 위해 [hippie](https://github.com/vesln/hippie) 라이브러리를 사용합니다. [hippie](https://github.com/vesln/hippie)는 DSL를 이용하여 HTTP 요청 쉽게 표현 할 수 있도록 합니다. `test/test.js` 파일에는 Javascript Promises를 연결시켜 사용하여 Unicorn API REST 자원들을 테스트 할 수 있도록 여러 요청들이 정의 되어 있습니다. 아래의 코드는 Promises를 연결시켜 테스트를 실행하는 코드의 일부 입니다. 만약 모든 테스트가 성공적으로 완료 되었다면 삽입된 CodePipeline **Job Id**에게 성공하였음을 콜백을 이용하여 보내어 CodePipeline로 하여금 다음 단계로 진행하도록 구성되어 있습니다. 만약 하나의 테스트라도 실패한다면 실패 콜백을 보내어 CodePipeline 진행을 멈추도록 설계 되어 있습니다.

```javascript
exports.lambda_handler = (event, context, callback) => {
  var api = event.api_url + '/unicorns/';
  var unicorn = build_unicorn();

  Promise.resolve()
    .then(result => {
      return list_unicorns(api, unicorn);
    })
    .then(result => {
      return update_unicorn(api, unicorn);
    })
    .then(result => {
      return view_unicorn_found(api, unicorn);
    })
    .then(result => {
      return view_unicorn_not_found(api, unicorn);
    })
    .then(result => {
      return remove_unicorn(api, unicorn);
    })
    .then(result => {
      console.log('SUCCESS');
      complete_job(event.job_id, result, callback);
    })
    .catch(reason => {
      console.log('ERROR: ' + reason.test_name + ' | ' + reason.message);
      fail_job(event.job_id, reason, context.invokeid, callback);
    });
};
```

`test.js` 스크립트는 API 통합 테스트를 실행하는데 중점적으로 맞추어져 있습니다. `test/setup.js` 스크립트 CloudFormation 스택으로 부터 자동적으로 API URL를 응답받아 `test.js`로 하여금 테스트를 수행할 수 있도록 합니다. API URL를 확인이 되면 `setup.js`는 `test.js` Lambda 함수에게 CodePipeline **Job Id**와 **API URL**를 삽입한뒤 async하게 호출합니다. 아래는 코드의 일부 입니다.

```javascript
exports.lambda_handler = (event, context, callback) => {
  var job_id = event["CodePipeline.job"].id;
  var stack_name = event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters;

  get_api_url(stack_name).then(function(api_url) {
    return invoke_test(job_id, api_url);
  }).catch(function(err) {
    fail_job(job_id, err, context.invokeid, callback);
  });
};
```

## CodePipeline 개요

이번 모듈에서는 모듈 2에서 빌드와 배포 단계로 생성한 CodePipeline를 업데이트 할 것 입니다. 배포 단계와 마찬가지로 테스트 단계는 두개의 세부 Action으로 구성되어 있습니다. 테스트에 필요한 SAM 템플레이트를 CodeBuild를 통해 생성 하고 CloudFormation Change Set을 실행하여 테스트에 필요한 Lambda 함수를 새로운 CloudFormation 스택으로 배포 하도록 구성 되어 있습니다.

테스트 단계 이어서 여러분은 두개의 세부 Action으로 구성되어 있는 베타 단계를 추가 할 것 입니다. Unicron API를 새로운 환경에서 테스트를 하기 위한 CloudFormation 스택을 생성하고 이 환경이 배포가 완료되면 Lambda 함수를 호출하여 테스트 어플리케이션으로 하여금 베타 환경에 통합 테스트를 수행하도록 할 것 입니다. 만약 테스트가 성공적으로 완료되면 Unicorn API의 변경 사항을 배포 환경에 적용 할 것 입니다.

아래는 최종적으로 완료된 CodePipeline의 모습입니다:

![Wild Rydes Unicorn API Continuous Delivery Pipeline](images/codepipeline-final.png)

## 구현 지침

본 모듈은 여러 섹션으로 구성되어 있으며 매 섹션 시작에는 개괄적인 개요가 준비되어 있습니다. 섹션 마다 구현을 위한 자세한 내용은 단계별 지침안에서 확인 하실 수 있으십니다. 이미 AWS Management Console에 익숙하시거나 둘러보기를 거치지 않고 직접 서비스를 탐색하시려는 분들을 위해 구현을 완료하는 데 필요한 내용을 각 섹션의 개요에서 제공하고 있습니다.

최신 버젼의 크롬, 파이어폭스, 사파리 웹 브라우저를 사용하신다면 **단계별 지침**을 클릭하셔서 자세한 내용을 확인하시기 바랍니다.

### 1. CodeStar IAM Role 업데이트

CodeStar는 AWS 자원 접근을 제어하는 IAM 역활과 정책을 생성합니다. 이번 모듈에서는 CodePipeline이 새로운 배포 환경과 서버리스 유닛 테스트 파이프라인을 사용자 맞춤형식으로 추가 할 수 있도록 IAM Managed 정책을 IAM 역할에 추가하고 권한을 부여 하도록 하겠습니다.

#### 1a. `CodeStarWorker-uni-api-Lambda` IAM 역할 업데이트

1. AWS Management 콘솔에서 **Services**를 선택한 다음 Security, Identity & Compliance 아래 **IAM**를 선택하십시오.

1. 왼쪽 네비게이션바에서 **Roles** 을 선택하고 **Filter** 입력란에 `CodeStarWorker-uni-api-Lambda`를 입력하고 해당 역할 옆의 확인란을 선택하십시오.

    ![Select Role](images/role1-1.png)

1. 역할 요약 페이지에서 **Permissions** 탭에서 **Managed Policies** 영역의 **Attach Policy** 버튼을 클릭하십시오.

    ![Role Details](images/role1-2.png)

1. **Filter** 입력 란에 `AWSCodePipelineCustomActionAccess`을 입력한뒤 **AWSCodePipelineCustomActionAccess**의 좌측 체크 박스를 선택 하시기 바랍니다.

    ![Attach Policy](images/role1-3.png)

1. **Filter** 입력 란에 `AWSCloudFormationReadOnlyAccess`을 입력한뒤 **AWSCloudFormationReadOnlyAccess**의 좌측 체크 박스를 선택 하시기 바랍니다.

    ![Attach Policy](images/role1-4.png)

1. **Filter** 입력 란에 `AmazonDynamoDBFullAccess`을 입력한뒤  **AmazonDynamoDBFullAccess**의 좌측 체크 박스를 선택하고 **Attach Policy** 버튼을 클릭하십시오.

    ![Attach Policy](images/role1-5.png)

1. **Filter** 입력 란에`AWSLambdaRole` 을 입력한뒤 **AWSLambdaRole**의 좌측 체크 박스를 선택하고 **Attach Policy** 버튼을 클릭하십시오.

    ![Attach Policy](images/role1-6.png)

1. 역할 요약 페이지에서 **Managed Policies** 리스트에 **AWSCodePipelineCustomActionAccess**, **AWSCloudFormationReadOnlyAccess**, **AWSLambdaRole** 정책이 추가가 되어 있는 것을 확인 하실 수 있습니다.

    ![Policy Attached](images/role1-7.png)

#### 1b. `CodeStarWorker-uni-api-CodePipeline` IAM 역할 업데이트

1. AWS Management 콘솔에서 **Services**를 선택한 다음 Security, Identity & Compliance 아래 **IAM**를 선택하십시오.

1. 왼쪽 네비게이션바에서 **Roles** 을 선택하고 **Filter** 입력란에 `CodeStarWorker-uni-api-CodePipeline`를 입력하고 해당 역할 옆의 확인란을 선택하십시오.

    ![Select Role](images/role2-1.png)

1. 역할 요약 페이지에서 **Permissions** 탭에서 **Managed Policies** 영역의 **Attach Policy** 버튼을 클릭하십시오.

    ![Role Details](images/role2-2.png)

1. **Filter** 입력 란에 `AWSCodePipelineReadOnlyAccess`을 입력한뒤 **AWSCodePipelineReadOnlyAccess**의 좌측 체크 박스를 선택 하시기 바랍니다.

    ![Attach Policy](images/role2-3.png)

1. **Filter** 입력 란에 `AWSLambdaRole`을 입력한뒤 **AWSLambdaRole**의 좌측 체크 박스를 선택하고 **Attach Policy** 버튼을 클릭하십시오.

    ![Attach Policy](images/role2-5.png)

1. 역할 요약 페이지에서 **Managed Policies** 리스트에 **AWSCodePipelineReadOnlyAccess**와 **AWSLambdaRole** 정책이 추가가 되어 있는 것을 확인 하실 수 있습니다.

    ![Policy Attached](images/role2-6.png)

#### 1c. `CodeStarWorkerCodePipelineRolePolicy` IAM 정책 업데이트

1. **Inline Policies** 섹션에서 `CodeStarWorkerCodePipelineRolePolicy`의 **Edit Policy**를 클릭하시기 바랍니다.

    ![Policy Attached](images/role2-7.png)

1. 허용하는 CloudFormation Resource(자원) 패턴 부분을 아래와 같이 업데이트를 하시기 바랍니다. (여러분의 리전, AccountId를 입력하시기 바랍니다.) 입력을 하셨다면 **Apply Policy**를 클릭 하시기 바랍니다.

    변경 전: `arn:aws:cloudformation:{region}:{accountId}:stack/awscodestar-uni-api-lambda/*`

    변경 후: `arn:aws:cloudformation:{region}:{accountId}:stack/awscodestar-uni-api-lambda*`

    ![Policy Attached](images/role2-8.png)

### 2. `uni-api` CodeCommit 깃 저장소 시작 하기

1. 각각의 모듈은 해당 워크숍 진행에 필요한 소스 코드와 CodeStar 및 CodeCommit 깃 저장소와 연동이 되어 있습니다. 깃 저장소를 시작하기 위해서는 여러분이 선택하신 리전의 **Launch Stack** 버튼을 클릭 하여 주시기 바랍니다.

    Region| Launch
    ------|-----
    US East (N. Virginia) | [![Launch Module 4 in us-east-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?stackName=Seed-4-MultipleEnvironments&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-us-east-1/codecommit-template.yml&param_sourceUrl=https://s3.amazonaws.com/fsd-aws-wildrydes-us-east-1/uni-api-4.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=us-east-1)
    US West (N. California) | [![Launch Module 4 in us-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-1#/stacks/create/review?stackName=Seed-4-MultipleEnvironments&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-us-west-1/codecommit-template.yml&param_sourceUrl=https://s3-us-west-1.amazonaws.com/fsd-aws-wildrydes-us-west-1/uni-api-4.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=us-west-1)
    US West (Oregon) | [![Launch Module 4 in us-west-2](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/create/review?stackName=Seed-4-MultipleEnvironments&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-us-west-2/codecommit-template.yml&param_sourceUrl=https://s3-us-west-2.amazonaws.com/fsd-aws-wildrydes-us-west-2/uni-api-4.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=us-west-2)
    EU (Ireland) | [![Launch Module 4 in eu-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/create/review?stackName=Seed-4-MultipleEnvironments&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-eu-west-1/codecommit-template.yml&param_sourceUrl=https://s3-eu-west-1.amazonaws.com/fsd-aws-wildrydes-eu-west-1/uni-api-4.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=eu-west-1)
    EU (Frankfurt) | [![Launch Module 4 in eu-central-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/create/review?stackName=Seed-4-MultipleEnvironments&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-eu-central-1/codecommit-template.yml&param_sourceUrl=https://s3-eu-central-1.amazonaws.com/fsd-aws-wildrydes-eu-central-1/uni-api-4.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=eu-central-1)
    Asia Pacific (Sydney) | [![Launch Module 4 in ap-southeast-2](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/create/review?stackName=Seed-4-MultipleEnvironments&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-ap-southeast-2/codecommit-template.yml&param_sourceUrl=https://s3-ap-southeast-2.amazonaws.com/fsd-aws-wildrydes-ap-southeast-2/uni-api-4.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=ap-southeast-2)

1. CloudFormation 템플레이트는 이번 모듈을 진행하는데 있어서 필요한 항목들이 사전에 정의 되어 있습니다.

1. **I acknowledge that AWS CloudFormation might create IAM resources.** 체크 박스를 체크 하여 주시기 바랍니다. CloudFormation에 여러분을 대신하여 스택 생성에 필요한 IAM 자원을 생성 할 수 있도록 권한 부여를 허락함을 의미 합니다.

1. 브라우저창의 우측 하단의 **Create** 버튼을 클릭하여 주시기 바랍니다. 이번 모듈에 필요한 CloudFormation 스택을 생성 및 CodeCommit 저장소를 생성합니다.

    ![Seed Repository CloudFormation Stack Review](images/seed-repository-1.png)

1. 깃 저장소에 새로운 코드로 준비되기 까지는 약간의 지연이 발생 할 수 있습니다. 만약 모든 것이 성공적으로 생성이 되었다면 CloudFormation의 상태는 ``CREATE_COMPLETE`` 이어야 합니다.

    ![CloudFormation Stack Creation Complete](images/seed-repository-2.png)

### 3. CodeCommit 깃 저장소로 부터 Fetch 하기

새로운 코드가 추가된 CodeCommit 깃 저장소가 생성되었습니다. 코드를 수정 할 수 있도록 이 저장소의 변경사항을 여러분의 로컬 깃 저장소로 복사할 것 입니다. 일반적으로 리모트 깃 저장소의 업데이트된 내용은 `git pull` 명령어로 수행할 수 있습니다. 하지만 이번 워크숍에서는 저장소의 history가 새롭게 생성 되었기 때문에 `git pull`이 아닌 다른명령어를 사용 하셔야 합니다.

여러분이 사용하시 편한 깃 클라이언트를 이용해서 아래 명령어 들을 여러분의 로컬 **uni-api** 깃 저장소에서 실행해 주시기 바랍니다.

* `git fetch --all`
* `git reset --hard origin/master`

### 4. Test 스테이지 추가하기

#### 4a. CodePipeline 수정하기

1. AWS Management 콘솔에서 **Services**를 선택한 다음 Developer Tools 섹션에서 **CodeStar** 를 선택하십시오.

1. `uni-api` 프로젝트를 선택 하십시오.

    ![CodeStar Project List](images/codestar-1.png)

1. 웹 브라우저 우측 **Continuous deployment** 타일 하단의 **AWS CodePipeline details** 링크를 클릭하시기 바랍니다.

    ![CodeStar App Endpoint](images/codestar-codepipeline-endpoint.png)

1. CodePipeline 페이지에서 **Edit**를 클릭하시기 바랍니다.

#### 4b. 테스트 스테이지 추가

1. **+Stage** 선택하셔서 Build 단계 아래 새로운 pipeline 단계를 생성하시기 바랍니다.

   ![CodePipeline Edit](images/codepipeline-edit.png)

1. **Stage Name**에 `Test`를 입력하시기 바랍니다.

#### 4c. 테스트 단계에 GenerateChangeSet Action 추가

1. `Test`아래에 `+Action`를 선택하여 새로운 Action을 추가 하시기 바랍니다.

1. **Add action** 화면에서 **Action category**로 `Deploy`를 선택하시기 바랍니다.

1. **Action name**에 `GenerateChangeSet`를 입력하시기 바랍니다.

1. **Deployment provider**로는 `AWS CloudFormation`를 선택하시기 바랍니다.

   ![CodePipeline Add Action](images/codepipeline-add-1.png)

1. **Action mode**으로는 `Create or replace a change set`를 선택하시기 바랍니다.

1. **Stack name**으로는 `awscodestar-uni-api-lambda-test`를 입력하시기 바랍니다.

1. **Change set name**으로는 `pipeline-changeset`를 입력하시기 바랍니다.

1. **Template**으로는 `uni-api-BuildArtifact::test-template-export.yml`를 입력하시기 바랍니다.

1. **Capabilities**으로는 `CAPABILITY_IAM`를 선택 하시기바랍니다.

1. **Role name**으로는 `CodeStarWorker-uni-api-CloudFormation`를 입력하시기 바랍니다.

1. **Advanced** 섹션을 열어 **Parameter overrides** 입력란에 `{ "ProjectId": "uni-api" }`를 입력하시기 바랍니다.

1. **Input artifacts #1**으로는 `uni-api-BuildArtifact`를 입력하시기 바랍니다.

   ![CodePipeline Add Action CloudFormation](images/codepipeline-add-2.png)

1. **Add Action**를 선택하여 완료하시기 바랍니다.

#### 4d. 테스트 단계에 ExecuteChangeSet Action 추가

1. `GenerateChangeSet`아래에 `+Action`를 선택하여 새로운 Action을 추가 하시기 바랍니다.

   ![CodePipeline Add Action](images/codepipeline-add2-1.png)

1. **Add action** 화면에서 **Action category**로 `Deploy`를 선택하시기 바랍니다.

1. **Action name**으로는 `ExecuteChangeSet`를 입력하시기 바랍니다.

1. **Deployment provider**으로는 `AWS CloudFormation`를 선택하시기 바랍니다.

   ![CodePipeline Add Action](images/codepipeline-add2-2.png)

1. **Action mode**으로는 `Execute a change set`를 선택하시기 바랍니다.

1. **Stack name**으로는 `awscodestar-uni-api-lambda-test`를 입력하시기 바랍니다.

1. **Change set name**으로는 `pipeline-changeset`를 입력하시기 바랍니다.

   ![CodePipeline Add Action](images/codepipeline-add2-3.png)

1. **Add Action**를 선택하여 완료하시기 바랍니다.

#### 4e. CodePipeline에 변경사항 저장

새로운 테스트 단계를 추가하였다면 여러분의 파이프라인은 아래 그림과 같을 것 입니다.

![CodePipeline Deploy Stage Complete](images/codepipeline-add2-complete.png)

1. 파이프라인의 상단으로 스크롤을 하신 다음 `Save pipeline changes`를 선택하시기 바랍니다.

1. `Save pipeline changes`를 클릭하신 다음 나타난 화면에서는 `Save and Continue`를 선택하시기 바랍니다.

## 테스트 단계 검증

파이프라인에 테스트 단계를 추가하였습니다. 추가한 테스트 단계가 정상적으로 실행 되는지 그리고 파이프라인이 정상적으로 완료가 되는지 검증을 하도록 하겠습니다.

### 1. 변경사항 적용하기

1. **Release change** 버튼을 선택하여 파이프라인을 시작 하도록 합니다.

1. 새로운 화면 창이 나타나면 **Release**를 선택 하시기 바랍니다.

### 2. CodePipeline 완료 확인

1. AWS Management 콘솔에서 **Services**를 선택한 다음 Developer Tools 섹션에서 **CodePipeline** 를 선택하십시오.

1. 파이프라인 목록에서 `uni-api-Pipeline`를 선택하시기 바랍니다.

1. 각 단계의 창의 색갈은 실행중일때 파란색으로 바뀌고 완료가 되면 녹색으로 바뀌는 것을 확인 하시기 바랍니다. 모든 단계를 성공적으로 마쳤다면 파이프 라인은 아래 화면과 같은 결과를 나타내야 합니다.

![Wild Rydes Unicorn API Continuous Delivery Pipeline](images/codepipeline-final-test.png)

## 베타 단계 추가

### 1. 베타 단계 추가

#### 1a. CodePipeline 수정

1. AWS Management 콘솔에서 **Services**를 선택한 다음 Developer Tools 섹션에서 **CodeStar** 를 선택하십시오.

1. `uni-api` 프로젝트를 선택 하십시오.

    ![CodeStar Project List](images/codestar-1.png)

1. 웹 브라우저 우측 **Continuous deployment** 타일 하단의 **AWS CodePipeline details** 링크를 클릭하시기 바랍니다.

    ![CodeStar App Endpoint](images/codestar-codepipeline-endpoint.png)

1. CodePipeline 페이지에서 **Edit** 버튼을 클릭 하시기 바랍니다.

#### 1b. 베타 단계 추가

1. **+Stage** 선택하셔서 Test 단계 아래 새로운 pipeline 단계를 생성하시기 바랍니다.

   ![CodePipeline Edit](images/codepipeline-edit-beta.png)

1. **Stage Name**으로는 `Beta`를 입력하시기 바랍니다.

#### 1c. 베타 단계에 GenerateChangeSet 추가

1. `Beta`아래에 `+Action`를 선택하여 새로운 Action을 추가 하시기 바랍니다.

1. **Add action** 화면에서 **Action category**로 `Deploy`를 선택하시기 바랍니다.

1. **Action name**으로는 `GenerateChangeSet`를 입력하시기 바랍니다.

1. **Deployment provider** 으로는 `AWS CloudFormation`를 선택하시기 바랍니다.

   ![CodePipeline Add Action](images/codepipeline-add-1.png)

1. **Action mode**으로는 `Create or replace a change set`를 선택하시기 바랍니다.

1. **Stack name**으로는 `awscodestar-uni-api-lambda-beta`를 입력하시기 바랍니다.

1. **Change set name**으로는 `pipeline-changeset`를 입력하시기 바랍니다.

1. **Template**으로는 `uni-api-BuildArtifact::template-export.yml`를 입력하시기 바랍니다.

1. **Capabilities**으로는 `CAPABILITY_IAM`를 선택하시기 바랍니다.

1. **Role name**으로는 `CodeStarWorker-uni-api-CloudFormation`를 입력하시기 바랍니다.

1. **Advanced** 섹션을 열어 **Parameter overrides** 입력란에 `{ "ProjectId": "uni-api", "CustomSuffix": "-beta" }`를 입력하시기 바랍니다.

1. **Input artifacts #1**으로는 `uni-api-BuildArtifact`를 입력하시기 바랍니다.

   ![CodePipeline Add Action Artifacts](images/codepipeline-add-3.png)

1. **Add Action**를 선택하여 완료하시기 바랍니다.

#### 1d. 베타 단계에 ExecuteChangeSet 추가

1. `GenerateChangeSet`아래에 `+Action`를 선택하여 새로운 Action을 추가 하시기 바랍니다.

   ![CodePipeline Add Action](images/codepipeline-add4-1.png)

1. **Add action** 화면에서 **Action category**로 `Deploy`를 선택하시기 바랍니다.

1. **Action name**으로는 `ExecuteChangeSet`를 입력하시기 바랍니다.

1. **Deployment provider**으로는 `AWS CloudFormation`를 선택하시기 바랍니다.

   ![CodePipeline Add Action](images/codepipeline-add2-2.png)

1. **Action mode**으로는 `Execute a change set`를 선택하시기 바랍니다.

1. **Stack name**으로는 `awscodestar-uni-api-lambda-beta`를 입력하시기 바랍니다.

1. **Change set name**으로는 `pipeline-changeset`를 입력하시기 바랍니다.

   ![CodePipeline Add Action](images/codepipeline-add4-3.png)

1. **Add Action**를 선택하여 완료하시기 바랍니다.

#### 1e. 베타 단계에 Invoke 추가

1. `ExecuteChangeSet`아래에 `+Action`를 선택하여 새로운 Action을 추가 하시기 바랍니다.

   ![CodePipeline Add Action](images/codepipeline-add4-2.png)

1. **Add action** 화면에서 **Action category**로 `Invoke`를 선택하시기 바랍니다.

1. **Action name**으로는 `InvokeLambdaTestFunction`를 입력하시기 바랍니다.

1. **Deployment provider**으로는 `AWS Lambda`를 선택하시기 바랍니다.

1. **Function name**으로는 `uni-api-test-setup`를 입력하시기 바랍니다.

1. **User parameters**으로는 `awscodestar-uni-api-lambda-beta` 를 입력하시기 바랍니다.

1. **Add Action**를 선택하여 완료하시기 바랍니다.

#### 1f. CodePipeline에 변경사항 저장

새로운 베타 단계를 추가하였다면 여러분의 파이프라인은 아래 그림과 같을 것 입니다.

![CodePipeline Deploy Stage Complete](images/codepipeline-add3-complete.png)

1. 파이프라인의 상단으로 스크롤을 하신 다음 `Save pipeline changes`를 선택하시기 바랍니다.

1. `Save pipeline changes`를 클릭하신 다음 나타난 화면에서는 `Save and Continue`를 선택하시기 바랍니다.

## 베타 단계 검증

파이프라인에 베타 단계를 추가하였습니다. 추가한 베타 단계가 정상적으로 실행 되는지와 변경사항이 정상적으로 배포가 되는지 확인해 보도록 하겠습니다.

### 1. 변경사항 적용하기

1. **Release change** 버튼을 선택하여 파이프라인을 시작 하도록 합니다.

1. 새로운 화면 창이 나타나면 **Release**를 선택 하시기 바랍니다.

### 2. CodePipeline 완료 확인

1. AWS Management 콘솔에서 **Services**를 선택한 다음 Developer Tools 섹션에서 **CodePipeline** 를 선택하십시오.

1. 파이프라인 목록에서 `uni-api-Pipeline`를 선택하시기 바랍니다.

1. 각 단계의 창의 색갈은 실행중일때 파란색으로 바뀌고 완료가 되면 녹색으로 바뀌는 것을 확인 하시기 바랍니다. `Beta` 단계의 `InvokeLambdaTestFunction` Action이 실패 하여 해당 단계에 빨간 불이 들어온 것을 확인 하실 수 있으며 아래와 같은 화면일 것 입니다.

   ![CodePipeline Beta Stage Fail](images/codepipeline-test-fail.png)

1. 실패한 Action에 대한 **Details** 링크를 선택하셔서 해당 실패에 대한 구체적인 정보를 확인 하시기 바랍니다.

   ![CodePipeline Beta Stage Fail Details](images/codepipeline-test-fail-details.png)

`test_list_unicorns` 통합이 실패 하였습니다. 다음 단계에서는 코드의 버그를 찾아 수정 하도록 하겠습니다.

## 버그 수정

### 1. 코드의 버그 수정하기

1. 여러분의 로컬 컴퓨터에서 `uni-api/app/list.js` 파일을 에디터로 열어 17번재 라인으로 이동하여 주시기 바랍니다. 아래는 코드의 일부 입니다.

   ```javascript
   docClient.scan(params, function(error, data) {
     // Comment or Delete the following line of code to remove simulated error
     error = Error("something is wrong");
   ```

1. 17번째 줄을 주석 처리 하시거나 삭제하여 코드의 버그를 수정 하시기 바랍니다.

1. `uni-api/app/list.js` 파일을 저장 하시기 바랍니다.

### 2. 변경 사항을 로컬 깃 레포지토리에 커밋 하기

1. 깃 클라이언트를 이용하여 로컬 변경 사항을 깃에 저장 하시고 커밋을 하시기 바랍니다. 예를 들면:

    ```bash
    git add .
    git commit -m "Fix bug"
    ```

1. 깃 클라이언트를 이용해서 업데이트 사항을 origin에 푸쉬 하시기 바랍니다. 예를 들면:

    ```bash
    git push origin
    ```

## 버그 수정 확인

1. AWS Management 콘솔에서 **Services**를 선택한 다음 Developer Tools 섹션에서 **CodePipeline** 를 선택하십시오.

1. 파이프라인 목록에서 `uni-api-Pipeline`를 선택하시기 바랍니다.

1. 각 단계의 창의 색갈은 실행중일때 파란색으로 바뀌고 완료가 되면 녹색으로 바뀌는 것을 확인 하시기 바랍니다. `Beta` 단계의 `InvokeLambdaTestFunction` Action이 성공 하여 해당 단계에 녹색 불이 들어온 것을 확인 하실 수 있으며 아래와 같은 화면일 것 입니다.

   ![CodePipeline Beta Stage Pass](images/codepipeline-test-pass.png)

모든 스테이지의 실행이 완료 되었다면 파이프 라인은 아래와 같은 화면 일 것입니다.

   ![Wild Rydes Unicorn API Continuous Delivery Pipeline](images/codepipeline-final.png)

## 완료

축하합니다! 여러분은 다중 환경의 CI/CD 파이프라인을 성공적으로 완료 하셨습니다.
