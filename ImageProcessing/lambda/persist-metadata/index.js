// dependencies
const AWS = require('aws-sdk');
const util = require('util');

const tableName = process.env.RIDER_PHOTOS_DDB_TABLE;

const docClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
});

exports.handler = (event, context, callback) => {
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));

    const dynamoItem = {
        Username: event.userId,
        s3key: event.s3Key,
        s3bucket: event.s3Bucket
    };

    var indexDetails = event['parallelResult'][0];
    var thumbnailDetails = event['parallelResult'][1];
    dynamoItem['faceId'] = indexDetails['FaceId'];
    dynamoItem['thumbnail'] = thumbnailDetails['thumbnail'];
    docClient.put({
        TableName: tableName,
        Item: dynamoItem
        // uncomment below if you want to disallow overwriting if the user is already in the table
        //   ,ConditionExpression: 'attribute_not_exists (Username)'
    }).promise().then(data => {
        callback(null, data);
    }).catch(err => {
        callback(err);
    })

}
