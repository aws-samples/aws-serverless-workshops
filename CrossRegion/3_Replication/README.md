# Replicate to a second region

Now that we have the app set up, lets replicate this in a second region.

## 1. Replicate the primary stack

For the first part of this, all of the steps will be the same but performed in our secondary region (AP Singapore) instead. Please follow modules 1 and 2 again. You can use the CloudFormation templates to make this quicker.

Once you are done, verify that you get a second URL for your application and that there are no tickets in there yet. If you see the tickets you created in the first region then something has gone wrong and you are not using a completely separate stack which means there is a dependency on the primary region. You'll want to resolve this before moving on.

## 2. Replicating the data

So now that you have a separate stack, let's take a look at continuously replicating the data in DynamoDB from the primary region (Ireland) to the secondary region (Singapore) so that there is always a backup.

We will be using a feature of DynamoDB called Streams for this. DynamoDB Streams provides a time ordered sequence of item level changes in any DynamoDB table. This allows us to monitor these changes and push then to our second DynamoDB table. We will be using AWS Lambda to do this since we can easily connect this to our stream and we don't have to setup any additional infrastructure.


## 3. Configure Route53 failover

We need a way to be able to failover quickly with minimal impact to the customer. Route53 provides an easy way to do this using DNS.

- Configure custom domains on each API
- Configure Zone in R53
- Configure healthchecks on each and verify
- Configure both APIs using primary/secondary filaover Alias records

## Completion

Congratulations...
