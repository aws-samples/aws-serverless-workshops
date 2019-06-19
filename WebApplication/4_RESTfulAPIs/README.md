# Module 4: RESTful APIs with AWS Lambda and Amazon API Gateway

In this module you'll use API Gateway to expose the Lambda function you built in the [previous module][serverless-backend] as a RESTful API. This API will be accessible on the public Internet. It will be secured using the Amazon Cognito user pool you created in the [User Management][user-management] module. Using this configuration you will then turn your statically hosted website into a dynamic web application by adding client-side JavaScript that makes AJAX calls to the exposed APIs.

![Dynamic web app architecture](../images/restful-api-architecture.png)

The diagram above shows how the API Gateway component you will build in this module integrates with the existing components you built previously. The grayed out items are pieces you have already implemented in previous steps.

The static website you deployed in the first module already has a page configured to interact with the API you'll build in this module. The page at /ride.html has a simple map-based interface for requesting a unicorn ride. After authenticating using the /signin.html page, your users will be able to select their pickup location by clicking a point on the map and then requesting a ride by choosing the "Request Unicorn" button in the upper right corner.

This module will focus on the steps required to build the cloud components of the API, but if you're interested in how the browser code works that calls this API, you can inspect the [ride.js](../1_StaticWebHosting/website/js/ride.js) file of the website. In this case the application uses jQuery's [ajax()](https://api.jquery.com/jQuery.ajax/) method to make the remote request.

## Implementation Instructions

:heavy_exclamation_mark: Ensure you've completed the [Serverless Backend][serverless-backend] step before beginning
the workshop.

Each of the following sections provides an implementation overview and detailed, step-by-step instructions. The overview should provide enough context for you to complete the implementation if you're already familiar with the AWS Management Console or you want to explore the services yourself without following a walkthrough.

### 1. Create a New REST API
Use the Amazon API Gateway console to create a new API named `WildRydes`.

**:white_check_mark: Step-by-step directions**
1. Go to the [Amazon API Gateway Console][api-gw-console]
1. Choose **Create API**.
1. Select **REST**, **New API** and enter `WildRydes` for the **API Name**.
1. Select `Edge optimized` from the **Endpoint Type** dropdown.
    ***Note***: Edge optimized are best for public services being accessed from the Internet. Regional endpoints are typically used for APIs that are accessed primarily from within the same AWS Region. Private APIs are for internal services inside of an Amazon VPC.
1. Choose **Create API**

    ![Create API screenshot](../images/create-api.png)

### 2. Create a Cognito User Pools Authorizer

#### Background
Amazon API Gateway can use the JWT tokens returned by Cognito User Pools to authenticate API calls. In this step you'll configure an authorizer for your API to use the user pool you created in [User Management][user-management].

#### High-Level Instructions
In the Amazon API Gateway console, create a new Cognito user pool authorizer for your API. Configure it with the details of the user pool that you created in the previous module. You can test the configuration in the console by copying and pasting the auth token presented to you after you log in via the /signin.html page of your current website.

**:white_check_mark: Step-by-step directions**
1. Under your newly created API, choose **Authorizers**.
1. Choose **Create New Authorizer**.
1. Enter `WildRydes` for the Authorizer name.
1. Select **Cognito** for the type.
1. In the Region drop-down under **Cognito User Pool**, select the Region where you created your Cognito user pool in the User Management module (by default the current region should be selected).
1. Enter `WildRydes` (or the name you gave your user pool) in the **Cognito User Pool** input.
1. Enter `Authorization` for the **Token Source**.
1. Choose **Create**.

    ![Create user pool authorizer screenshot](../images/create-user-pool-authorizer.png)

#### Verify your authorizer configuration

**:white_check_mark: Step-by-step directions**
1. Open a new browser tab and visit `/ride.html` under your website's domain.
1. If you are redirected to the sign-in page, sign in with the user you created in the last module. You will be redirected back to `/ride.html`.
1. Copy the auth token from the notification on the `/ride.html`,
1. Go back to previous tab where you have just finished creating the Authorizer
1. Click **Test** at the bottom of the card for the authorizer.
1. Paste the auth token into the **Authorization Token** field in the popup dialog.
    ![Test Authorizer screenshot](../images/apigateway-test-authorizer.png)

1. Click **Test** button and verify that the response code is 200 and that you see the claims for your user displayed.

### 3. Create a new resource and method
Create a new resource called /ride within your API. Then create a POST method for that resource and configure it to use a Lambda proxy integration backed by the RequestUnicorn function you created in the first step of this module.

**:white_check_mark: Step-by-step directions**
1. In the left nav, click on **Resources** under your WildRydes API.
1. From the **Actions** dropdown select **Create Resource**.
1. Enter `ride` as the **Resource Name**.
1. Ensure the **Resource Path** is set to `ride`.
1. Select **Enable API Gateway CORS** for the resource.
1. Click **Create Resource**.

    ![Create resource screenshot](../images/create-resource.png)

1. With the newly created `/ride` resource selected, from the **Action** dropdown select **Create Method**.
1. Select `POST` from the new dropdown that appears, then **click the checkmark**.

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

### 4. Deploy Your API
From the Amazon API Gateway console, choose Actions, Deploy API. You'll be prompted to create a new stage. You can use prod for the stage name.

**:white_check_mark: Step-by-step directions**
1. In the **Actions** drop-down list select **Deploy API**.
1. Select **[New Stage]** in the **Deployment stage** drop-down list.
1. Enter `prod` for the **Stage Name**.
1. Choose **Deploy**.
1. Note the **Invoke URL**. You will use it in the next section.

### 5. Update the Website Config
Update the /js/config.js file in your website deployment to include the invoke URL of the stage you just created. You should copy the invoke URL directly from the top of the stage editor page on the Amazon API Gateway console and paste it into the \_config.api.invokeUrl key of your sites /js/config.js file. Make sure when you update the config file it still contains the updates you made in the previous module for your Cognito user pool.

**:white_check_mark: Step-by-step directions**
1. On your Cloud9 development environment open `js/config.js`
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

1. Save the modified file making sure the filename is still `config.js`.
1. Commit the changes to your git repository:
    ```
    $ git add js/config.js 
    $ git commit -m "configure api invokeURL"
    $ git push
    ...
    Counting objects: 4, done.
    Compressing objects: 100% (4/4), done.
    Writing objects: 100% (4/4), 422 bytes | 422.00 KiB/s, done.
    Total 4 (delta 3), reused 0 (delta 0)
    To https://git-codecommit.us-east-1.amazonaws.com/v1/repos/wildrydes-site
       c15d5d5..09f1c9a  master -> master
    ```

    [Amplify Console][amplify-console-console] should pick up the changes and begin building and deploying your web application. Watch it to verify the completion of the deployment.

## Implementation Validation

**:white_check_mark: Step-by-step directions**
1. Visit `/ride.html` under your website domain.
1. If you are redirected to the sign in page, sign in with the user you created in the previous module.
1. After the map has loaded, click anywhere on the map to set a pickup location.
1. Choose **Request Unicorn**. You should see a notification in the right sidebar that a unicorn is on its way and then see a unicorn icon fly to your pickup location.

### :star: Recap

:key: [Amazon API Gateway][api-gw] is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. You can easily plug in Authorization via [Amazon Cognito][cognito] and backends such as [AWS Lambda][lambda] to create completely serverless APIs.

:wrench: In this module you've used API Gateway to provide a REST API to the Lambda function created in the previous module. From there you've updated the website to use the API endpoint so that you can request rides and the information about the ride is saved in the DynamoDB table created earlier.

:star: Congratulations, you have completed the Wild Rydes Web Application Workshop! Check out our [other workshops](../../README.md#workshops) covering additional serverless use cases.

### Next

:white_check_mark: See this workshop's [cleanup guide][cleanup] for instructions on how to delete the resources you've created.

[amplify-console]: https://aws.amazon.com/amplify/console/
[amplify-console-console]: https://console.aws.amazon.com/amplify/home
[api-gw]: https://aws.amazon.com/api-gateway/
[api-gw-console]: https://console.aws.amazon.com/apigateway/home
[cleanup]: ../9_CleanUp/
[cognito-console]: https://console.aws.amazon.com/cognito/home
[cognito]: https://aws.amazon.com/cognito/
[configjs]: ../1_StaticWebHosting/website/js/config.js
[dynamodb-console]: https://console.aws.amazon.com/dynamodb/home
[dynamodb]: https://aws.amazon.com/dynamodb/
[iam-console]: https://console.aws.amazon.com/iam/home
[jwt-decoder]: https://jwt.io/
[lambda-console]: https://console.aws.amazon.com/lambda/home
[lambda]: https://aws.amazon.com/lambda/
[restful-apis]: ../4_RESTfulAPIs/
[serverless-backend]: ../3_ServerlessBackend/
[setup]: ../0_Setup/
[static-web-hosting]: ../1_StaticWebHosting/
[user-management]: ../2_UserManagement/