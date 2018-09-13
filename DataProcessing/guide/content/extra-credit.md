## Extra Credit

Finished early? Nice, lookit you! Here's a small list of other things to try if
you have spare time to continue tinkering with the unicorn monitoring system:

- Write a consumer for the **wildrydes** stream in the programming language of
  your choice using the [AWS SDKs][sdks]. Experiment with the output format.

- Build an Amazon Kinesis Data Analytics application which reads from the
  wildrydes stream and selects data points where any of the unicorns' vital
  signs is below 100 points.

- Create an AWS Lambda function to read from the stream and send proactive
  alerts to operations personnel when any of the unicorns' unicorn's vital signs
  is below 100 points.

- Write additional Amazon Athena queries. Find:
    - Select all latitude and longitude pairs reported by a unicorn on a trip.
    - All data points captured after a specific timestamp.
    - The total all-time distance traveled by each unicorn.
    - All data points where a unicorn's vitals were below 100 points.

[sdks]: https://aws.amazon.com/tools/
