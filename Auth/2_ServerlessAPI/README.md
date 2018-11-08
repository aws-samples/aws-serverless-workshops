# Module 2: Serverless API Authentication and Authorization

In this module, you will add a serverless API backend to our Wild Rydes application leveraging [Amazon API Gateway](https://aws.amazon.com/api-gateway/) and [AWS Lambda](https://aws.amazon.com/lambda/). You will then enable authentication and authorization on your API to secure the backend to only accept valid, authorized requests.

## Solution Architecture

Building on Module 1, this module will add a Serverless backend API built using Amazon API Gateway and AWS Lambda. For persistence, we will use Amazon DynamoDB as a NoSQL data store. All of the above services are serverless so you can seamlessly scale your application as your demands grow. After creating the API, we will integrate our client application to call it via the AWS Amplify library.

![Module 2 architecture](../images/wildrydes-module2-architecture.png)

## Implementation Overview

Each of the following sections provides an implementation overview and detailed, step-by-step instructions. The overview should provide enough context for you to complete the implementation if you're already familiar with the AWS Management Console or you want to explore the services yourself without following a walkthrough.

If you're using the latest version of the Chrome, Firefox, or Safari web browsers the step-by-step instructions won't be visible until you expand the section.

### 1. Create Serverless API backend stack from CloudFormation template

You will be creating your Serverless API built with Amazon API Gateway, AWS Lambda, and Amazon DynamoDB via a CloudFormation template. Since this workshop is focused on authentication and authorization, this template will create the backend infrastructure, but not enable any security settings and the rest of the module will enable and configure such settings.

#### High-Level Instructions

Create a new CloudFormation stack by uploading the **ServerlessAPI.yaml** file in the module 2 folder. Name the stack `WildRydesAPI`.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. Go the AWS Management Console, click **Services** then select **CloudFormation** under Management Tools.

1. In the CloudFormation console, click **Create stack** and in Step 1, choose **Upload a template file**. Upload the **ServerlessAPI.yaml** CloudFormation template found in the module 2 folder within the Auth workshop folder and click **Next**.

1. On the next screen, Step 2, enter a Stack such as `WildRydesAPI` and click **Next**.

1. On the Configure Stack Options page, accept all the defaults and click **Next**.

1. Choose to **Acknwledge that the CloudFormation template may create IAM resources with custom names**. Finally, click **Create stack**.

1. It will take a few minutes for the Stack to create. Wait until the stack is fully launched and shows a Status of **CREATE_COMPLETE**.

1. With the `WildRydesAPI` stack selected, click on the **Outputs** tab and copy the value shown for the `WildRydesApiInvokeUrl` to the clipboard.

</p></details>

### 2. Integrate API into Wild Rydes application

Now that you have created our Serverless backend API, you need to update your Wild Rydes web application to integrate with it. You will leverage the AWS Amplify client library to make API calls and inject security seamlessly to support your authentication and authorization scenarios.

#### High-Level Instructions

First, expand your amplify-config.js file to store your new API Gateway endpoint. Next, within MainApp.js under pages, enable the hasAPI method by uncommenting its functionality. Additionally, update the getData method to capture the latitude and longitude selected on the map and send to the API as a PickupLocation object.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

First, you need to update the `amplify-config.js` file under the src directory to include your new API Gateway endpoint. Store the endpoint including the /prod at the end in the endpoint property under the `WildRydesAPI` setting.

Note: Do not change the name `WildRydesAPI` in this file or later functionality in the workshop will not work. An example of the API configuration portion of the amplify-config file after updating the configuration properly is shown below:

```
  API: {
        endpoints: [
            {
                name: 'WildRydesAPI',
                endpoint: 'https://1ngrgqjt6c.execute-api.us-east-1.amazonaws.com/prod'
            }
        ]
    },
```

Next, you need to enable the hasAPI method by uncommenting its code within MainApp.js under the pages folder.

```
  hasApi() {
    const api = awsConfig.API.endpoints.filter(v => v.endpoint !== '');                                                   
    return (typeof api !== 'undefined');
  }
```

Finally, within the same file, we will implement the API request for a ride as a POST request to our API which sends a body containing the requested latitude and longitude as the pickup location. Update the getData() method to be as follows:

```
  async getData(pin) {
    Amplify.Logger.LOG_LEVEL = 'DEBUG';
    const apiRequest = {
      body: {
        PickupLocation: {
          Longitude: pin.longitude,
          Latitude: pin.latitude
        }
      },
      headers: {
        'Authorization': '', // To be updated
        'Content-Type': 'application/json'
      }
    };
    logger.info('API Request:', apiRequest);
    return await API.post(apiName, apiPath, apiRequest);
  }
```
</p></details>

### 3. Validate API functionality and integration with our Wild Rydes app

Now that you've integrated code changes to call your new Serverless API, you should test the end-to-end user experience to ensure the application is working correctly. The backend API currently requires no authentication so any request will currently be accepted until we enable required authentication.

#### High-Level Instructions

Go back to your browser tab with Wild Rydes running and sign-in again at **/signin**. Once signed in, click anywhere on the map to indicate a pickup location, then select the **Request** button to call your ride.

You should be informed of your unicorn's arrival momentarily.

### 4. Enable API Gateway authentication with Cognito User Pools

#### Background
Amazon API Gateway can use the JSON Web tokens (JWT) returned by Cognito User Pools to authenticate API calls. In this step you'll configure an authorizer for your API to use the user pool you created in [module 1](../1_UserAuthentication).

#### High-Level Instructions
In the Amazon API Gateway console, create a new Cognito user pool authorizer for your API. Configure it with the details of the user pool that you created in the previous module. You can test the configuration in the console by copying and pasting the auth token presented to you after you log in via the /signin path of your current website. Once setup, you will change your application's code to send the proper JSON web token with its API requests to authenticate.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. Under your newly created API, choose **Authorizers**.

1. Chose **Create New Authorizer**.

1. Enter `WildRydes` for the Authorizer name.

1. Select **Cognito** for the type.

1. In the Region drop-down under **Cognito User Pool**, select the Region where you created your Cognito user pool in the last module (by default the current region should be selected).

1. Enter `WildRydes` (or the name you gave your user pool) in the **Cognito User Pool** input.

1. Enter `Authorization` for the **Token Source**.

1. Leave `Token Validation` **blank** without editing.

1. Choose **Create**.

    ![Create user pool authorizer screenshot](../images/create-user-pool-authorizer.png)

#### Verify your authorizer configuration

1. In a different browser tab, return to your Wild Rydes application and  sign-in if you're not already signed in. After signing in, you should be redirected to `/app`

1. Open your browser's developer console and browse to the console log output section.

1. Look for the console log to say `Cognito User Identity Token:` and a long string beneath the message.

1. Copy the long string to your clipboard without the intro message.

1. Go back to previous tab where you have just finished creating the Authorizer.

1. Click **Test** at the bottom of the card for the authorizer.

1. Paste the auth token into the **Authorization Token** field in the popup dialog.

    ![Test Authorizer screenshot](../images/apigateway-test-authorizer.png)

1. Click **Test** button and verify that the response code is 200 and that you see the claims for your user displayed.

#### Require Cognito authentication for API Gateway

1. Browse to `Resources` while within your Wild Rydes API in the API Gateway console.

1. Select the `POST` method under the `/ride` resource path.

1. Choose `Method Request`

1. Choose the pencil icon next to `Authorization` to edit the setting.

1. Select your new Cognito Authorizer from the list of options presented.

1. **Save** your selection by clicking the checkmark icon next to the drop down.

1. Next, choose the **Actions** button at the top of the resources list.

1. Choose **Deploy API** from the list of options presented.

1. For deployment stage, select `prod` then click **Deploy**.

1. You've now successfully deployed your new authentication integration to your API's production environment.

#### Configure your Wild Rydes web app to authenticate API requests

1. Now that you've deployed the new authorizer configuration to production, all API requests must be authenticated to be processed.

1. Return to your Wild Rydes app, sign in if necessary, and attempt to request a ride.

1. You should receive an "Error finding unicorn." If you open the developer console, you will see that we received a HTTP 401 error, which means it was an unauthorized request. To authenticate our requests properly, we need to send an Authorization header.

1. Go back to Cloud9 and open the `src/pages/MainApp.js` files.

1. Browse down to the `getData` method you previously updated. You will notice that the headers for the request currently include a blank `Authorization` header.

1. Replace your current `getData` method with the following code which sends your user's Cognito identity token, encoded as a JSON web token, in the `Authorization` header with every request.

```
  async getData(pin) {
    Amplify.Logger.LOG_LEVEL = 'DEBUG';
    const apiRequest = {
      body: {
        PickupLocation: {
          Longitude: pin.longitude,
          Latitude: pin.latitude
        }
      },
      headers: {
        'Authorization': this.state.idToken,
        'Content-Type': 'application/json'
      }
    };
    logger.info('API Request:', apiRequest);
    return await API.post(apiName, apiPath, apiRequest);
  }
```

1. Allow the application to refresh, sign-in again, and request a ride.

1. The unicorn ride request should be fulfilled as before now. To see the full request headers which were sent, look at the developer console for an INFO message which includes the API Request details once expanded, including the full headers and body of the request.

</p></details>

If the API now invokes correctly and application funcions as expected again, you can move on to the next module, [IAM-based Authorization](../3_IAMAuthorization).