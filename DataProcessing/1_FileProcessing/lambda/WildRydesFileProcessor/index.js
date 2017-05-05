'use strict';

const AWS = require('aws-sdk');

const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const THROTTLING_ERRORS = [
    'ProvisionedThroughputExceededException',
    'ThrottlingException',
];

exports.handler = (event, context, callback) => {
    const promises = event.Records.map((record) => {
        const params = {
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key,
        };

        return S3.getObject(params).promise()
            .then(data => buildRequests(data.Body))
            .then(items => processRequests(items));
    });

    Promise.all(promises)
        .then(() => callback(null, `Processed ${event.Records.length} file(s)`))
        .catch(err => callback(err));
};

function buildRequests(buf) {
    const requestItems = buf.toString().trim().split('\n').map((json) => {
        const item = JSON.parse(json);
        item.StatusTime = (new Date(item.StatusTime)).getTime();

        return {
            PutRequest: {
                Item: item,
            },
        };
    });

    return Promise.resolve(requestItems);
}

function processRequests(requestItems) {
    const batches = [];

    while (requestItems.length > 0) {
        batches.push(writeRecords(requestItems.splice(0, 25)));
    }

    return Promise.all(batches);
}

function writeRecords(requestItems) {
    const params = {
        RequestItems: {
            [TABLE_NAME]: requestItems,
        },
    };

    return new Promise((resolve, reject) => {
        function retry(retryRequestItems) {
            const delay = ((Math.random() * (3 - 1)) + 1) * 1000;

            console.log(`Retrying ${retryRequestItems.length} reqs in ${Math.round(delay)}ms`);
            setTimeout(() => {
                writeRecords(retryRequestItems).then(resolve).catch(reject);
            }, delay);
        }

        DynamoDB.batchWrite(params, (err, data) => {
            if (data && data.UnprocessedItems[TABLE_NAME]) {
                retry(data.UnprocessedItems[TABLE_NAME]);
            } else if (err && THROTTLING_ERRORS.includes(err.name)) {
                retry(requestItems);
            } else if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
