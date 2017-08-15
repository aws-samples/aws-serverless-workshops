'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.lambda_handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const unicorn = build_unicorn(event);

  var params = {
    TableName: tableName,
    Key: {
      name: unicorn.name
    }
  };

  docClient.get(params, function(err, data) {
    if (err) callback(err)
    else callback(null, build_response(data));
  });
};

var build_unicorn = function(event) {
  return {
    name: event.pathParameters.name
  };
};

var build_response = function(data) {
  return {
    statusCode: data.Item ? 200 : 404,
    body: JSON.stringify(data.Item || {})
  };
};
