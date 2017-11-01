# Module 1: Serverless Application Model

In this module you'll use the [Serverless Application Model (SAM)](https://github.com/awslabs/serverless-application-model) to define a serverless RESTful API that has functionality to list, create, view, update, and delete the unicorns in the Wild Rydes stable.

## SAM Local Installation

Later in this module you will be using SAM Local.  If you already have SAM Local installed, you can skip this section. SAM Local emulates AWS Lambda execution environment and requires Docker to run Linux Containers.  

<details>
<summary><strong>Amazon Linux (EC2) SAM Local Installation</strong></summary>

You can use EC2 instance with Amazon Linux to perform exercises in this section.  In this case, you will not be performing work locally on your laptop, instead you will connect remotely into an EC2 instance to perform editing and testing.  Here are the installation steps:

### Launch and Configure Amazon Linux EC2 Instance
1. Create a keypair, if you do not have one already
2. Launch an EC2 instance with:
  1. OS: Amazon Linux
  2. Public IP address
  3. Minimum size t2.micro
  4. Security Group allows SSH access from your laptop
3. Once launched, use SSH client such as Putty or Bitvise to connect to the instance (you can find instructions for connecting from Windows using Putty here: [Connecting to Your Linux Instance from Windows Using PuTTY](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html))
4. Execute the command line below to install prerequisites and SAM Local:

```bash

sudo yum install -y git docker & \

sudo service docker start & \

sudo chmod 666 /var/run/docker.sock & \

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash & \

. ~/.nvm/nvm.sh & \

nvm install 6.11.4 & \

npm install -g aws-sam-local

```

Test by running sam local and you should see output with help text for sam local command:

```bash

sam local

```

output should looks similar to this: 
![SAM Local Help](images/sam-local-help.png)


#### Setup Port Forwarding Configuration

SAM Local can start an HTTP server locally on EC2 instance on port 3000.  In order to view content on that HTTP server through the browser on your laptop, you need to configure port forwarding.

##### Port Forwarding with Putty on Windows

In your putty configuration, select **Connection** , **SSH** , **Tunnels** and add a mapping:

```

Source port: 3000

Destination: 127.0.0.1:3000

```

The configuration should look like this:

![Putty Tunnel Config](images/putty-tunnel-config.png)

##### Port Forwarding with Bitvise SSH Client on Windows

In **Profile** window, select **C2S** tab, create an entry with this configuration:

```

Listen Interface: 127.0.0.1

List. Port: 3000

Destination Host: localhost

Dest. Port: 3000

```

C2S configuration should look similar to this:

![Bitvise Tunnel Config](images/bitvise-tunnel-config.png)

</details>

<details>
<summary><strong>Windows SAM Local Installation</strong></summary>

*Note*: Security policies applied to your Windows configuration may interfere with installation of prerequisites for SAM Local.  For this workshop, you may find it easier to use SAM Local on an Amazon Linux EC2 instance (see instructions above).

If you intend to use Windows on your local machine, note that the key requirement is to run Docker Linux containers.  Depending on the local configuration of Windows, you may be able to install Docker Toolbox. SAM Local will use the DOCKER\_HOST environment variable to contact the docker daemon.

The procedure to setup requirements and SAM Local:

