# Replicate to a second region

Now that we have the app set up, lets replicate this in a second region.

## 1. Replicate the primary stack

For the first part of this, all of the steps will be the same but performed in our secondary region (AP Singapore) instead. Please follow modules 1 and 2 again. You can use the CloudFormation templates from those modules to make this quicker.

Previous modules:
1. [Build an API layer](1_API/README.md)
2. [Build a UI layer](2_UI/README.md)

Once you are done, verify that you get a second URL (the S3 bucket URL) for your application and that there are no tickets displayed in this second copy of your application yet. If you see the tickets you created in the first region then something has gone wrong and you are not using a completely separate stack which means there is a dependency on the primary region. You will need to resolve this before moving on.

## 2. Replicating the data

So now that you have a separate stack, let's take a look at continuously replicating the data in DynamoDB from the primary region (Ireland) to the secondary region (Singapore) so that there is always a backup.

We will be using a feature of DynamoDB called Streams for this. DynamoDB Streams provides a time ordered sequence of item level changes in any DynamoDB table. This allows us to monitor these changes and push then to our second DynamoDB table. We will be using AWS Lambda to do this since we can easily connect this to our stream and we don't have to setup any additional infrastructure.


## 3. Configure Route53 failover

We need a way to be able to failover quickly with minimal impact to the customer. Route53 provides an easy way to do this using DNS and healthchecks. Be aware that some steps in this module will take time to go into effect because of the nature of DNS. Be patient when making changes.

NOTE: You will need the latest AWS CLI for this. Ensure you have updated
recently. See http://docs.aws.amazon.com/cli/latest/userguide/installing.html


### 3.1 Purchase (or repurpose) your own domain

In this step, you will provision your own domain name to use for this application. If you already have a domain name registered with Route53 and would like to use this you can use skip to the next step.

If using an existing domain name, ensure there is no CloudFront distribution already setup for the domain. You will also need to ensure that your email contacts are configured and up-to-date on the since you will need to receive mail in the next step.

#### High-level instructions
Navigate over to the Route53 Console and under **Registered domains** select **Register domain** and follow the instructions. You will first have to find an available domain before specifying your contact details and confirming the purchase.

<details>
<summary><strong>Console step-by-step instructions (expand for details)</strong></summary>

1. Navigate to the **Route53** service page
2. Navigate to **Registered domains**
3. Select **Register domain**
4. Enter the domain name you would like to use. You will have to choose something not already registered. Click **Check** and confirm that your domain is available before clicking **Add to cart**. Now choose **Continue**.
5. Enter your contact information. Ensure that you enter an email address where you can receive mail. By default, Route53 will enable privacy protection and configure an anonymized email address that forwards any mail onto the email address you specify. Leave this option selected and select **Continue**
6. Confirm that all your details are correct. Check the box agreeing to the terms and conditions. You will see that Route53 is verifying the email address you specified. Make sure you receive this email and complete the verification before proceeding.
7. Click **Complete Purchase**

</details>

### 3.2 Configure a certificate in Certificate Manager in each region

We will need an SSL certificate in order to configure our domain name with API Gateway. AWS makes this simple with AWS Certificate Manager.

#### High-level instructions
Navigate over to the *Certificate Manager* service and request a new certificate for your domain. You will specify the domain name you just created (or repurposed). Make sure to request a wildcard certificate which includes both `yourdomain.com` and `*.yourdomain.com`. You will have to approve the request via email and see it as `Issued` in the console before proceeding.

<details>
<summary><strong>Console step-by-step instructions (expand for details)</strong></summary>

1. Navigate to the **Certificate Manager** service page
2. Select **Request a certificate**
3. In this next step you will configure the domain name you just registered (or repurposed). You will want to add two domains to make sure you can access your site using subdomains. Add both `yourdomain.com` and `*.yourdomain.com`. The `*` acts as a wildcard allowing any subdomain to be covered by this certificate.
4. Select **Review and request**. Confirm both domains are configured and select **Confirm and request**
5. A validation email will be sent to the email address configured for the
   domain. Ensure that you received this email and click the validation link before moving on. Now click **Continue**.
6. Once you have confirmed your certificate, it will appear as `Issued` in your list of certificates.

</details>


### 3.3 Configure custom domains on each API, in each region
    - NOTE: if running into rate limits, wait a minute before creating again
### 3.4 Configure Zone in R53
    - NOTE: You must use HTTPS when visiting your domain. You will get a 504
      error if not.
### 3.5 Configure healthchecks on each and verify
    - NOTE: use port 443. 80 Won't work.
    - Must use HTTPS, not HTTP
### 3.6 Configure both APIs using primary/secondary filaover Alias records

## Completion

Congratulations...

Module 4: [Test failover](4_Testing/README.md)
