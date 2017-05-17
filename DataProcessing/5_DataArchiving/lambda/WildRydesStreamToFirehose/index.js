'use strict';

const AWS = require('aws-sdk');

const firehose = new AWS.Firehose();

exports.handler = (event, context, callback) => {
    const records = event.Records.map(record => ({
        Data: `${Buffer.from(record.kinesis.data, 'base64').toString('ascii')}\n`,
    }));

    const params = {
        DeliveryStreamName: process.env.DELIVERY_STREAM_NAME,
        Records: records,
    };

    firehose.putRecordBatch(params).promise()
        .then(() => callback(null, `Delivered ${event.Records.length} records`))
        .catch(err => callback(err));
};
