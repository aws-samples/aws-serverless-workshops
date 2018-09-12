## Clean Up

### Resources

Below is a list of resources created in this workshop. Delete each one to clean
up your account after executing the modules.

#### Amazon Athena

**_wildrydes_ table**

1. Click on **Services** then select **Athena** in the Analytics section.

1. Click on the overflow (three vertical dots) icon next to the **wildrydes**
   table and click on **Delete table**.

1. Click **Yes** to confirm the deletion.

#### Amazon Kinesis Data Firehose

**_wildrydes_ delivery stream**

1. Click on **Services** then select **Kinesis** in the Analytics section.

1. Click **View all** in **Kinesis delivery streams**..

1. Click **wildrydes** to select the radio button.

1. Click **Actions** and **Delete**.

1. Type the name of the stream (**wildrydes**) and click **Delete** to confirm
   the deletion.

#### Amazon S3

**Data bucket (e.g. _wildrydes-data-yourname_)**

1. Click on **Services** then select **S3** in the Storage section.

1. Click your bucket's row (e.g. _wildydes-data-yourname_) to highlight it.

1. Click **Delete bucket**.

1. Type the name of the bucket (e.g. _wildrydes-data-yourname_) and click
   **Confirm** to confirm the deletion.

#### AWS Lambda

**_WildRydesStreamProcessor_ function**

1. Click on **Services** then select **Lambda** in the Compute section.

1. Click the radio button next to **WildRydesStreamProcessor**.

1. Click **Actions** and **Delete**. Click the **Delete** button to confirm the
   deletion.

#### Amazon DynamoDB

**_UnicornSensorData_ table**

1. Click on **Services** then select **DynamoDB** in the Database section.

1. Click **Tables** from the left-hand navigation.

1. Click the radio button next to **UnicornSensorData**.

1. Click **Delete table** and click **Delete** to confirm the deletion.

#### AWS IAM

**_WildRydesDynamoDBWritePolicy_ policy**

1. Click on **Services** then select **IAM** in the Security, Identity &
   Compliance section.

1. Click **Policies** from the left-hand navigation.

1. Select **Customer managed** from **Filter**.

1. Click the checkbox next to **WildRydesDynamoDBWritePolicy**.

1. Click **Policy actions** and **Delete**. Click the **Delete** button to
   confirm the deletion.

**_WildRydesStreamProcessor_ role**

1. Click **Roles** from the left-hand navigation.

1. Click the checkbox next to **WildRydesStreamProcessor**.

1. Click **Delete role** and click **Yes, delete** to confirm the deletion.

#### Amazon Kinesis Data Analytics

**_wildrydes_ application**

1. Click on **Services** then select **Kinesis** in the Analytics section.

1. Click **View all** in **Kinesis analytics applications**.

1. Click **wildrydes** to select the radio button.

1. Click **Actions** and **Delete application**. Click **Delete application** to
   confirm the deletion.

#### Amazon Kinesis Data Streams

**_wildrydes_ and _wildrydes-summary_ streams**

1. Click on **Services** then select **Kinesis** in the Analytics section.

1. Click **View all** in **Kinesis data streams**.

1. Click the checkboxes next to **wildrydes** and **wildrydes-summary**.

1. Click **Actions** and  **Delete**. Click **Delete** to confirm the deletions.
