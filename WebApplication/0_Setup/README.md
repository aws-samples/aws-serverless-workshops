## Setup

### AWS Account

In order to complete this workshop, you'll need an AWS account and access to
create AWS Identity and Access Management (IAM), Amazon Cognito, AWS Lambda,
Amazon S3, Amazon API Gateway, AWS Amplify Console, Amazon DynamoDB, and AWS
Cloud9 resources within that account.

The code and instructions in this workshop enables multiple participants using given AWS account at the same time. To avoid naming conflicts for certain resources, prefixing is required and the instruction will indicate all the places where this is necessary.
Prefixes might be initials. In this instruction we will use '%initials%' notation to indicate such prefixes.

### AWS Cloud9 IDE

AWS Cloud9 is a cloud-based integrated development environment (IDE) that lets
you write, run, and debug your code with just a browser. It includes a code
editor, debugger, and terminal. Cloud9 comes pre-packaged with essential tools
for popular programming languages and the AWS Command Line Interface (CLI)
pre-installed so you don’t need to install files or configure your laptop for
this workshop. Your Cloud9 environment will have access to the same AWS
resources as the user with which you logged into the AWS Management Console.

Take a moment now and setup your Cloud9 development environment.

**:white_check_mark: Step-by-step Instructions**

1. Go to https://myapps.microsoft.com/ in your web browser and authenticate using IHS Markit account.

1. Click *AWS - OfficeoftheCTO Training NonProd* App and pick **AWS-OCTOTraining-Dev** role when prompted.

1. Go to the AWS Management Console,**MAKE SURE YOU ARE IN US East(N. Virginia) us-east-1 REGION!!**. Change the region in upper right corner of AWS Management Console if needed.

1. Click **Services** then select **Cloud9**
   under Developer Tools.

1. Click **Create environment**.

1. Enter `%initials%-Development` into **Name** and optionally provide a **Description**.

1. Click **Next step**.

1. Leave the defaults of launching a new
   **t2.micro** EC2 instance which will be paused after **30 minutes** of
   inactivity.
   For **Network (VPC)** select **vpc-0ce4c2d536ee06c50** and for **Subnet** select **subnet-01f43da36b8bdb239 | Non-default in us-east-1a**.

1. Click **Next step**.

1. Review the environment settings and click **Create environment**. It will
   take several minutes for your environment to be provisioned and prepared.

1. Once ready, your IDE will open to a welcome screen. Below that, you should
   see a terminal prompt.

    You can run AWS CLI commands in here just like you would on your local computer.
    Verify that your user is logged in by running `aws sts get-caller-identity`.

    ```console
    aws sts get-caller-identity
    ```

    You'll see output indicating your account and user information:

    ```console
    ec2-user:~/environment $ aws sts get-caller-identity
    ```
    ```json
    {
        "Account": "123456789012",
        "UserId": "AKIAI44QH8DHBEXAMPLE",
        "Arn": "arn:aws:iam::123456789012:user/Alice"
    }
    ```

Keep your AWS Cloud9 IDE opened in a tab throughout this workshop.

### :star: Tips

:bulb: Keep an open scratch pad in Cloud9 or a text editor on your local computer
for notes.  When the step-by-step directions tell you to note something such as
an ID or Amazon Resource Name (ARN), copy and paste that into the scratch pad.

### :star: Recap

:key: Use a unique personal or development [AWS account](#aws-account)

:key: Keep your [AWS Cloud9 IDE](#aws-cloud9-ide) opened in a tab

### Next

:white_check_mark: Proceed to the first module, [Static Web Hosting][static-web-hosting],
wherein you'll deploy a static web site via AWS Amplify Console.

[region-table]: https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/
[static-web-hosting]: ../1_StaticWebHosting/