1. Install [Docker Toolbox](https://download.docker.com/win/stable/DockerToolbox.exe)
2. Run a few docker commands from CLI (e.g. 'docker ps') to verify the installation
3. Install [NodeJS](https://nodejs.org/dist/v6.11.4/node-v6.11.4-x64.msi)
4. Install [Git for Windows](https://git-scm.com/download/win) – test that you can use git from command line
5. Use NPM to install SAM Local

```bash

npm install -g aws-sam-local

```

Test by executing sam local, you should see help contents displayed.

```bash

sam local

```

output should looks similar to this: 
![SAM Local Help](images/sam-local-help.png)

</details>

<details>
<summary><strong>Mac OS SAM Local Installation</strong></summary>

1. Install Docker
2. Install NodeJS
3. Use NPM to install SAM Local

```bash

npm install -g aws-sam-local

```

Test by executing sam local, you should see help contents displayed.

```bash

sam local

```

output should looks similar to this: 
![SAM Local Help](images/sam-local-help.png)

</details>

## Architecture Overview

The architecture for the Unicorn API uses API Gateway to define an HTTP interface that trigger Lambda functions to read and write data to the DynamoDB database.

![Wild Rydes DevOps RESTful API Application Architecture](images/wildrydes-devops-api-architecture.png)

## Serverless Application Model (SAM) Overview

AWS SAM is a model used to define serverless applications on AWS.

AWS SAM is based on [AWS CloudFormation](https://aws.amazon.com/cloudformation/). A serverless application is defined in a [CloudFormation template](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/gettingstarted.templatebasics.html) and deployed as a [CloudFormation stack](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/updating.stacks.walkthrough.html). An AWS SAM template is a CloudFormation template.

AWS SAM defines a set of objects which can be included in a CloudFormation template to describe common components of serverless applications easily.  In order to include objects defined by AWS SAM within a CloudFormation template, the template must include a `Transform` section in the document root with a value of `AWS::Serverless-2016-10-31`.

The Unicorn API includes Amazon API Gateway HTTP endpoints that trigger AWS Lambda functions that read and write data to a Amazon DynamoDB database.  The SAM template for the Unicorn API describes a DynamoDB table with a hash key and Lambda functions to list, view and update Unicorns in the Wild Rydes stable.

The Unicorn API components are defined in the [app-sam.yaml](uni-api/app-sam.yaml) CloudFormation template.  Next we'll review the Unicorn API components in more detail.

### AWS::Serverless::SimpleTable

Below is the code snippet from the SAM template that describes the DynamoDB table resource.

```yaml
  Table:
    Type: 'AWS::Serverless::SimpleTable'
      Properties:
        PrimaryKey:
          Name: name
          Type: String
```

Unicorns are uniquely identified in the Wild Rydes stable by **name**, a single String attribute that is used as the primary key in the DynamoDB table.  The [AWS::Serverless::SimpleTable](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable) resource meets this requirement and is used to define the DynamoDB table used by the API.  If a more complex configuration is required, you can substitute the SimpleTable with a [AWS::DynamoDB::Table](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html) resource definition.

### AWS::Serverless::Function

Below is the code snippet from the SAM template that describes the Lambda function that handles requests to view Unicorn data by Unicorn name.

```yaml
  ReadFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      FunctionName: 'uni-api-read'
      Runtime: nodejs6.10
      CodeUri: app
      Handler: read.lambda_handler
      Description: View Unicorn by name
      Timeout: 10
      Events:
        GET:
          Type: Api
          Properties:
            Path: /unicorns/{name}
            Method: get
      Environment:
        Variables:
          TABLE_NAME: !Ref Table
      Role:
        Fn::ImportValue:
          !Join ['-', [!Ref 'ProjectId', !Ref 'AWS::Region', 'LambdaTrustRole']]
```

There are several [properties](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#properties) defined for the [AWS::Serverless::Function](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction) resource, which we'll review in turn.

#### FunctionName

The **FunctionName** property defines a custom name for the Lambda function.  If not specified, CloudFormation will generate a name using the CloudFormation Stack name, CloudFormation Resource name, and random ID.

#### Runtime

The Unicorn API is implemented in **Node.js 6.10**.  Additional runtimes are available for AWS Lambda.  Please refer to the [Lambda Execution Environment and Available Libraries](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html) for the complete list.

#### CodeUri

The **CodeUri** property defines the location to the function code on your workstation relative to the SAM template.  In this example, "**app**" is used for the property value because the function code is in the `app` directory relative to the SAM template.

#### Handler

The **Handler** property defines the entry point for the Lambda function.  For Javascript, This is formatted as "**file**.**function**", where **file** is the Javascript filename without the ".js" extension relative to the **CodeUri** path defined above and **function** is the name of the function in the file that will be executed with the Lambda function is invoked.

#### Events

The **Events** property defines the sources that trigger the Lambda function invocation.  An [Api](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api) event source is defined to integrate the Lambda function with an API Gateway endpoint, however SAM supports Lamdba function triggers from a variety of [sources](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-types).

The **Api** event source to view details of a Unicorn is defined at the RESTful resource `/unicorns/{name}` accessed using the HTTP GET method.  SAM will transform the Api event to an API Gateway resource and map the **name** value in the URL to a [pathParameter](http://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-mappings.html) in the event used to invoke the Lambda function.

#### Environment

The [Environment](http://docs.aws.amazon.com/lambda/latest/dg/env_variables.html) property defines a list of variables and values that will be accessible in the Lambda function, according to the access method defined by the Runtime.

The Lambda functions communicate with DynamoDB to read and write data.  The DynamoDB table created by the CloudFormation Stack is referenced as the value for the `TABLE_NAME` environment variable, which can be referenced within the Lambda function.

#### Role

The **Role** property defines the IAM Role that specifies the access permissions to AWS resources in the [Lambda execution policy](http://docs.aws.amazon.com/lambda/latest/dg/intro-permission-model.html#lambda-intro-execution-role).  For each project, CodeStar generates a Lambda execution role that has access to a default set of AWS resources.  This role can be modified with additional policies, as you will see in a later module.

Next, we'll look at how CloudFormation is used to deploy the SAM Unicorn API.

## Implementation Instructions

Each of the following sections provide an implementation overview and detailed, step-by-step instructions. The overview should provide enough context for you to complete the implementation if you're already familiar with the AWS Management Console or you want to explore the services yourself without following a walkthrough.

If you're using the latest version of the Chrome, Firefox, or Safari web browsers the step-by-step instructions won't be visible until you expand the section.

### Region Selection

This workshop can be deployed in any AWS region that supports the following services:

- Amazon API Gateway
- Amazon S3
- Amazon DynamoDB
- AWS CodeBuild
- AWS CodePipeline
- AWS Lambda
- AWS X-Ray

You can refer to the [region table](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/) in the AWS documentation to see which regions have the supported services. Among the supported regions you can choose are N. Virginia, Ohio, N. California, Oregon, Ireland, Frankfurt, and Sydney.

Once you've chosen a region, you should deploy all of the resources for this workshop there. Make sure you select your region from the dropdown in the upper right corner of the AWS Console before getting started.

![Region selection screenshot](images/region-selection.png)

### 1. Update CodeStar IAM Role

CodeStar generates IAM Roles and Policies that control access to AWS resources.  In this module, we will add permissions to Roles using IAM Managed Policies to support the customizations we will make to the Lambda function names.

#### 1a. Add IAM Policies to the `CodeStarWorker-uni-api-CloudFormation` Role

1. In the AWS Management Console choose **Services** then select **IAM** under Security, Identity & Compliance.

1. Select Role in the left navigation, type `CodeStarWorker-uni-api-CloudFormation` in the filter text box, and click the Role name link in the Role table.

    ![Select Role](images/role1-1.png)
 
1. On the Role Summary page, click the **Attach Policy** button in the **Managed Policies** section of the **Permissions** tab.

    ![Role Details](images/role1-2.png)
 
1. Type `AWSLambdaReadOnlyAccess` in the filter text box, select the checkbox next to the **AWSLambdaReadOnlyAccess** Managed Policy, and click the **Attach Policy** button.

    ![Attach Policy](images/role1-3.png)
 
1. The Role Summary will now include the **AWSLambdaReadOnlyAccess** policy in the list of **Managed Policies**.

    ![Policy Attached](images/role1-4.png)
    
### 2. Seed the `uni-api` CodeCommit Git repository

1. Each module has corresponding source code used to seed the CodeCommit Git repository for the CodeStart project.  To seed the CodeCommit Git repository, click on the **Launch Stack** button for your region below:

    Region| Launch
    ------|-----
    US East (N. Virginia) | [![Launch Module 1 in us-east-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?stackName=Seed-1-ServerlessApplicationModel&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-us-east-1/codecommit-template.yml&param_sourceUrl=https://s3.amazonaws.com/fsd-aws-wildrydes-us-east-1/uni-api-1.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=us-east-1)
    US West (N. California) | [![Launch Module 1 in us-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-1#/stacks/create/review?stackName=Seed-1-ServerlessApplicationModel&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-us-west-1/codecommit-template.yml&param_sourceUrl=https://s3-us-west-1.amazonaws.com/fsd-aws-wildrydes-us-west-1/uni-api-1.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=us-west-1)
    US West (Oregon) | [![Launch Module 1 in us-west-2](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/create/review?stackName=Seed-1-ServerlessApplicationModel&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-us-west-2/codecommit-template.yml&param_sourceUrl=https://s3-us-west-2.amazonaws.com/fsd-aws-wildrydes-us-west-2/uni-api-1.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=us-west-2)
    EU (Ireland) | [![Launch Module 1 in eu-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/create/review?stackName=Seed-1-ServerlessApplicationModel&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-eu-west-1/codecommit-template.yml&param_sourceUrl=https://s3-eu-west-1.amazonaws.com/fsd-aws-wildrydes-eu-west-1/uni-api-1.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=eu-west-1)
    EU (Frankfurt) | [![Launch Module 1 in eu-central-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/create/review?stackName=Seed-1-ServerlessApplicationModel&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-eu-central-1/codecommit-template.yml&param_sourceUrl=https://s3-eu-central-1.amazonaws.com/fsd-aws-wildrydes-eu-central-1/uni-api-1.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=eu-central-1)
    Asia Pacific (Sydney) | [![Launch Module 1 in ap-southeast-2](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/create/review?stackName=Seed-1-ServerlessApplicationModel&templateURL=https://s3.amazonaws.com/fsd-aws-wildrydes-ap-southeast-2/codecommit-template.yml&param_sourceUrl=https://s3-ap-southeast-2.amazonaws.com/fsd-aws-wildrydes-ap-southeast-2/uni-api-1.zip&param_targetRepositoryName=uni-api&param_targetRepositoryRegion=ap-southeast-2)

1. The CloudFormation template has been prepopulated with the necessary fields for this module.  No changes are necessary

1. Select the **I acknowledge that AWS CloudFormation might create IAM resources.** checkbox to grant CloudFormation permission to create IAM resources on your behalf

1. Click the **Create** button in the lower right corner of the browser window to create the CloudFormation stack and seed the CodeCommit repository.

    ![Seed Repository CloudFormation Stack Review](images/seed-repository-1.png)

1. There will be a short delay as the Git repository seeded with the new source code.  Upon successful completion, the CloudFormation will show Status ``CREATE_COMPLETE``.

    ![CloudFormation Stack Creation Complete](images/seed-repository-2.png)

### 3. Fetch CodeCommit Git Repository

Now that the CodeCommit Git repository has been seeded with new source code, you will need to fetch the changes locally so that you may modify the code.  Typically, this is accomplished using the `git pull` command, however for the workshop we have replaced the repository with a new history and different Git commands will be used.

Using your preferred Git client, run the commands on your local **uni-api** Git repository:

* `git fetch --all`
* `git reset --hard origin/master`


## SAM Local Development

Based on AWS SAM, SAM Local is an AWS CLI tool that provides an environment for you to develop, test, and analyze your serverless applications locally before uploading them to the Lambda runtime. You can use SAM Local to create a local testing environment that simulates the AWS runtime environment. Working with SAM Local also allows faster, iterative development of your Lambda function code because there is no need to redeploy your application package to the AWS Lambda runtime. 

## SAM Local Web Service Development

You will now use SAM Local to make modifications to a web service.  Since it executes locally, you are able to make quick changes and immediately test the web service.  Note that this step requires that you have cloned uni-api project from CodeCommit to your disk.  SAM Local commands will parse template and code in those files to emulate a local Lambda environment.

<details>
<summary><strong>Step-by-Step Instructions</strong></summary>

You will use start-api option wich creates a local HTTP server hosting all of your Lambda functions.  SAM Local will parse the SAM template file, in this case template.yml file.  It will launch the Lambda function defined in AWS::Serverless::Function section.  You will be able to interact with the function using your browser.  After you make changes to the code, those will be immediately visible in your browser.

In command prompt, execute SAM Local start-api in the directory containing local copy of the code:

```bash

cd /home/ec2-user/uni-api/

npm install

sam local start-api

```

**Note:** adjust the path to match location of the uni-api repo on your disk.

SAM Local downloads the container image and starts its execution using local Docker service.  In addition, local HTTP server launches at [http://127.0.0.1:3000](http://127.0.0.1:3000).  
![start-api output](images/start-api-output.png)

Open the browser on your local machine and view the output:
![Hello World in Browser](images/browser-hello-world.png)

Now, make a modification to the app.  Edit **app.js** file in any text editor and find this section that responds to GET requests:

```javascript

app.get('/', function(req, res) {

  res.send({

    'Output': 'Hello World!';

  });

});

```

Modify the message **'Hello World!'** to **'re:invent the World!'** and save the file.  Refresh the browser and you will immediately see the updated message.

![re:invent the World in Browser](images/browser-reinvent-world.png)

That's it!  You modified the code and got immediate feedback in your browser.  
</details>

## Completion

Congratulations!  You have successfully installed SAM Local, then performed local development and testing of a serverless API.  Using SAM Local will help you to iterate code changes quickly while getting instant feedback.

### 4. Identify CodeStar `uni-api` S3 Bucket

CodeStar creates an S3 bucket to store the artifacts created by packaging SAM-based projects.  The S3 bucket has the format, where `{AWS::Region}` and `{AWS::AccountId}` are populated with your details.

```
aws-codestar-{AWS::Region}-{AWS::AccountId}-uni-api-pipe
```

### 5. Package the Unicorn API for Deployment

On your workstation:

1. Change directory to your local **uni-api** Git repository directory.

1. Use the AWS CLI to execute the [CloudFormation package](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/package.html) command to upload the local code from the `uni-api` directory to S3.  Use the following command to do so.  Make sure you replace `YOUR_BUCKET_NAME` with the name you identified in the previous step (i.e. `aws-codestar-{AWS::Region}-{AWS::AccountId}-uni-api-pipe`)

```
aws cloudformation package --template-file app-sam.yaml --s3-bucket YOUR_BUCKET_NAME --output-template-file app-sam-output.yaml
```

The **CloudFormation package** command archives the local source code, uploads it to the S3 location specified, and returns an new CloudFormation template to the `app-sam-output.yaml` file with the local CodeUri reference substituted with the location to the S3 object.  For example:

Before:

```yaml
  ReadFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      FunctionName: 'uni-api-read'
      Handler: read.lambda_handler
      Runtime: nodejs6.10
      CodeUri: app
```

After:

```yaml
  ReadFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      FunctionName: 'uni-api-read'
      Handler: read.lambda_handler
      Runtime: nodejs6.10
      CodeUri: s3://YOUR_BUCKET_NAME/540839c2fc11f0214f88f6c5dfacd389
```

### 6. Deploy the Unicorn API

1. Change directory to your local **uni-api** Git repository, if necessary.

2. Use the AWS CLI to execute the [CloudFormation deploy](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/deploy/index.html) command to deploy the `app-sam-output.yaml` CloudFormation template returned by the package command, specifying the CloudFormation stack name `awscodestar-uni-api-lambda` and the `CAPABILITY_IAM` [CloudFormation capability](http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_CreateStack.ht) as the stack will be creating IAM trust and execution policies for the Lambda functions.  You can use the following command to do so.

```
aws cloudformation deploy --stack-name awscodestar-uni-api-lambda --template-file app-sam-output.yaml --capabilities CAPABILITY_IAM --parameter-overrides ProjectId=uni-api
```

## Implementation Validation

After the CloudFormation deploy command completes, you will use the browser to test your API.

1. In the AWS Management Console choose **Services** then select **CodeStar** under Developer Tools.

1. Select the `uni-api` project

1. Copy the URL from the **Application endpoints** tile on the right side of the dashboard.

1. Paste the URL in a browser window and append `/unicorns` to the path and hit enter.  For example: `https://xxxxxxxxxx.execute-api.us-west-1.amazonaws.com/Prod/unicorns/`

1. Confirm that the browser shows a JSON result with an empty list: `[]`

## API Enhancement

Now that you've reviewed and deployed the Unicorn API, let's enhance the API with the ability to create or update a Unicorn in the Wild Rydes stables.  The code to do so is already present in the project, so you need to add an **AWS::Serverless::Function** resource in the SAM `app-sam.yaml` template.

### 1. Add Update Function to app-sam.yaml

Using a text editor, open the `app-sam.yaml` file and append a new **AWS::Serverless::Function** Resource labeled `UpdateFunction` that has the following definition.

> Note: whitespace is important in YAML files.  Please verify that the configuration below is added with the same space indentation as the CloudFormation Resources in the app-sam.yaml file.

1. **FunctionName** is `uni-api-update`

1. **Runtime** is `nodejs6.10`

1. **CodeUri** is `app`

1. **Handler** is `update.lambda_handler`

1. **Description** is `Create or Update Unicorn`

1. **Timeout** is `10`

1. **Event** type is `Api` associated to the `/unicorns/{name}` **Path** and `put` **Method**

1. **Environment** variable named `TABLE_NAME` that references the `Table` Resource for its value.

1. **Role** is duplicated from another function.

If you are unsure of the syntax to add to ``app-sam.yaml`` please refer to the code snippet below.

<details>
<summary><strong>app-sam.yaml additions to support Update function (expand for details)</strong></summary><p>

```yaml
  UpdateFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      FunctionName: 'uni-api-update'
      Runtime: nodejs6.10
      CodeUri: app
      Handler: update.lambda_handler
      Description: Create or Update Unicorn
      Timeout: 10
      Events:
        PUT:
          Type: Api
          Properties:
            Path: /unicorns/{name}
            Method: put
      Environment:
        Variables:
          TABLE_NAME: !Ref Table
      Role:
        Fn::ImportValue:
          !Join ['-', [!Ref 'ProjectId', !Ref 'AWS::Region', 'LambdaTrustRole']]
```

</p></details>

### 2. Package the Unicorn API for Deployment

Use the AWS CLI to execute the [CloudFormation package](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/package.html) command to upload the local code from the `uni-api` directory to S3.  You can use the following command to do so.  Make sure you replace `YOUR_BUCKET_NAME` with the name you used for the previous package command.

```
aws cloudformation package --template-file app-sam.yaml --s3-bucket YOUR_BUCKET_NAME --output-template-file app-sam-output.yaml
```

### 3. Deploy the Unicorn API

Use the AWS CLI to execute the [CloudFormation deploy](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/deploy/index.html) command to deploy the `app-sam-output.yaml` CloudFormation template returned by the package command, specifying the CloudFormation stack name `awscodestar-uni-api-lambda` and the `CAPABILITY_IAM` [CloudFormation capability](http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_CreateStack.ht) as the stack will be creating IAM trust and execution policies for the Lambda functions.  You can use the following command to do so.

```
aws cloudformation deploy --stack-name awscodestar-uni-api-lambda --template-file app-sam-output.yaml --capabilities CAPABILITY_IAM
```

CloudFormation will generate a ChangeSet for the `awscodestar-uni-api-lambda` CloudFormation Stack and only update the resources that have changed since the previous deployment.  In this case, `awscodestar-uni-api-lambda` was the CloudFormation stack created by CodeStar for the Lambda functions and API Gateway specification, which you will be updating.

## Enhancement Validation

After the CloudFormation deploy command completes, you will use the AWS API Gateway to test your API.

### 1. Add a Unicorn

1. In the AWS Management Console, click **Services** then select **API Gateway** under Application Services.

1. In the left nav, click on `awscodestar-uni-api-lambda`.

1. From the list of API resources, click on the `PUT` link under the `/{name}` resource.

1. On the resource details panel, click the `TEST` link in the client box on the left side of the panel.

    ![Validate 1](images/validate-1.png)

1. On the test page, enter `Shadowfox` in the **Path** field.

1. Scroll down the test page and enter the following as the **Request Body**:

    ```json
    {
      "breed": "Brown Jersey",
      "description": "Shadowfox joined Wild Rydes after completing a distinguished career in the military, where he toured the world in many critical missions. Shadowfox enjoys impressing his ryders with magic tricks that he learned from his previous owner."
    }
    ```

    ![Validate 2](images/validate-2.png)

1. Scroll down and click the **Test** button.

1. Scroll to the top of the test page, and verify that on the right side of the panel that the **Status** code of the HTTP response is 200.

    ![Validate 3](images/validate-3.png)

### 2. List Unicorns

1. In the AWS Management Console choose **Services** then select **CodeStar** under Developer Tools.

1. Select the `uni-api` project

    ![CodeStar Project List](images/codestar-1.png)

1. Copy the URL from the **Application endpoints** tile on the right side of the dashboard.

    ![CodeStar App Endpoint](images/codestar-app-endpoint.png)

1. Paste the URL in a browser window and append `/unicorns` to the path and hit enter.  For example: `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/Prod/unicorns/`

1. Confirm that the browser shows a JSON result that includes `Shadowfox`, with the breed and description entered above.

> Note: You may notice that your CodeStar project shows the Build stage has failed in the project pipeline.  That's to be expected, and will be corrected in the next module.

## Completion

Congratulations!  You have successfully deployed a RESTful serverless API using the Serverless Application Model, and demonstrated that the same tools can be used to make modifications to the API.  In the next [Continuous Delivery Pipeline Module](../2_ContinuousDeliveryPipeline), you will learn how to automate this deployment process using AWS CodePipeline and AWS CodeBuild.
