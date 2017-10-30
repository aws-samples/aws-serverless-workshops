# Module 5: SNS Topic and Notifications To Lambda Functions

![SNS Notification Architecture](../images/sns-notification-architecture.png)

The diagram above shows how the SNS component you will build in this module integrates with the existing components you built previously. The grayed out items are pieces you have already implemented in previous steps.

This module will focus on integration of SNS to your current architecture. The existing NodeJS code "requestUnicorn.js" has been altered slightly to publish a message to an SNS topic.  

You may also notice that a new file "tallyUnicorn.js" has been introduced. This contains code for the new lambda function in which will need to be subscribed to the SNS topic in order to receive messages. Once the message is received, it will proceed to update a separate DynamoDB table that keeps track of the number of times each unicorn has been dispatched so far. 

This module will also be a challenge as it will take your knowledge from module 3 in which you will add on serverless code to provision one more Lambda and DynamoDB table.

Lets Begin!   

## Implementation Instructions

The primary focus here is learning how to use the serverless framework to provision the necessary services for our backend application. 

You may notice that some reference materials are from the official Cloudformation and others from Serverless. That is because for various things, there is a 1:1 overlap in syntax that Serverless relies on Cloudformation for documentation  (i.e. specifying <b>resources:</b>).  

If you wish to know more, visit the <a target="_blank" href="https://serverless.com/framework/docs/">serverless website</a>. You will notice that there are adaptations for Azure, Google Cloud, AWS and so forth. Since we are using AWS, you should look there.  

<br>

### 1. Prerequisites

