const AWS = require('aws-sdk');
const fastCsv = require('fast-csv');
const s3 = new AWS.S3();
exports.handler = async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    await parse(event);
}

function getUploadedFileStreamFromEvent(event) {
    var bucket = event.Records[0].s3.bucket.name;
    var key = decodeURIComponent(event.Records[0].s3.object.key);
    return s3.getObject({Bucket: bucket, Key: key}).createReadStream();
}

function getLocalFileStream(event) {
    return require('fs').createReadStream('/Users/forrcoll/Downloads/unicorn-sample-data.csv');
}

function parse(s3Event) {
    // const s3Stream = getUploadedFileStreamFromEvent(s3Event);
    const s3Stream = getLocalFileStream(s3Event);
    return new Promise((resolve, reject) => {
        fastCsv.fromStream(s3Stream, {headers : true})
        .on('data', (data) => {
            // do something here
            console.log('data: ', data);

            // put this row on queue for looking up nearest station
        })
        .on('end', () => console.log('done parsing!'));
    });
}

function lookupNearestWeatherStation(row) {
    
}

parse({});