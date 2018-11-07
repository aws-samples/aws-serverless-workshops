# Module 1: User Authentication

In this module, you will create an Amazon Cognito User Pool and Identity Pool for the wild rydes application.
The Cognito User Pool will store user profile information and provide sign-up and sign-in capabilities, with the Cognito Identity Pool providing the ability to assume an Identity and Access Management (IAM) role from within the application.

Since Wild Rydes is a ride sharing application, a key requirement is that all users must sign-up and sign-in before they're allowed to request a ride. You will configure the application to integrate with [Amazon Cognito](https://aws.amazon.com/cognito/) for these purposes via the [AWS Amplify JavaScript library](https://aws-amplify.github.io/).

## Solution Architecture

The architecture for this module is very straightforward. All of your static web content including HTML, CSS, JavaScript, images and other files will be served locally from your Cloud9 workspace. As you made changes to the website application code, all changes will be automatically updated and shown in your browser via live reload capabilities.

For this module, we will be configuring our application to use the AWS Amplify library to easily integrate Amazon Cognito into our application.

![Website architecture](../images/wildrydes-module1-architecture.png)

## Implementation Overview

### Running the website locally

1. From your Cloud9 workspace, select the terminal window and when you are within your website directory, run the following command to start the local web server 

    ```console
    yarn start
    ```

    Wait for the development server to start. You can ignore any message saying *Compiled with warnings* as we will resolve these warnings as we add our functionality to the application.


2. Now that the development server has started, click **Preview** in the top of the screen next to the Run button.

    ![Cloud9 Preview](../images/cloud9-local-preview.png)  

3. The web application will load in a small window next to the terminal at the bottom of the Cloud9 IDE. Click the **re-size button** next to the word **Browser** to open this window in a new tab.

    ![Cloud9 Preview Re-size](../images/cloud9-resize-live-preview.png)   

   As you make changes to the web application, this tab will automatically refresh to reflect your changes. Leave this tab open and return to the Cloud9 IDE tab to continue the workshop.

   Though the Wild Rydes website may look function, there is currently no integration for sign-up or sign-in requests to go anywhere.

### Creating a Cognito User Pool

Amazon Cognito lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily. In this step, we'll create a Cognito user pool for use with our Wild Rydes app.

#### High-Level Instructions

Use the AWS console to create an Amazon Cognito User Pool adding a custom attribute named `profile_picture` and requiring multi-factor authentication via SMS message.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console choose **Services** then select **Cognito** under Security, Identity, and Compliance.

1. Choose your desired **Region** in top-right of the console if not already chosen.

1. Choose **Manage User Pools**.

1. Choose **Create a User Pool** in the top right of the console.

1. Provide a name for your user pool such as `wild-rydes`.

1. Choose **Step through settings** to configure our user pool options.

![User Pool Setup Step 1](../images/cognito-userpool-setup-step1.png)

1. Leave **Username** checked, but additionally select *Also allow sign in with verified email address* and *Also allow sign in with verified phone number*.

1. At the bottom of the screen, choose **Add custom attribute** and add a string attribute named `profile_picture`. Leave the attribute set as mutable with a max length of 256 characters.

![User Pool Setup Step 2](../images/cognito-userpool-setup-step2.png)

1. Choose **Next**.

1. Leave password policies and user sign up settings set to default settings and choose **Next**.

![User Pool Setup Step 3](../images/cognito-userpool-setup-step3.png)

1. Choose to set MFA as **Required** as we want to enforce additional security in our application.

1. Choose to enable SMS text message as the second factor authentication option.

1. Choose to require validation of email and phone numbers both.

![User Pool Setup Step 4](../images/cognito-userpool-setup-step4.png)

1. Choose **Create role** to create an IAM role with the default name to allow Cognito to send SMS messages on your behalf.

1. Choose **Next step**.

1. Leave all message defaults as-is and choose **Next step**.

1. Skip adding any tags and click **Next step**.

1. Choose **No** to not remember your user's devices then click **Next step**.

![User Pool Setup Step 5](../images/cognito-userpool-setup-step5.png)

1. Choose **Add an app client**

1. Input `wild-rydes-web-app` as the app client name

1. Uncheck **Generate client secret**. Client secrets are used for server-side applications authentication and are not needed for JavaScript applications.

![User Pool Setup Step 6](../images/cognito-userpool-setup-step6.png)

1. Choose **Next step**.

1. Leavea all Lambda trigger settings set to **none**. These trigger settings allow you to extend the out-of-the-box sign-up and sign-in flows with your own custom logic, but we will not be using this feature in this workshop.

1. Choose **Next step**.

1. Review summary of all provided settings for accuracy then choose **Create pool**.

</p></details>
