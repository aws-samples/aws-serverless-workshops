+++
title = "Face Collection"
chapter = false
weight = 31
+++

### Create a collection in Amazon Rekognition

In this lab, we will use Amazon Rekognition to implement a simple face detection and analysis process. Specifically, this will be used to check for duplicate faces in the collection of user photos. A Face Collection is a container in Amazon Rekognition to store indexed face images as searchable vectors.

{{% notice info %}}
Recognition is available only in certain regions. You can view supported regions by referring to: [Rekognition regions](http://docs.aws.amazon.com/general/latest/gr/rande.html#rekognition_region)
{{% /notice %}}

In your Cloud9 terminal command line interface, create an Amazon Rekognition collection called `rider-photos` using the following command:

    aws rekognition create-collection --collection-id rider-photos --region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION

{{% notice warning %}}
Replace the "REPLACE_WITH_YOUR_CHOSEN_AWS_REGION" portion with the region string of your chosen region. If this is not replaced, you will encounter errors.
{{% /notice %}}

If successful, you should get an acknowledgment from the service that looks like:

{{< highlight json >}}
{
     "StatusCode": 200,
     "CollectionArn": "aws:rekognition:us-east-1:0123456789:collection/rider-photos",
     "FaceModelVersion": "5.0"
}	{{< /highlight>}}

:white_check_mark: Your face collection is now deployed. You may proceed deploying the CloudFormation template by clicking the arrow to the right.
