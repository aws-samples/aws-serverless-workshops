const AWS = require('aws-sdk');
const fastCsv = require('fast-csv');
AWS.config.update({region: 'us-east-1'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const NEAREST_STATION_QUEUE_URL = process.env.OUTPUT_QUEUE;
const s3 = new AWS.S3();
exports.handler = async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    try {
        return await parse(event);
    } catch(e) {
        console.error('FATAL error: ', e);
        return e;
    }
}

function getUploadedFileStreamFromEvent(event) {
    var bucket = event.Records[0].s3.bucket.name;
    var key = decodeURIComponent(event.Records[0].s3.object.key);
    return s3.getObject({Bucket: bucket, Key: key}).createReadStream();
}

// for local testing
// function getLocalFileStream(event) {
//     return require('fs').createReadStream('/Users/forrcoll/Downloads/unicorn-sample-data.csv');
// }

function parse(s3Event) {
    const s3Stream = getUploadedFileStreamFromEvent(s3Event);
    // const s3Stream = getLocalFileStream(s3Event);
    return new Promise((resolve, reject) => {
        fastCsv.fromStream(s3Stream, {headers : true})
        .on('data', (data) => {
            console.log('CSV row: ', data);
            // put this row on queue for looking up nearest station
            // not waiting for async response here.. if it blows up it blows up
            // TODO better error handling
            sendToNearestStationQueue(data);
        })
        .on('error', e => reject(e))
        .on('end', () => resolve());
    });
}

async function sendToNearestStationQueue(row) {
    var params = {
        DelaySeconds: 0,
        MessageBody: JSON.stringify(row),
        QueueUrl: NEAREST_STATION_QUEUE_URL
      };
    return sqs.sendMessage(params).promise();
}