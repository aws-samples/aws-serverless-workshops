const util = require('util');
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = (event, context, callback) =>
{
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));

    const srcBucket = event.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    var params = {
        Image: {
            S3Object: {
                Bucket: srcBucket,
                Name: srcKey
            }
        },
        Attributes: ['ALL']
    };

    rekognition.detectFaces(params).promise().then((data)=> {
        console.log("Detection result from rekognition:\n", util.inspect(data, {depth: 5}));
        if (data.FaceDetails.length != 1) {
            callback(new PhotoDoesNotMeetRequirementError("Detected " + data.FaceDetails.length + " faces in the photo."));
        }
        if (data.FaceDetails[0].Sunglasses.Value === true){
            callback(new PhotoDoesNotMeetRequirementError("Face is wearing sunglasses"));
        }
        var detectedFaceDetails = data.FaceDetails[0];

        // remove some fields not used in further processing to de-clutter the output.
        delete detectedFaceDetails['Landmarks'];

        callback(null, detectedFaceDetails);
    }).catch( err=> {
        console.log(err);
        if (err.code === "ImageTooLargeException"){
            callback(new PhotoDoesNotMeetRequirementError(err.message));
        }
        if (err.code === "InvalidImageFormatException"){
            callback(new PhotoDoesNotMeetRequirementError("Unsupported image file format. Only JPEG or PNG is supported"));
        }
        callback(err);
    });
};


function PhotoDoesNotMeetRequirementError(message) {
    this.name = "PhotoDoesNotMeetRequirementError";
    this.message = message;
}
PhotoDoesNotMeetRequirementError.prototype = new Error();
