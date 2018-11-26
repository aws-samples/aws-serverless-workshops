# Cleaning Up after the Workshop

Here are high level instructions on cleaning up after you have completed the
workshop. Do this so you don't incur any ongoing charges once you have completed
this excercise.

### Module 1_API:

If you manually deploy a region in module 1_API

- Delete the three Lambda functions in each region
- Delete the SXRTickets DynamoDB table in each region
- Delete the API Gateway and Custom Domains in each region
- Delete the SSL Certificates in ACM (you may need to wait some time for resources
  to fully un-deploy before this is possible) - in each region
- Delete the IAM Roles and Policies you created

If you used CloudFormation to deploy a 1_API regions

- In the console, select the correct regions
- Go into CloudFormation and select the wild-rydes-api stack and then select *delete*
- The template will be deleted along with all resources it created

### Module 2_UI

- In the Console, go into S3, and *Empty* but don't delete the bucket hosting
  your website content
- Select the web-ui-stack stack and then *delete* it.
- The template will be deleted along with all resources it created

### Module 3_Replication

- In Route53, remove the Health Check as well as all DNS entries you created
  during the workshop
- In Amazon Certificate Manager, delete all SSL certificates you created (both regions)


### Terminate yout Cloud9 IDE

- Go to the Cloud9 Console and delete the IDE you created