1. Install Node version 6.10 (https://nodejs.org/en/) if you have not done so yet.  
2. Run "npm install npm@latest -g" in CLI - updates to the latest NPM version 
3. Run "npm install -g serverless" in CLI - installs the serverless utility on your machine so it can be run in anywhere  
4. Choose a code editor (i.e. Atom, Visual Code etc) and open WebApplication/4_RESTfulAPIs project folder 

<br>

### 2. Create DynamoDB table

At this point in time, you should already have the serverless.yml code to provision the DynamoDB table that records the rides. We need one more table to store a counter of the number of times each unicorn gets dispatched. For simplicity, the unicorns will be uniquely identified by their name.  

To help you get started, you may paste the snippet just below everything in the <b>RidesTable</b> stanzas. 

```YAML
    UnicornsTable:
      Type: {RESOURCE_TYPE}
      Properties:
        TableName: {TABLE_NAME}
        AttributeDefinitions:
          -
            AttributeName: {ATTRIBUTE_NAME}
            AttributeType: S
        KeySchema:
          -
            AttributeName: {ATTRIBUTE_NAME}
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```  

As before, you need to figure out the few missing variables. For your reference, you can look <a target="_blank" href="https://serverless.com/framework/docs/providers/aws/guide/resources/#aws-cloudformation-resource-reference">here</a> to get the value for <b>RESOURCE_TYPE</b>. Secondly, look into tallyUnicorn.js to retrieve the <b>TABLE_NAME</b> and <b>ATTRIBUTE_NAME</b>.  

Once finished, you should have something that looks like below:  

<details>
<summary><strong>See answer (expand for details)</strong></summary>

```YAML
    UnicornsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: Unicorns
        AttributeDefinitions:
          -
            AttributeName: Name
            AttributeType: S
        KeySchema:
          -
            AttributeName: Name
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```
</details>  

<br>

### 3. Create new Lambda and Subscribe to SNS Topic

The next task is hooking up a Lambda function to an SNS topic. The beauty with serverless is that you can hook up a Lambda function to a topic without having to worry about explicitly creating it. Serverless handles that for you. If you want to learn more, you can look <a target="_blank" href="https://serverless.com/framework/docs/providers/aws/events/sns/">here</a>.  

Lets start by adding in a snippet below the existing <b>RidesHandler</b> lambda function. The handler function is in tallyUnicorn.js. With that information you should be able to resolve the value of <b>HANDLER_FUNCTION</b>. The topic name can be one of your choosing.   

```YAML
  UnicornsHandler:
    handler: {HANDLER_FUNCTION}
    events:
      - sns: {TOPIC_NAME}
```

The topic name you have decided on will be important detail from here on as it you will need it to reference it in several parts of the yaml. 

<details>
<summary><strong>See answer (expand for details)</strong></summary>

```YAML
  UnicornsHandler:
    handler: tallyUnicorn.handler
    events:
      - sns: DispatchUnicorn
```
</details>  

<br>

### 4. Update Lambda policy to allow sending SNS notifications

If you look into <b>requestUnicorn.js</b> on line 76, you will see that we are attempting to use SNS to publish a message to a topic. The issue here is that we will have insufficient permissions to do that.  

Lets look back into the serverless.yml file at the stanza <b>iamRoleStatements</b>. For starters, you can copy and paste the snippet below the existing policy.  

```YAML
    - Effect: "Allow"
      Action:
        - "{SERVICE_NAMESPACE}:{API_METHOD}"
      Resource:
        Fn::Join:
          - ':'
          - - "arn:aws:sns"
            - Ref: "{AWS_REGION}"
            - Ref: "{AWS_ACCOUNT_ID}"
            - "{TOPIC_NAME}"
```  

We need to figure out a few variables here for our new policy. Recall that in any event you are unsure how to construct the policy above you can look into the online resources below: 

1. <a target="_blank" href="http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#genref-aws-service-namespaces">Find the <b>SERVICE_NAMESPACE</b></a>

2. <a target="_blank" href="http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/api-permissions-reference.html">Find the <b>API_METHOD</b></a>

If you are unfamiliar with the Join syntax above, what's happening here is that we are asking it to do a string join consisting of various components as listed below: 
1. The Amazon service namespace
2. AWS region
3. AWS account id
4. Topic name

To achieve that we invoke Cloudformation's intrinsic functions, specifically "Fn::Join" in which you can read more about <a target="_blank" href="http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html">here</a>.  

With that said, we need to set the region and account id. We have two choices here...
1. Hardcode the region and account id.
2. Use Cloudformation's pseudo parameters (parameters defined by Cloudformation)

We should opt for (2) as that means we don't tie the code to a specific account and region. The best online resources documenting pesudo parameters can be found <a target="_blank" href="http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html">here</a>.  

We also want to find the appropriate value for <b>TOPIC_NAME</b>. If you look back to the prior section (3) where we created the Lambda that subscribes to a topic you should be able to retrieve the topic name.  

There are two arguments here as denoted by the first column of (-) characters. The first is the delimiter between each component which we specify it as a colon. The second is just a list of strings. Essentially this evaluates to a string that hypothetically looks like "arn:aws:sns:ap-southeast-1:66666666:SomeTopicName".  

Once completed, we should end up with something that looks similar to:

<details>
<summary><strong>See answer (expand for details)</strong></summary>

```YAML
    - Effect: "Allow"
      Action:
        - "sns:Publish"
      Resource:
        Fn::Join:
          - ':'
          - - "arn:aws:sns"
            - Ref: "AWS::REGION"
            - Ref: "AWS::ACCOUNT_ID"
            - "DispatchUnicorn"
``` 

</details>

<br>

### 5. Supply Topic Arn as an environment variable to Lambda

One important detail we have yet to supply is the topic arn to the requestUnicorn lambda function. If you look at the function starting on line 80, you will notice that it is expecting a topic arn supplied as an environment variable.  

You can read more about specifying environment variables <a target="_blank" href="https://serverless.com/framework/docs/providers/aws/guide/functions/#environment-variables">here</a>.

Now that we know the topic name, lets provide the environment variable like below.  

```YAML
  RidesHandler:
    handler: ...
    events:
      ...
    environment:
      {ENVIRONMENT_VAR_NAME}:
        Fn::Join:
          - ':'
          - - "arn:aws:sns"
            - Ref: "{AWS_REGION}"
            - Ref: "{AWS_ACCOUNT_ID}"
            - "{TOPIC_NAME}"
```

Go ahead and fill in the environment variable. Using what you have learnt from the prior section, you should be able to also fill in the remaining blanks that compose the topic Arn. Your environment stanzas should look something like the snippet below. 

<details>
<summary><strong>See answer (expand for details)</strong></summary>

```YAML
    environment:
      dispatchUnicornTopicArn:
        Fn::Join:
          - ':'
          - - "arn:aws:sns"
            - Ref: "AWS::Region"
            - Ref: "AWS::AccountId"
            - "DispatchUnicorn"
```  

</details>

<br>

### 6. Update IAM Policy for new Lambda function

There is one remaining task we have to complete here which is to add a new policy to <b>iamRoleStatements</b> so our Lambda can write to the new DynamoDB table.  

If we look into tallyUnicorn.js, the first function <b>updateDispatchedUnicornCount</b> invokes the DynamoDB service to increment a tally for the dispatched unicorn. We can update the policy by tacking on the new DynamoDB table Arn and the new API service to the existing stanza. So, it will look akin to the snippet below. 

```YAML
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "dynamodb:PutItem"
        - "dynamodb:{API_SERVICE}"
      Resource: 
        - "Fn::GetAtt": [RidesTable, Arn]
        - "Fn::GetAtt": [{TABLE_NAME}, Arn]
```

You will have to fill in the values of <b>API_SERVICE</b> and <b>TABLE_NAME</b> here.  

Remember that you can find the <b>API_SERVICE</b> in the <a target="_blank" href="http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/api-permissions-reference.html">AWS documentation</a>.

To retrieve the logical table name, look back into the serverless.yml where you specified the new table.  

You should something that looks like below: 

```YAML
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "dynamodb:PutItem"
        - "dynamodb:UpdateItem"
      Resource: 
        - "Fn::GetAtt": [RidesTable, Arn]
        - "Fn::GetAtt": [UnicornsTable, Arn]
```

<br>

### 7. Deploy and Testing the new functionality

We should now deploy what we have. Run "serverless deploy" in the CLI and wait until it completes.  

Now, its time to test to see if everything works as expected. What we can do here is navigate to the web application you created back in module 1, login and request a unicorn. Take note of its name as well.  

We can verify that stuff works by either: 
1. Log into the AWS console and look for the DynamoDB unicorns table. You should see an entry there for the unicorn and a DispatchCount field that has a value of 1 or however many times it has been dispatched.  

2. Use AWS CLI and run <b>"aws dynamodb get-item --table-name Unicorns --key '{"Name": {"S": "Shadowfax"}}'"</b>. You will then receive a JSON response that looks a bit like:
```JSON
{
    "Item": {
        "Name": {
            "S": "Shadowfax"
        }, 
        "DispatchCount": {
            "N": "1"
        }
    }
}
```




<!-- <br>
<details>
<summary><strong>Manual steps (expand for details)</strong></summary>

## Implementation Instructions

Each of the following sections provide an implementation overview and detailed, step-by-step instructions. The overview should provide enough context for you to complete the implementation if you're already familiar with the AWS Management Console or you want to explore the services yourself without following a walkthrough.

If you're using the latest version of the Chrome, Firefox, or Safari web browsers the step-by-step instructions won't be visible until you expand the section.

### 1. Create a New REST API
Use the Amazon API Gateway console to create a new API.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console, click **Services** then select **API Gateway** under Application Services.

1. Choose **Create API**.

1. Select **New API** and enter `WildRydes` for the **API Name**.

1. Choose **Create API**

    ![Create API screenshot](../images/create-api.png)

</p></details>


### 2. Create a Cognito User Pools Authorizer

#### Background
Amazon API Gateway can use the JWT tokens returned by Cognito User Pools to authenticate API calls. In this step you'll configure an authorizer for your API to use the user pool you created in [module 2](../2_UserManagement).

#### High-Level Instructions
In the Amazon API Gateway console, create a new Cognito user pool authorizer for your API. Configure it with the details of the user pool that you created in the previous module. You can test the configuration in the console by copying and pasting the auth token presented to you after you log in via the /signin.html page of your current website.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. Under your newly created API, choose **Authorizers**.

1. Chose **Create New Authorizer**.

    ![Create user pool authorizer screenshot](../images/create-user-pool-authorizer.png)

1. Enter `WildRydes` for the Authorizer name.

1. Select **Cognito** for the type.

1. In the Region drop-down under **Cognito User Pool**, select the Region where you created your Cognito user pool in module 2.

1. Enter `WildRydes` (or the name you gave your user pool) in the **Cognito User Pool** input.

1. Enter `Authorization` for the **Token Source**.

1. Choose **Create**.

#### Verify your authorizer configuration

1. Open a new browser tab and visit `/ride.html` under your website's domain.

1. If you are redirected to the sign-in page, sign in with the user you created in the last module. You will be redirected back to `/ride.html`.

1. Copy the auth token from the notification on the `/ride.html`, and paste it into the **Identity token** field in the API Gateway console tab.

1. Choose **Test** and verify that you see the claims for your user displayed.

</p></details>

### 3. Create a new resource and method
Create a new resource called /ride within your API. Then create a POST method for that resource and configure it to use a Lambda proxy integration backed by the RequestUnicorn function you created in the first step of this module.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the left nav, click on **Resources** under your WildRydes API.

1. From the **Actions** dropdown select **Create Resource**.

1. Enter `ride` as the **Resource Name**.

1. Ensure the **Resource Path** is set to `ride`.

1. Click **Create Resource**.

1. With the newly created `/ride` resource selected, from the **Action** dropdown select **Create Method**.

1. Select `POST` from the new dropdown that appears, then click the checkmark.

    ![Create method screenshot](../images/create-method.png)

1. Select **Lambda Function** for the integration type.

1. Check the box for **Use Lambda Proxy integration**.

1. Select the Region you are using for **Lambda Region**.

1. Enter the name of the function you created in the previous module, `RequestUnicorn`, for **Lambda Function**.

1. Choose **Save**. Please note, if you get an error that you function does not exist, check that the region you selected matches the one you used in the previous module.

    ![API method integration screenshot](../images/api-integration-setup.png)

1. When prompted to give Amazon API Gateway permission to invoke your function, choose **OK**.

1. Choose on the **Method Request** card.

1. Choose the pencil icon next to **Authorization**.

1. Select the WildRydes Cognito user pool authorizer from the drop-down list, and click the checkmark icon.

    ![API authorizer configuration screenshot](../images/api-authorizer.png)

</p></details>

### 4. Enable CORS
Modern web browsers prevent HTTP requests from scripts on pages hosted on one domain to APIs hosted on another domain unless the API provides cross-origin resource sharing (CORS) response headers that explicitly allow them. In the Amazon API Gateway console you can add the necessary configuration to send the appropriate CORS headers under the action menu when you have a resource selected. You should enable CORS for POST and OPTIONS on your /ride resource. For simplicity, you can set the Access-Control-Allow-Origin header value to '\*', but in a production application you should always explicitly whitelist authorized domains to mitigate [cross-site request forgery (CSRF)](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_%28CSRF%29) attacks.

For more information about CORS configurations in general, see https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the Amazon API Gateway console, in the middle panel, select the `/ride` resource.

1. From the **Actions** drop-down list select **Enable CORS**.

1. Use the default settings and choose **Enable CORS and replace existing CORS headers**.

1. Choose **Yes, replace existing values**.

1. Wait for a checkmark to appear next to all the steps.

</p></details>

### 5. Deploy Your API
From the Amazon API Gateway console, choose Actions, Deploy API. You'll be prompted to create a new stage. You can use prod for the stage name.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the **Actions** drop-down list select **Deploy API**.

1. Select **[New Stage]** in the **Deployment stage** drop-down list.

1. Enter `prod` for the **Stage Name**.

1. Choose **Deploy**.

1. Note the **Invoke URL**. You will use it in the next section.

</p></details>

### 6. Update the Website Config
Update the /js/config.js file in your website deployment to include the invoke URL of the stage you just created. You should copy the invoke URL directly from the top of the stage editor page on the Amazon API Gateway console and paste it into the \_config.api.invokeUrl key of your sites /js/config.js file. Make sure when you update the config file it still contains the updates you made in the previous module for your Cognito user pool.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

If you completed module 2 manually, you can edit the `config.js` file you have saved locally. If you used the AWS CloudFormation template, you must first download the `config.js` file from your S3 bucket. To do so, visit `/js/config.js` under the base URL for your website and choose **File**, then choose **Save Page As** from your browser.

1. Open the config.js file in a text editor.

1. Update the **invokeUrl** setting under the **api** key in the config.js file. Set the value to the **Invoke URL** for the deployment stage your created in the previous section.

    An example of a complete `config.js` file is included below. Note, the actual values in your file will be different.

    ```JavaScript
    window._config = {
        cognito: {
            userPoolId: 'us-west-2_uXboG5pAb', // e.g. us-east-2_uXboG5pAb
            userPoolClientId: '25ddkmj4v6hfsfvruhpfi7n4hv', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
            region: 'us-west-2' // e.g. us-east-2
        },
        api: {
            invokeUrl: 'https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod,
        }
    };
    ```

1. Save your changes locally.

1. In the AWS Management Console, choose **Services** then select **S3** under Storage.

1. Choose your website bucket and then browse to the `js` key prefix.

1. Choose **Upload**.

1. Choose **Add files**, select the local copy of `config.js` and then click **Next**.

1. Choose **Next** without changing any defaults through the `Set permissions` and `Set properties` sections.

1. Choose **Upload** on the `Review` section.

</p></details>

## Implementation Validation

**Note:** It's possible that you will see a delay between updating the config.js file in your S3 bucket and when the updated content is visible in your browser. You should also ensure that you clear your browser cache before executing the following steps.

1. Visit `/ride.html` under your website domain.

1. If you are redirected to the sign in page, sign in with the user you created in the previous module.

1. After the map has loaded, click anywhere on the map to set a pickup location.

1. Choose **Request Unicorn**. You should see a notification in the right sidebar that a unicorn is on its way and then see a unicorn icon fly to your pickup location.

Congratulations, you have completed the Wild Rydes Web Application Workshop! Check out our [other workshops](../../README.md#workshops) covering additional serverless use cases.

See this workshop's [cleanup guide](../9_CleanUp) for instructions on how to delete the resources you've created.

</details> -->