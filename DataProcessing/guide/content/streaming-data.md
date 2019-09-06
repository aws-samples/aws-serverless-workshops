## Real-time Streaming Data

In this module, you'll create a Amazon Kinesis stream to collect and store
sensor data from our unicorn fleet. Using the provided command-line clients,
you'll produce sensor data from a unicorn on a Wild Ryde and read from the
stream.  Lastly, you'll use the unicorn dashboard to plot our unicorns on a map
and watch their status in real-time. In subsequent modules you'll add
functionality to analyze and persist this data using Amazon Kinesis Data
Analytics, AWS Lambda, and Amazon DynamoDB.

### Overview

The architecture for this module involves an Amazon Kinesis stream, a producer,
and a consumer.

Our producer is a sensor attached to a unicorn currently taking a passenger on a
ride. This sensor emits data every second including the unicorn's current
location, distance traveled in the previous second, and magic points and hit
points so that our operations team can monitor the health of the unicorn fleet
from Wild Rydes headquarters.

The Amazon Kinesis stream stores data sent by the producer and provides an
interface to allow consumers to process and analyze those data. Our consumer is
a simple command-line utility that tails the stream and outputs the data points
from the stream in effectively real-time so we can see what data is being stored
in the stream. Once we send and receive data from the stream, we can use the
[unicorn dashboard][dashboard] to view the current position and vitals of our
unicorn fleet in real-time.

### Implementation

:heavy_exclamation_mark: Ensure you've completed the [setup guide][setup] before beginning
the workshop.

#### 1. Create an Amazon Kinesis stream

Use the Amazon Kinesis Data Streams console to create a new stream named
**wildrydes** with **1** shard.

**:white_check_mark: Step-by-step Instructions**

1. Go to the AWS Management Console, click **Services** then select **Kinesis**
   under Analytics.

1. Click **Get started** if prompted with an introductory screen.

1. Click **Create data stream**.

1. Enter `wildrydes` into **Kinesis stream name** and `1` into **Number of
   shards**, then click **Create Kinesis stream**.

1. Within 60 seconds, your Kinesis stream will be **ACTIVE** and ready to store
   real-time streaming data.

    ![](./images/streaming-data-create-stream.png)

#### 2. Produce messages into the stream

