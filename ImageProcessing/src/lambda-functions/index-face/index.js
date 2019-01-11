const util = require('util');
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = (event, context, callback) => {
    const srcBucket = event.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    var params = {
        CollectionId: process.env.REKOGNITION_COLLECTION_ID,
        DetectionAttributes: [],
        ExternalImageId: event.userId,
        Image: {
            S3Object: {
                Bucket: srcBucket,
                Name: srcKey
            }
        }
    };
    rekognition.indexFaces(params).promise().then(data => {
        callback(null, data['FaceRecords'][0]['Face']);
    }).catch(err => {
        callback(err);
    });
}