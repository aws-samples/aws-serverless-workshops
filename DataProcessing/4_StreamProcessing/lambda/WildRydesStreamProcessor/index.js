'use strict';

const AWS = require('aws-sdk');

const DynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = (event, context, callback) => {
    const batches = [];
    const requestItems = event.Records.map((record) => {
        const json = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
        const item = JSON.parse(json);
        item.StatusTime = (new Date(item.StatusTime)).getTime();

        return {
            PutRequest: {
                Item: item,
            },
        };
    });

    while (requestItems.length > 0) {
        const params = {
            RequestItems: {
                [TABLE_NAME]: requestItems.splice(0, 25),
            },
        };

        batches.push(DynamoDB.batchWrite(params).promise());
    }

    Promise.all(batches)
        .then(() => callback(null, `Delivered ${event.Records.length} records`))
        .catch(err => callback(err));
};
