# Module 3: Serverless Service Backend

In this module you'll use AWS Lambda and Amazon DynamoDB to build a backend process for handling requests from your web application. The browser application that you deployed in the first module allows users to request that a unicorn be sent to a location of their choice. In order to fulfill those requests, the JavaScript running in the browser will need to invoke a service running in the cloud.

You'll implement a Lambda function that will be invoked each time a user requests a unicorn. The function will select a unicorn from the fleet, record the request in a DynamoDB table and then respond to the front-end application with details about the unicorn being dispatched.

![Serverless backend architecture](../images/serverless-backend-architecture.png)

The function is invoked from the browser using Amazon API Gateway. You'll implement that connection in the next module. For this module you'll just test your function in isolation.

## Implementation Instructions

Each of the following sections provide an implementation overview and detailed, step-by-step instructions. The overview should provide enough context for you to complete the implementation if you're already familiar with the AWS Management Console or you want to explore the services yourself without following a walkthrough.

If you're using the latest version of the Chrome, Firefox, or Safari web browsers the step-by-step instructions won't be visible until you expand the section.


### Serverless Framework Tutorial
The primary focus here is learning how to use the serverless framework to provision the necessary services for our backend application. 

You may notice that some reference materials are from the official Cloudformation documentation and others from Serverless. That is because for various things, there is a 1:1 overlap in syntax (i.e. specifying <b>resources:</b>).

If you wish to know more, visit the <a target="_blank" href="https://serverless.com/framework/docs/">serverless website</a>. You will notice that there are adaptations for Azure, Google Cloud, AWS and so forth. Since we are using AWS, you should look there.  

Lets get started!  

