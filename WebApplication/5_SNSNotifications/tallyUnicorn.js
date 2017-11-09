const AWS = require('aws-sdk');

function updateDispatchedUnicornCount(unicorn) {
    const db = new AWS.DynamoDB.DocumentClient();

    return db.update({
        TableName: 'Unicorns',
        Key: {
            Name: unicorn.Name,
        },
        UpdateExpression: 'ADD DispatchCount :boostCount',
        ExpressionAttributeValues: {
            ':boostCount': 1,
        },
    }).promise();
}

exports.handler = (event, context, callback) => {
    const msg = JSON.parse(event.Records[0].Sns.Message);

    updateDispatchedUnicornCount(msg.Unicorn).then(() => {
        callback(null, {
            statusCode: 200,
        });
    }).catch((err) => {
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        errorResponse(err.message, context.awsRequestId, callback);
    });
};

function errorResponse(errorMessage, awsRequestId, callback) {
    callback(null, {
        statusCode: 500,

        body: JSON.stringify({
            Error: errorMessage,
            Reference: awsRequestId,
        }),

        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    });
}
