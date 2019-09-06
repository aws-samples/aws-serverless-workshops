## Data Lake

In this module, you'll create an [Amazon Kinesis Data Firehose][firehose] to
deliver data from the Amazon Kinesis stream created in the first module to
[Amazon Simple Storage Service (Amazon S3)][s3] in batches. You'll then use
[Amazon Athena][athena] to run queries against our raw data in place.

### Overview

The architecture for this module builds on the Amazon Kinesis stream you
created in the first module. You'll use Amazon Kinesis Data Firehose to batch
the data and deliver it to Amazon S3 to archive it. Using Amazon Athena, you'll
run ad-hoc queries against the raw data in the Amazon S3 bucket.

### Implementation

#### 1. Create an Amazon S3 bucket

Use the console or CLI to create an S3 bucket. Keep in mind, your bucket's name
must be globally unique. We recommend using a name such as
`wildrydes-data-yourname`.

**:white_check_mark: Step-by-step Instructions**

1. From the AWS Console click **Services** then select **S3** under Storage.

1. Click **+ Create bucket**

1. Provide a globally unique name for your bucket such as
   `wildrydes-data-yourname`.

1. Select the region you've been using for your bucket.

    ![](images/data-lake-create-bucket.png)</kbd>

1. Click **Next** three times, and then click **Create bucket**.

#### 2. Create an Amazon Kinesis Data Firehose delivery stream

Create an Amazon Kinesis Data Firehose delivery stream named **wildrydes** that is
configured to source data from the **wildrydes** stream and deliver its contents
in batches to the S3 bucket created in the previous section.

**:white_check_mark: Step-by-step Instructions**

1. From the AWS Console click **Services** then select **Kinesis** under
   Analytics.

1. Click **Create delivery stream**.

1. Enter `wildrydes` into **Delivery stream name**.

1. Select **Kinesis stream** as **Source** and select **wildrydes** as the
   source stream.

1. Click **Next**.

1. Leave **Record transformation** and **Record format conversation** disabled
   and click **Next**.

1. Select **Amazon S3** from **Destination**.

1. Choose the bucket you created in the previous section (i.e.
   **wildrydes-data-johndoe**) from **S3 bucket**.

1. Click **Next**.

1. Enter `60` into **Buffer interval** under **S3 Buffer** to set the frequency
   of S3 deliveries to once per minute.

1. Scroll down to the bottom of the page and click **Create new or Choose**
   from **IAM role**. In the new tab, click **Allow**.

1. Click **Next**. Review the delivery stream details and click **Create
   delivery stream**.

    ![](images/data-lake-delivery-stream-details.png)</kbd>

#### 3. Create an Amazon Athena table

Create an Amazon Athena table to query the raw data in place on Amazon S3 using
a JSON SerDe. Name the table **wildrydes** and include the attributes in the raw
data:

- _Name_ (string)
- _StatusTime_ (timestamp)
- _Latitude_ (float)
- _Longitude_ (float)
- _Distance_ (float)
- _MagicPoints_ (int)
- _HealthPoints_ (int)

**:white_check_mark: Step-by-step Instructions**

1. Click on **Services** then select **Athena** in the Analytics section.

1. If prompted, click **Get Started** and exit the first-run tutorial by hitting
   the **x** in the upper right hand corner of the modal dialog.

1. Copy and paste the following SQL statement to create the table. Replace the
   **YOUR_BUCKET_NAME_HERE** placeholder with your bucket name (e.g.
   wildrydes-data-johndoe) in the LOCATION clause:

    ```sql
    CREATE EXTERNAL TABLE IF NOT EXISTS wildrydes (
           Name string,
           StatusTime timestamp,
           Latitude float,
           Longitude float,
           Distance float,
           HealthPoints int,
           MagicPoints int
         )
         ROW FORMAT SERDE 'org.apache.hive.hcatalog.data.JsonSerDe'
         LOCATION 's3://YOUR_BUCKET_NAME_HERE/';
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Click **Run Query**.

1. Verify the table **wildrydes** was created by ensuring it has been added to
   the list of tables in the left navigation.

#### 4. Explore the batched data files

Using the AWS Management Console, navigate to the S3 bucket that you used as
your Kinesis Data Firehose delivery target. Verify that Firehose is delivering
batched data files to the bucket. Download one of the files and open it in a
text editor to see the contents.

**:white_check_mark: Step-by-step Instructions**

1. Click on **Services** then select **S3** in the Storage section.

1. Enter the bucket name you create in the first section in the **Search for
   buckets** text input.

1. Click on the bucket name and navigate through the year, month, day, and hour
   folders to ensure that files are being populated in your bucket.

    ![](images/data-lake-object-list.png)

1. Click on one of the files.

1. Click the **Select from** tab, select ``JSON`` from **File format**, and click
   the **Show file preview** to preview the file content.

    ![](images/data-lake-object-preview.png)


#### 5. Query the data files

Query the Amazon Athena table to see all records that have been delivered via
Kinesis Data Firehose to S3.

**:white_check_mark: Step-by-step Instructions**

1. Click on **Services** then select **Athena** in the Analytics section.

1. Copy and paste the following SQL query:

    ```sql
    SELECT * FROM wildrydes
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Click **Run Query**.

    ![](images/data-lake-query-results.png)

[firehose]: https://aws.amazon.com/kinesis/firehose/
[s3]: https://aws.amazon.com/s3
[athena]: https://aws.amazon.com/athena
[client-installation]: ../README.md#kinesis-command-line-clients
[shard-iterator-type-documentation]: http://docs.aws.amazon.com/kinesis/latest/APIReference/API_GetShardIterator.html#Streams-GetShardIterator-request-ShardIteratorType

## :star: Recap

:key: Amazon Kinesis Data Firehose is a fully managed service for delivering
real-time streaming data to destinations such as Amazon S3. Amazon Athena allows
us to run ad-hoc queries against the raw data using standard SQL.

:wrench: In this module, you've created a Kinesis Data Firehose delivery stream
to deliver data from the Kinesis stream to an Amazon S3 bucket. Using Athena,
you ran queries against this data on S3.

## Next

:tada: You're finished! You've completed the workshop. **Thanks so much
for participating!** Please remember to give us feedback either in person, via
GitHub, or through the survey mailed after an event so we can improve the
materials.

:white_check_mark: Have some time? Take a whack at some [extra
credit][extra-credit] tasks.

:white_check_mark: Be sure to [clean up][cleanup] the resources from this
workshop to ensure you do not incur any additional costs.

[extra-credit]: extra-credit.html
[cleanup]: cleanup.html
