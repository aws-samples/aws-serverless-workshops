## Streaming Aggregation

In this module, you'll create an Amazon Kinesis Data Analytics application to
aggregate sensor data from the unicorn fleet in real-time. The application will
read from the Amazon Kinesis stream, calculate the total distance traveled and
minimum and maximum health and magic points for each unicorn currently on a Wild
Ryde and output these aggregated statistics to an Amazon Kinesis stream every
minute.

### Overview

The architecture for this module involves an Amazon Kinesis Data Analytics
application, source and destination Amazon Kinesis streams, and the producer and
consumer command-line clients.

The Amazon Kinesis Data Analytics application processes data from the source
Amazon Kinesis stream that we created in the previous module and aggregates it
on a per-minute basis. Each minute, the application will emit data including the
total distance traveled in the last minute as well as the minimum and maximum
readings from health and magic points for each unicorn in our fleet. These data
points will be sent to a destination Amazon Kinesis stream for processing by
other components in our system.

### Implementation

#### 1. Create an Amazon Kinesis stream

Use the Amazon Kinesis Data Streams console to create a new stream named
**wildrydes-summary** with **1** shard.

**:white_check_mark: Step-by-step Instructions**

1. Go to the AWS Management Console, click **Services** then select **Kinesis**
   under Analytics.

1. Click **Get started** if prompted with an introductory screen.

1. Click **Create data stream**.

1. Enter `wildrydes-summary` into **Kinesis stream name** and `1` into **Number
   of shards**, then click **Create Kinesis stream**.

1. Within 60 seconds, your Kinesis stream will be **ACTIVE** and ready to store
   real-time streaming data.

#### 2. Create an Amazon Kinesis Data Analytics application

Build an Amazon Kinesis Data Analytics application which reads from the
**wildrydes** stream built in the previous module and emits a JSON object with
the following attributes each minute:

  | | |
  | --- | --- |
  | **Name** | Unicorn name |
  | **StatusTime** | ROWTIME provided by Amazon Kinesis Data Analytics |
  | **Distance** | The sum of distance traveled by the unicorn |
  | **MinMagicPoints** | The minimum data point of the _MagicPoints_ attribute |
  | **MaxMagicPoints** | The maximum data point of the _MagicPoints_ attribute |
  | **MinHealthPoints** | The minimum data point of the _HealthPoints_ attribute |
  | **MaxHealthPoints** | The maximum data point of the _HealthPoints_ attribute |

Set the destination stream of the application to **wildrydes-summary**.

**:white_check_mark: Step-by-step directions**

1. Switch to the tab where you have your Cloud9 environment opened.

1. Run the producer to start emitting sensor data to the stream.

    ```console
    ./producer
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

    Actively producing sensor data while we're building our application will
    allow Amazon Kinesis Data Analytics to auto-detect our schema.

1. Go to the AWS Management Console, click **Services** then select **Kinesis**
   under Analytics.

1. Click **Create analytics application**.

1. Enter `wildrydes` into **Application name** and then click **Create
   application**.

1. Click **Connect streaming data**.

1. Select `wildrydes` from **Kinesis stream**.

1. Scroll down and click **Discover schema**, wait a moment, and ensure the
   schema was properly auto-discovered.

    ![](./images/streaming-aggregation-schema-discovery.png)

    Ensure that the auto-discovered schema includes:

    | Column | Data Type |
    | --- | --- |
    | Distance | `DOUBLE` |
    | HealthPoints | `INTEGER` |
    | Latitude | `DOUBLE` |
    | Longitude | `DOUBLE` |
    | MagicPoints | `INTEGER` |
    | Name | `VARCHAR(16)` |
    | StatusTime | `TIMESTAMP` |


1. Click **Save and continue**.

1. Click **Go to SQL editor**. This will open up an interactive query session
   where we can build a query on top of our real-time Amazon Kinesis stream.

1. Click **Yes, start application**. It will take 30 - 90 seconds for your
   application to start.

1. Copy and paste the following SQL query into the SQL editor:

    ```sql
    CREATE OR REPLACE STREAM "DESTINATION_SQL_STREAM" (
      "Name"                VARCHAR(16),
      "StatusTime"          TIMESTAMP,
      "Distance"            SMALLINT,
      "MinMagicPoints"      SMALLINT,
      "MaxMagicPoints"      SMALLINT,
      "MinHealthPoints"     SMALLINT,
      "MaxHealthPoints"     SMALLINT
    );

    CREATE OR REPLACE PUMP "STREAM_PUMP" AS
      INSERT INTO "DESTINATION_SQL_STREAM"
        SELECT STREAM "Name", "ROWTIME", SUM("Distance"), MIN("MagicPoints"),
                      MAX("MagicPoints"), MIN("HealthPoints"), MAX("HealthPoints")
        FROM "SOURCE_SQL_STREAM_001"
        GROUP BY FLOOR("SOURCE_SQL_STREAM_001"."ROWTIME" TO MINUTE), "Name";
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Click **Save and run SQL**. Each minute, you will see rows arrive containing
   the aggregated data. Wait for the rows to arrive.

    ![](./images/streaming-aggregation-rows-preview.png)