Use the [command-line producer](setup.html#producer) to produce messages into
the stream.

**:white_check_mark: Step-by-step Instructions**

1. Switch to the tab where you have your Cloud9 environment opened.

1. In the terminal, run the producer to start emitting sensor data to the stream.

    ```console
    ./producer
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

    The producer emits a message a second to the stream and prints a period to
    the screen.

    ```console
    $ ./producer -region us-east-1
    ..................................................
    ```

1. In the Amazon Kinesis Streams console, click on **wildrydes** and click on
   the **Monitoring** tab.

1. After several minutes, you will see the **Put Record Success (percent) - Average** graph
   begin to record a single put a second.

#### 3. Read messages from the stream

**:white_check_mark: Step-by-step Instructions**

1. Switch to the tab where you have your Cloud9 environment opened.

1. Hit the (+) button and click **New Terminal** to open a new terminal tab.

1. Run the consumer to start reading sensor data from the stream.

    ```console
    ./consumer
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

    The consumer will print the messages being sent by the producer:

    ```json
    {
      "Name": "Shadowfax",
      "StatusTime": "2017-06-05 09:17:08.189",
      "Latitude": 42.264444250051326,
      "Longitude": -71.97582884770408,
      "Distance": 175,
      "MagicPoints": 110,
      "HealthPoints": 150
    }
    {
      "Name": "Shadowfax",
      "StatusTime": "2017-06-05 09:17:09.191",
      "Latitude": 42.265486935100476,
      "Longitude": -71.97442977859625,
      "Distance": 163,
      "MagicPoints": 110,
      "HealthPoints": 151
    }
    ```

#### 4. Create an identity pool for the unicorn dashboard

Create an Amazon Cognito identity pool to grant unauthenticated users access to
read from your Kinesis stream. Note the identity pool ID for use in the next
step.

**:white_check_mark: Step-by-step directions**

1. Go to the AWS Management Console, click **Services** then select **Cognito**
   under Security, Identity & Compliance.

1. Click **Manage Identity Pools**.

1. Click **Create new identity pool**.

1. Enter `wildrydes` into **Identity pool name**.

1. Tick the **Enable access to unauthenticated identities** checkbox.

1. Click **Create Pool**.

1. Click **Allow** which will create authenticated and unauthenticated roles for
   your identity pool.


1. Click **Go to Dashboard**.

1. Click **Edit identity pool** in the upper right hand corner.

1. Note the **Identity pool ID** for use in a later step.

    ![](images/streaming-data-identity-pool-id.png)

#### 5. Grant the unauthenticated role access to the stream

Add a new policy to the unauthenticated role to allow the dashboard to read from
the stream to plot the unicorns on the map.

**:white_check_mark: Step-by-step directions**

1. Go to the AWS Management Console, click **Services** then select **IAM**
   under Security, Identity & Compliance.

1. Click on **Roles** in the left-hand navigation.

1. Click on the **Cognito_wildrydesUnauth_Role**.

1. Click **Add inline policy**.

1. Click on **Choose a service** and click **Kinesis**.

1. Click on **Actions**.

1. Tick the **Read** and **List** permissions checkboxes.

1. Click **Resources** to limit the role to the **wildrydes** stream and consumer.

1. Click **Add ARN** next to **consumer**.

1. In the **Add ARN(s)** dialog box, enter the following information:

    *  the region you're using in **Region** (e.g. us-east-1)
    *  your [Account ID][find-account-id] in **Account**
    * `*` in **Stream type**
    * `wildrydes` in **Stream name**
    * `*` in **Consumer name**
    * `*` in **Consumer creation timestamp**

    <br/>
    ![](images/streaming-data-consumer-arn.png)

1. Click **Add**.

1. Click **Add ARN** next to **stream**.

1. In the **Add ARN(s)** dialog box, enter the following information:

    *  the region you're using in **Region** (e.g. us-east-1)
    *  your [Account ID][find-account-id] in **Account**
    * `wildrydes` in **Stream name**

    <br/>
    ![](images/streaming-data-stream-arn.png)

1. Click **Add**.

    ![](images/streaming-data-stream-policy.png)

1. Click **Review policy**.

1. Enter `WildrydesDashboardPolicy` in **Name**.

1. Click **Create policy**.

#### 6. View unicorn status on the dashboard

Use the [Unicorn Dashboard][dashboard] to see the unicorn on a real-time map.

**:white_check_mark: Step-by-step directions**

1. Open the [Unicorn Dashboard][dashboard].

1. Enter the **Cognito Identity Pool ID** you noted in step 4 and click
   **Start**.

    ![](./images/streaming-data-dashboard-configure.png)

1. Validate that you can see the unicorn on the map.

    ![](./images/streaming-data-map.png)

1. Click on the unicorn to see more details from the stream.

    ![](./images/streaming-data-map-details.png)

#### 7. Experiment with the producer

Stop and start the producer while watching the dashboard and the consumer.
Start multiple producers with different unicorn names.

1. Stop the producer by pressing Control + C and notice the messages stop
   and the unicorn disappear after 30 seconds.

1. Start the producer again and notice the messages resume and the unicorn
   reappear.

1. Hit the (+) button and click **New Terminal** to open a new terminal tab.

1. Start another instance of the producer in the new tab. Provide a specific
   unicorn name and notice data points for both unicorns in consumer's output:

    ```console
    ./producer -name Bucephalus
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Check the dashboard and verify you see multiple unicorns.

    ![](./images/streaming-data-map-two-unicorns.png)

### :star: Recap

:key: Amazon Kinesis makes it easy to collect, process, and analyze real-time,
streaming data so you can get timely insights and react quickly to new
information.

:wrench: In this module, you've created an Amazon Kinesis stream and used it to
store and visualize data from a simulated fleet of unicorns.

### Next

:white_check_mark: Proceed to the next module, [Streaming
Aggregation][streaming-aggregation], wherein you'll build an application using
Amazon Kinesis Analytics to summarize data from the stream every minute.

[dashboard]: https://dataprocessing.wildrydes.com/dashboard.html
[setup]: setup.html
[find-account-id]: https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html
[streaming-aggregation]: streaming-aggregation.html
