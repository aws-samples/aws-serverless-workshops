'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.lambda_handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  var params = {
    TableName: tableName
  };

  docClient.scan(params, function(error, data) {
    // Comment or Delete the following line of code to remove simulated error
    error = Error("something is wrong");

    if (error) callback(error)
    else callback(null, {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    });
  });
};