1. Click the **Close** link.

1. Click **Connect to a destination**.

1. Select **wildrydes-summary** from **Kinesis stream**.

1. Select **DESTINATION_SQL_STREAM** from **In-application stream name**.

1. Click **Save and continue**.

#### 3. Read messages from the stream

Use the command line consumer to view messages from the Kinesis stream to see
the aggregated data being sent every minute.

**:white_check_mark: Step-by-step directions**

1. Switch to the tab where you have your Cloud9 environment opened.

1. Run the consumer to start reading sensor data from the stream.

    ```console
    ./consumer -stream wildrydes-summary
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

    The consumer will print the messages being sent by the Kinesis Data
    Analytics application every minute:

    ```json
    {
      "Name": "Shadowfax",
      "StatusTime": "2018-03-18 03:20:00.000",
      "Distance": 362,
      "MinMagicPoints": 170,
      "MaxMagicPoints": 172,
      "MinHealthPoints": 146,
      "MaxHealthPoints": 149
    }
    ```

#### 4. Experiment with the producer

Stop and start the producer while watching the dashboard and the consumer.
Start multiple producers with different unicorn names.

**:white_check_mark: Step-by-step directions**

1. Switch to the tab where you have your Cloud9 environment opened.

1. Stop the producer by pressing Control + C and notice the messages stop.

1. Start the producer again and notice the messages resume.

1. Hit the (+) button and click **New Terminal** to open a new terminal tab.

1. Start another instance of the producer in the new tab. Provide a specific
   unicorn name and notice data points for both unicorns in consumer's output:

    ```console
    ./producer -name Bucephalus
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Verify you see multiple unicorns in the output:

    ```json
    {
        "Name": "Shadowfax",
        "StatusTime": "2018-03-18 03:20:00.000",
        "Distance": 362,
        "MinMagicPoints": 170,
        "MaxMagicPoints": 172,
        "MinHealthPoints": 146,
        "MaxHealthPoints": 149
    }
    {
        "Name": "Bucephalus",
        "StatusTime": "2018-03-18 03:20:00.000",
        "Distance": 1773,
        "MinMagicPoints": 140,
        "MaxMagicPoints": 148,
        "MinHealthPoints": 132,
        "MaxHealthPoints": 138
    }
    ```

### :star: Recap

:key: Amazon Kinesis Data Analytics enables you to query streaming data or
build entire streaming applications using SQL, so that you can gain actionable
insights and respond to your business and customer needs promptly.

:wrench: In this module, you've created a Kinesis Data Analytics application
that reads from the Kinesis stream of unicorn data and emits a summary row each
minute.

### Next

:white_check_mark: Proceed to the next module, [Stream
Processing][stream-processing], wherein you'll store the summary data from
the Kinesis Data Analytics application in an Amazon DynamoDB table.

[dashboard]: https://reinvent2017.wildrydes.com/dashboard.html
[setup]: setup.html
[find-account-id]: https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html
[stream-processing]: stream-processing.html
