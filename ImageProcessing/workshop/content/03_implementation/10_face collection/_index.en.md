+++
title = "Face Collection"
chapter = false
weight = 31
+++

### Create a collection in Amazon Rekognition

In this workshop, we will use Amazon Rekognition as the backing technology for our simple face detection and analysis processes. Specifically, Rekognition will be used to identify if a recognizable face is present in uploaded images, and to store an index of uploaded photos that will be used to check for duplicate faces when new photos are uploaded.

{{% notice info %}}
Rekognition is available only in certain regions. You can view supported regions by referring to: [Rekognition regions](http://docs.aws.amazon.com/general/latest/gr/rande.html#rekognition_region)
{{% /notice %}}

In your Cloud9 terminal command line interface, create an Amazon Rekognition collection called `rider-photos` using the following command:

    aws rekognition create-collection --collection-id rider-photos --region REPLACE_WITH_YOUR_CHOSEN_AWS_REGION

{{% notice warning %}}
Replace the "REPLACE_WITH_YOUR_CHOSEN_AWS_REGION" portion of the above command with the AWS region string of your chosen region.
{{% /notice %}}

If successful, you should get an acknowledgment from the service that looks like:

{{< highlight json >}}
{
     "StatusCode": 200,
     "CollectionArn": "aws:rekognition:us-east-1:0123456789:collection/rider-photos",
     "FaceModelVersion": "5.0"
}	{{< /highlight>}}

:white_check_mark: Your face collection is now deployed. Let's deploy the remainder of our boilerplate infrastructure quickly and easily.