Prerequisites: 
1. Install latest Node (https://nodejs.org/en/) if you have not done so yet. 
2. Run "npm install npm@latest -g" in CLI - updates to the latest NPM version 
3. Run "npm install -g serverless" in CLI - installs the serverless utility on your machine so it can be run in anywhere  
4. Choose a code editor (i.e. Atom, Visual Code etc) and open WebApplication/3_ServerlessBackend project folder 


<br>
<h4>Setup</h4>

1. Create a yaml file called <b>serverless.yml</b> in root project (3_ServerlessBackend) level

2. Copy and paste the lines below into the yml file.

```YAML
service: rockservice

provider:
  name: aws
  runtime: nodejs6.10
  stage: dev
  region: ap-southeast-2 
```

The above is just the bare bones to get you equipped for everything that is to come. 
Two stanzas worth noting above are <b>region</b>, <b>runtime</b>. 

<b>region</b>: The region in which you want to provision the cloud formation stack. In our example we choose ap-southeast-2 as that is in Sydney which is closer to us. Else, change it to another region that pleases you.  

<b>runtime</b>: As we using javascript as our main language here, we should pick nodejs6.10. If we were using java, then we would have specified this value as "java8" instead. Same applies for other supported languages.

<br>
<h4>Lambda</h4>

Now we can get into the meat and bones of our infrastructure. To start off, we can specify the stanzas to provision our lambda function. 

Copy and paste the yml snippet below in the serverless.yml file. This is what you need to specify for each new lambda function you intend on creating. The <b>RocksHandler</b> stanza is the unique resource name and can be set to any appropriate value you see fit. For the purpose of this tutorial, we just leave it at that.  

You find comprehensive documentation on serverless <a href="https://serverless.com/framework/docs/providers/aws/guide/functions/">functions</a> if you want to know its full capabilities.

```YAML
functions:
    RocksHandler:
        handler: ?
```  

What we need to do here is figure out that should be substituted in place of the question mark. To start off, there should be a requestRock.js file in your project. Open it, navigate to line 25 and take note the name of the function.  

Replace the "?" with something that resembles {file_path}.{function_name}, excluding the curly brackets.  

If you figured it out correctly, we should end up with something looking like below.

<details>
<summary><strong>See answer (click to expand)</strong></summary>

```YAML
functions:
    RocksHandler:
        handler: requestRock.handler
```

</details>
<br>

Question:  
If we created a new folder called "src" and put requestRock.js in there. What do you think we will have to update the <b>handler:</b> stanza to? 

<ol type="a">
    <li>src/requestRock.handler</li>
    <li>../src/requestRock.handler</li> 
    <li>src.requestRock.handler</li>
</ol>

<details>
<summary><strong>See answer (click to expand)</strong></summary> 
<b>a</b> is the correct answer.  
</details>
<br>


<h4>DynamoDB</h4>

Next, we proceed to specify the stanzas to provision a DynamoDB table. Copy and paste the yaml snippet below into the serverless.yml file.

```YAML
resources:
  Resources:
    RocksTable:
      Type: {RESOURCE_TYPE}
      Properties:
        TableName: {TABLE_NAME}
        AttributeDefinitions:
          -
            AttributeName: {HASH_FIELD_NAME}
            AttributeType: S
        KeySchema:
          -
            AttributeName: {HASH_FIELD_NAME}
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```  

Looking at the above snippet we need to figure out what to replace the variables in curly braces with.  

Starting from the top, we need to decide on what AWS resource type we want to provision. This is determined where we specify the <b>RESOURCE_TYPE</b>. What do you think variable should be? 
Your best resource for that information is the <a target="_blank" href="https://serverless.com/framework/docs/providers/aws/guide/resources/#aws-cloudformation-resource-reference">list of AWS template resource types</a>. Replace it with the appropriate value.

<details><summary><strong>See answer (click to expand)</strong></summary>
    AWS::DynamoDB::Table
</details>
<br>

Next, lets return to the code in requestRock.js and search for the function called <b>recordRock</b>. We need to find out the table name and as expected for your standard dynamodb table, we need to define at minimum one main partition/hash key. Read the few lines of code and substitute <b>TABLE_NAME</b> and <b>HASH_FIELD_NAME</b> with the appropriate values. 

<details>
<summary><strong>See answer (click to expand)</strong></summary>
    <b>TABLE_NAME:</b> Rocks
    <br>
    <b>HASH_FIELD_NAME:</b> RockId
</details>
<br>


<h4>Lambda IAM Role</h4>

We now require an IAM Role that lambda can assume when performing its tasks in order to interact with other AWS services. 

For simplicity sake, we will just specify a default role that will be assumed by all Lambda functions created for our service that has only the bare minimum permissions assigned.

We should start by appending the below snippet under the <b>provider</b> section of the serverless.yml file. Since we only need to interact with DynamoDB in our application, theres only one specification that is required. 

```YAML
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "{SERVICE_NAMESPACE}:{API_METHOD}"
      Resource: 
        "Fn::{FUNCTION_NAME}": [{TABLE_RESOURCE_NAME}, Arn]
```  

Once again, there are curly braces where we need to figure out what needs to be substituted. Starting from the top left, we have <b>SERVICE_NAMESPACE</b>. This value should be what we use to uniquely identify a particular AWS service.  

Replace it with the appropriate value and if you are unsure, check out the <a target="_blank" href="http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#genref-aws-service-namespaces">AWS documentation</a>. 

<details><summary><strong>See answer (click to expand)</strong></summary>
dynamodb
</details>
<br>

Besides the service namespace, we should specify the <b>API_METHOD</b> which is simply the API access permissions. As always, if you are unsure look to the <a target="_blank" href="http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/api-permissions-reference.html">AWS documentation</a>. Scroll down to the Service / Namespace table.

<details><summary><strong>See answer (click to expand)</strong></summary>
PutItem
</details>
<br>

Lastly, we need to find out which resource we want this policy to apply to. Here, we will need to specify the Arn of the DynamoDB table resource. To achieve this, we should tell Serverless (Cloudformation) to retrieve the Arn of the particular table. 

To achieve that, you need to know the mechanism for retrieving resource attributes. Take a look in <a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html">here</a> if unsure and that should give you <b>FUNCTION_NAME</b>.  

Can you figure out the appropriate value for <b>TABLE_RESOURCE_NAME</b>? A hint would be looking at the <b>Resources:</b> in your existing serverless.yml file.  


<details><summary><strong>See answer (click to expand)</strong></summary>
"Fn::GetAtt": [RocksTable, Arn]
</details>
<br> 

<details><summary><strong>In summary, the serverless yml should look similiar to following snippet (click to expand)</strong></summary>

```YAML
service: mechrockservice

provider:
  name: aws
  runtime: nodejs6.10
  stage: dev
  region: ap-southeast-2 

  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "dynamodb:PutItem"
      Resource: 
        "Fn::GetAtt": [RocksTable, Arn]
       
functions:
  RequestRock:
    handler: requestRock.handler

resources:
  Resources:
    RocksTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: Rocks
        AttributeDefinitions:
          -
            AttributeName: RockId
            AttributeType: S
        KeySchema:
          -
            AttributeName: RockId
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```
</details>
<br>  

<h4>Deployment</h4>

Well, that should be all the infrastructure we need for now. We are ready to begin provisioning resources on AWS. So, bring up the command line and ensure you are navigated to root project level. 

<br>
**Two important points before deploying:**

Firstly, dynamodb table names have to be unique per region. If you are using shared accounts, then whomever deploys first should have no issues (unless there is already a table called "Rocks"). Others will ultimately run into a duplicate table name problem.  

Lastly, if someone else has already deployed, then any further attempts on your end will result in updating the same stack instead of creating it as the names are conflicting.  

The best steps to avoid these conflicts are:
- Change <b>service:</b> in serverless.yml to something not in use
- Change dynamodb table name references in requestRock.js and serverless.yml to something not in use 

OR  

- Specify a different region not used by others

<br>

Execute the command "serverless deploy" and watch the logs.  

If the deployment ran successfully, login to AWS and navigate to Cloudformation service and confirm that there is a new stack called "mechrockservice-dev". This name is formed as a combination of the <b>service name</b> and <b>stage</b>.

Now, we should quickly verify that our Lambda will run as expected. Go into Lambda AWS console and configure and run a new test event with the following body: 

```JSON
{
    "path": "/rock",
    "httpMethod": "POST",
    "headers": {
        "Accept": "*/*",
        "Authorization": "eyJraWQiOiJLTzRVMWZs",
        "content-type": "application/json; charset=UTF-8"
    },
    "queryStringParameters": null,
    "pathParameters": null,
    "requestContext": {
        "authorizer": {
            "claims": {
                "cognito:username": "the_username"
            }
        }
    },
    "body": "{\"PickupLocation\":{\"Latitude\":47.6174755835663,\"Longitude\":-122.28837066650185}}"
}
```  

Verify that the execution succeeded and that the function result looks similar the following:

```JSON
{
    "statusCode": 201,
    "body": "{\"RockId\":\"SvLnijIAtg6inAFUBRT+Fg==\",\"Rock\":{\"Name\":\"Obsidian\",\"Color\":\"Black\",\"Type\":\"Igneous\"},\"Eta\":\"30 seconds\"}",
    "headers": {
        "Access-Control-Allow-Origin": "*"
    }
} 
```


<details>
<summary><strong>See manual steps (click to expand)</strong></summary>

### 1. Create an Amazon DynamoDB Table

Use the Amazon DynamoDB console to create a new DynamoDB table. Call your table `Rides` and give it a partition key called `RideId` with type String. The table name and partition key are case sensitive. Make sure you use the exact IDs provided. Use the defaults for all other settings.

After you've created the table, note the ARN for use in the next step.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. From the AWS Management Console, choose **Services** then select **DynamoDB** under Databases.

1. Choose **Create table**.

1. Enter `Rides` for the **Table name**. This field is case sensitive.

1. Enter `RideId` for the **Partition key** and select **String** for the key type. This field is case sensitive.

1. Check the **Use default settings** box and choose **Create**.

    ![Create table screenshot](../images/ddb-create-table.png)

1. Scroll to the bottom of the Overview section of your new table and note the **ARN**. You will use this in the next section.

</p></details>


### 2. Create an IAM Role for Your Lambda function

#### Background

Every Lambda function has an IAM role associated with it. This role defines what other AWS services the function is allowed to interact with. For the purposes of this workshop, you'll need to create an IAM role that grants your Lambda function permission to write logs to Amazon CloudWatch Logs and access to write items to your DynamoDB table.

#### High-Level Instructions

Use the IAM console to create a new role. Name it `WildRydesLambda` and select AWS Lambda for the role type. You'll need to attach policies that grant your function permissions to write to Amazon CloudWatch Logs and put items to your DynamoDB table.

Attach the managed policy called `AWSLambdaBasicExecutionRole` to this role to grant the necessary CloudWatch Logs permissions. Also, create a custom inline policy for your role that allows the `ddb:PutItem` action for the table you created in the previous section.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. From the AWS Management Console, click on **Services** and then select **IAM** in the Security, Identity & Compliance section.

1. Select **Roles** in the left navigation bar and then choose **Create new role**.

1. Select **AWS Lambda** for the role type.

    **Note:** Selecting a role type automatically creates a trust policy for your role that allows AWS services to assume this role on your behalf. If you were creating this role using the CLI, AWS CloudFormation or another mechanism, you would specify a trust policy directly.

1. Begin typing `AWSLambdaBasicExecutionRole` in the **Filter** text box and check the box next to that role.

1. Choose **Next Step**.

1. Enter `WildRydesLambda` for the **Role name**.

1. Choose **Create role**.

1. Type `WildRydesLambda` into the filter box on the Roles page and choose the role you just created.

1. On the Permissions tab, expand the **Inline Policies** section and choose the **click here** link to create a new inline policy.

   ![Inline policies screenshot](../images/inline-policies.png)

1. Ensure **Policy Generator** is selected and choose **Select**.

1. Select **Amazon DynamoDB** from the **AWS Service** dropdown.

1. Select **PutItem** from the Actions list.

1. Paste the ARN of the table you created in the previous section in the **Amazon Resource Name (ARN)** field.

    ![Policy generator screenshot](../images/policy-generator.png)

1. Choose **Add Statement**.

1. Choose **Next Step** then **Apply Policy**.

</p></details>

### 3. Create a Lambda Function for Handling Requests

#### Background

AWS Lambda will run your code in response to events such as an HTTP request. In this step you'll build the core function that will process API requests from the web application to dispatch a unicorn. In the next module you'll use Amazon API Gateway to create a RESTful API that will expose an HTTP endpoint that can be invoked from your users' browsers. You'll then connect the Lambda function you create in this step to that API in order to create a fully functional backend for your web application.

#### High-Level Instructions

Use the AWS Lambda console to create a new Lambda function called `RequestUnicorn` that will process the API requests. Use the provided [requestUnicorn.js](requestUnicorn.js) example implementation for your function code. Just copy and paste from that file into the AWS Lambda console's editor.

Make sure to configure your function to use the `WildRydesLambda` IAM role you created in the previous section.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. Choose on **Services** then select **Lambda** in the Compute section.

1. Choose **Create a Lambda function**.

1. Choose the **Blank Function** blueprint card.

1. Don't add any triggers at this time. Choose **Next** to proceed to defining your function.

1. Enter `RequestUnicorn` in the **Name** field.

1. Optionally enter a description.

1. Select **Node.js 6.10** for the **Runtime**.

1. Copy and paste the code from [requestUnicorn.js](requestUnicorn.js) into the code entry area.

    ![Create Lambda function screenshot](../images/create-lambda-function.png)

1. Leave the default of `index.handler` for the **Handler** field.

1. Select `WildRydesLambda` from the **Existing Role** dropdown.

1. Choose **Next** and then choose **Create function** on the Review page.

    ![Define handler and role screenshot](../images/lambda-handler-and-role.png)

</p></details>

## Implementation Validation

For this module you will test the function that you built using the AWS Lambda console. In the next module you will add a REST API with API Gateway so you can invoke your function from the browser-based application that you deployed in the first module.

1. From the main edit screen for your function, select **Actions** then **Configure test event**.

    ![Configure test event](../images/configure-test-event.png)

1. Copy and paste the following test event into the editor:

    ```JSON
    {
        "path": "/ride",
        "httpMethod": "POST",
        "headers": {
            "Accept": "*/*",
            "Authorization": "eyJraWQiOiJLTzRVMWZs",
            "content-type": "application/json; charset=UTF-8"
        },
        "queryStringParameters": null,
        "pathParameters": null,
        "requestContext": {
            "authorizer": {
                "claims": {
                    "cognito:username": "the_username"
                }
            }
        },
        "body": "{\"PickupLocation\":{\"Latitude\":47.6174755835663,\"Longitude\":-122.28837066650185}}"
    }
    ```

1. Choose **Save and test**.

    ![Input test event screenshot](../images/input-test-event.png)

1. Verify that the execution succeeded and that the function result looks like the following:
```JSON
{
    "statusCode": 201,
    "body": "{\"RideId\":\"SvLnijIAtg6inAFUBRT+Fg==\",\"Unicorn\":{\"Name\":\"Rocinante\",\"Color\":\"Yellow\",\"Gender\":\"Female\"},\"Eta\":\"30 seconds\"}",
    "headers": {
        "Access-Control-Allow-Origin": "*"
    }
}
```

After you have successfully tested your new function using the Lambda console, you can move on to the next module, [RESTful APIs](../4_RESTfulAPIs).

</details>