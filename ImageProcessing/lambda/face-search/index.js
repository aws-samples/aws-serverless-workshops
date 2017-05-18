const util = require('util');
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = (event, context, callback) => {
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));

    const srcBucket = event.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    var params = {
        CollectionId: process.env.REKOGNITION_COLLECTION_ID,
        Image: {
            S3Object: {
                Bucket: srcBucket,
                Name: srcKey
            }
        },
        FaceMatchThreshold: 70.0,
        MaxFaces: 3
    };
    rekognition.searchFacesByImage(params).promise().then(data => {
        if (data.FaceMatches.length > 0) {
            callback(new FaceAlreadyExistsError());
        } else {
            callback(null, null);
        }
    }).catch(err => {
        callback(err);
    });
};

function FaceAlreadyExistsError() {
    this.name = "FaceAlreadyExistsError";
    this.message = "Face in the picture is already in the system. ";
}
FaceAlreadyExistsError.prototype = new Error();
