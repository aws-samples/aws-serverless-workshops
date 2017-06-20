# 모듈 1: Amazon S3를 사용한 정적 웹호스팅

이 모듈에서는 Amazon Simple Storage Service (S3)가 웹 애플리케이션의 정적 리소스를 호스팅하도록 구성합니다. 이후 모듈에서는 JavaScript를 사용하여 AWS Lambda 및 Amazon API Gateway로 구축 된 원격 RESTful API를 호출하여 동적 기능을 페이지에 추가합니다.

이미 Amazon S3를 사용하고 있거나 Lambda 및 API Gateway 작업을 건너 뛰고 싶다면 선택한 지역에서 이러한 AWS CloudFormation 템플릿 중 하나를 시작하여 필요한 리소스를 자동으로 구축 할 수 있습니다.

region|Launch
------|-----
US East (N. Virginia) | [![Launch Module 1 in us-east-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=wildrydes-webapp-1&templateURL=https://s3.amazonaws.com/wildrydes-us-east-1/WebApplication/1_StaticWebHosting/webapp-static-hosting.yaml)
US East (Ohio) | [![Launch Module 1 in us-east-2](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=wildrydes-webapp-1&templateURL=https://s3.amazonaws.com/wildrydes-us-east-2/WebApplication/1_StaticWebHosting/webapp-static-hosting.yaml)
US West (Oregon) | [![Launch Module 1 in us-west-2](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=wildrydes-webapp-1&templateURL=https://s3.amazonaws.com/wildrydes-us-west-2/WebApplication/1_StaticWebHosting/webapp-static-hosting.yaml)
EU (Frankfurt) | [![Launch Module 1 in eu-central-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=wildrydes-webapp-1&templateURL=https://s3.amazonaws.com/wildrydes-eu-central-1/WebApplication/1_StaticWebHosting/webapp-static-hosting.yaml)
EU (Ireland) | [![Launch Module 1 in eu-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=wildrydes-webapp-1&templateURL=https://s3.amazonaws.com/wildrydes-eu-west-1/WebApplication/1_StaticWebHosting/webapp-static-hosting.yaml)
EU (London) | [![Launch Module 1 in eu-west-2](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-2#/stacks/new?stackName=wildrydes-webapp-1&templateURL=https://s3.amazonaws.com/wildrydes-eu-west-2/WebApplication/1_StaticWebHosting/webapp-static-hosting.yaml)
Asia Pacific (Tokyo) | [![Launch Module 1 in ap-northeast-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/new?stackName=wildrydes-webapp-1&templateURL=https://s3.amazonaws.com/wildrydes-ap-northeast-1/WebApplication/1_StaticWebHosting/webapp-static-hosting.yaml)
Asia Pacific (Seoul) | [![Launch Module 1 in ap-northeast-2](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-2#/stacks/new?stackName=wildrydes-webapp-1&templateURL=https://s3.amazonaws.com/wildrydes-ap-northeast-2/WebApplication/1_StaticWebHosting/webapp-static-hosting.yaml)
Asia Pacific (Sydney) | [![Launch Module 1 in ap-southeast-2](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/new?stackName=wildrydes-webapp-1&templateURL=https://s3.amazonaws.com/wildrydes-ap-southeast-2/WebApplication/1_StaticWebHosting/webapp-static-hosting.yaml)



<details>
<summary><strong>CloudFormation 실행 순서 (자세한 내용을 보려면 펼치기)</strong></summary><p>

1. 위쪽의 **Launch Stack** 링크를 클릭하십시오.

1. 템플릿 선택 페이지에서 **Next** 를 클릭하십시오.

1. `wildrydes-yourname`와 같은 전 세계적으로 고유한 이름을 **Website Bucket Name** 지정하고, **Next** 를 클릭하십시오.
    ![Speficy Details Screenshot](../images/module1-cfn-specify-details.png)

1. Option 페이지에서 기본값은 그대로 두고, **Next** 을 클릭하십시오.

1. Review 페이지에서 확인란을 선택하여 , acknowledge that CloudFormation will create IAM resources 체크박스를 클릭하고, **Create** 버튼을 클릭합니다.
    ![Acknowledge IAM Screenshot](../images/cfn-ack-iam.png)

    이 템플릿은 맞춤 리소스를 사용하여 정적 웹 사이트 애셋을 중앙 S3 버킷에서 자신의 전용 버킷으로 복사합니다. 사용자 지정 리소스가 계정의 새 버킷에 쓸 수 있게하려면 해당 사용권한을 이용할 수 있는 IAM Role을 만들어야합니다.

1. `wildrydes-webapp-1` 스택이  `CREATE_COMPLETE` 상태가 될 때 까지 기다리십시오.

1. `wildrydes-webapp-1` 스택을 선택한 상태에서, **Outputs** 탭을 클릭하고 WebsiteURL 링크를 클릭하십시오.

1. Wild Rydes 홈페이지가 제대로 화면이 표시되고난 뒤, 다음 모듈 [User Management](../2_UserManagement) 로 이동하십시오.

</p></details>


## 아키텍쳐 개요

이 모듈의 아키텍쳐는 매우 간단합니다. HTML, CSS, JavaScript, 이미지 및 기타 파일을 포함한 모든 정적 웹컨텐츠는 Amazon S3에 저장됩니다. 최종 사용자는 Amazon S3에 공개된 웹 사이트 URL을 사용하여 사이트에 액세스합니다. 사이트를 사용할 수 있도록 하기 위해서 웹 서버를 실행하거나 다른 서비스를 사용할 필요가 없습니다.

![정적 웹 호스팅 아키텍쳐](../images/static-website-architecture.png)

이번 모듈의 목적을 위해서 우리가 제공하는 Amazon S3 웹사이트 엔드포인드 URL을 사용합니다. `http://{your-bucket-name}.s3-website.{region}.amazonaws.com` 와 같은 형식을 취합니다. 대부분의 실제 응용 프로그램의 경우 사용자 지정 도메인을 사용하여 사이트를 호스팅하려고 합니다. 자신의 도메인을 사용하는데 관심이 있다면 [맞춤 도메인을 사용하여 정적 웹 사이트 설정](http://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html) 을 참조하십시오.

## 구현 지침

다음 섹션에서는 구현 개요와 자세한 단계별 지침을 제공합니다. 개요는 이미 AWS Management Console에 익숙하거나 둘러보기를 거치지 않고 직접 서비스를 탐색하려는 경우 구현을 완료하는 데 충분한 내용을 제공합니다.

최신 버전의 Chrome, Firefox, 혹은 Safari 웹 브라우저를 사용하는 경우 섹션을 확장해야 단계별 지치이 표시됩니다.

### 리전 선택

이 워크샵은 다음 서비스를 지원하는 모든 AWS 리전에 배포 할 수 있습니다.

- Amazon Cognito
- AWS Lambda
- Amazon API Gateway
- Amazon S3
- Amazon DynamoDB

AWS 설명서에서 [리전 표](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/) 를 참고하여 지원되는 서비스가 있는 지역을 확인할 수 있습니다. 지원되는 지역중에서는 N. Virginia, Ohio, Oregon, Ireland, Frankfurt, Tokyo, Sydney, Seoul 이 있습니다.

리전을 선택한 후에는 이 워크샵의 모든 리소스를 배포해야합니다. 시작하기전에 AWS Console의 오른쪽 상단에 있는 드롭 다운에서 리전을 선택하십시오.

![리전 선택 스크린샷](../images/region-selection.png)

### 1. S3 버킷 생성

콘솔 또는 AWS CLI를 사용하여 Amazon S3 버킷을 생성하십시오. 버킷의 이름은 전 세계적으로 고유해야합니다. `wildrydes-yourname`와 같은 이름을 사용할것을 권장합니다.

<details>
<summary><strong>단계별 지침 (자세한 내용은 펼치기)</strong></summary><p>

1. AWS Management Console에서 **Services** 를 선택한 다음 **S3** 를 선택하십시오.

1. **+Create Bucket** 을 선택하십시오.

1. `wildrydes-yourname`와 같은 전 세계적으로 고유한 이름을 설정하십시오.

1. 드롭다운 메뉴에서 이 워크샵에서 사용할 리전을 선택하십시오.

1. 설정을 복사할 버킷을 선택하지 않고 대화상자의 왼쪽 하단에 있는 **Create** 를 선택하십시오.

    ![버킷 생성 스크린샷](../images/create-bucket.png)

</p></details>

### 2. 콘텐츠 업로드

AWS CLI를 사용해서, `s3://wildrydes-us-east-1/WebApplication/1_StaticWebHosting/website` 에서 사용하는 웹 사이드 애셋을 업로드 하십시오. 다음 명령을 사용하여 모든 애셋을 쉽게 복사 할 수 있습니다. `YOUR_BUCKET_NAME`을 이전 섹션에서 사용한 이름으로 대체했는지 확인하십시오.

    aws s3 sync s3://wildrydes-us-east-1/WebApplication/1_StaticWebHosting/website s3://YOUR_BUCKET_NAME

명령이 성공적으로 수행되면 버킷에 복사된 파일 목록이 표시됩니다.

### 3. 버킷 정책에 Public Reads 권한을 허용

익명 사용자가 사이트를 볼 수있게하려면 버킷 정책을 새 Amazon S3 버킷에 추가해야합니다. 기본적으로 버킷은 AWS 계정에 대한 액세스 권한이있는 인증 된 사용자 만 액세스 할 수 있습니다.

부여할 정책에 대한 설정은 [이 예제](http://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html#example-bucket-policies-use-case-2) 를 참고하십시오. 익명 사용자에 대한 읽거 전용 액세스. 이 예제 정책은 인터넷상의 모든 사용자가 귀하의 콘텐츠를 볼 수있게합니다. 버킷 정책을 업데이트하는 가장 쉬운 방법은 콘솔을 사용하는 것입니다. 버킷을 선택하고 권한(Permissions) 탭을 선택한 다음 버킷 정책(Bucket Policy)을 선택하십시오.

<details>
<summary><strong>단계별 지침 (자세한 내용은 펼치기)</strong></summary><p>

1.  S3 콘솔에서 섹션 1에서 생성 한 버킷의 이름을 선택하십시오.

1. **Permissions** 탭을 선택한 다음, **Bucket Policy**를 선택하십시오.

1. 다음 정책 문서를 버킷 정책 편집기에 입력하고 `YOUR_BUCKET_NAME` 을 섹션 1에서 생성한 버킷 이름으로 변경하십시오.

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            }
        ]
    }
    ```

    ![업데이트된 버킷 정책 스크린샷](../images/update-bucket-policy.png)

1. **Save** 버튼을 선택하여 새 정책을 적용하십시오.

</p></details>

### 4. 웹 사이트 호스팅 활성화

콘솔을 사용해서 정적 웹사이트 호스팅을 활성화합니다. 버킷을 선택한 후에 속성탭에서 이 작업을 수행할 수 있습니다. index document로 `index.html` 을 설정하고, error document는 비워두십시오. 자세한 내용은 [정적 웹 사이트 호스팅을 위한 버킷 구성](https://docs.aws.amazon.com/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html) 의 설명서를 참고하십시오.

<details>
<summary><strong>단계별 지침 (자세한 내용은 펼치기)</strong></summary><p>

1. S3 콘솔의 버킷 세부 사항 페이지에서, **Properties** 탭을 선택하십시오.

1. **Static website hosting** 을 선택하십시오.

1. **Use this bucket to host a website** 을 선택하고, index document에 `index.html`를 입력하십시오. 다른 입력칸은 비워둡니다.

1. 먼저 **Endpoint** URL 을 확인하십시오. 그 뒤에 **Save** 버튼을 클릭하십시오. 이 URL을 나머지 워크샵에서 웹 응용 프로그램을 볼 때 사용할 것입니다. 여기에서 이 URL을 귀하의 웹 사이트의 기본 URL이라고 합니다.

1. **Save**을 클릭하여 변경 사항을 저장하십시오.

    ![웹사이트 호스팅 활성화 스크린샷](../images/enable-website-hosting.png)

</p></details>


## 구현 검증

이 구현 단계를 완료 한 후에는 S3 버킷의 웹 사이트 endpoint URL 을 방문하여 정적 웹 사이트에 액세스 할 수 있어야합니다.

원하는 브라우저에서 웹 사이트의 기본 URL (섹션 4에서 언급 한 URL)을 방문하십시오. Wild Rydes 홈 페이지가 표시되어야합니다. 기본 URL을 조회해야하는 경우 S3 콘솔로 이동하여 버킷을 선택한 다음 **Properties** 탭에서 **Static Web Hosting** 을 클릭하십시오.

페이지가 올바르게 보여진다면 (아래 예제 스크린샷 참고), 다음 모듈 [사용자 관리](../2_UserManagement)로 이동하면 됩니다.

![Wild Rydes 홈페이지 스크린샷](../images/wildrydes-homepage.png)
