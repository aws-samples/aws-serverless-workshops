'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.lambda_handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  var params = {
    TableName: tableName
  };

  docClient.scan(params, function(err, data) {
    if (err) callback(err)
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    });
  });
};
