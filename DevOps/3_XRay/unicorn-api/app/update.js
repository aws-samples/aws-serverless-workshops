'use strict';

const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const docClient = new AWS.DynamoDB.DocumentClient();

exports.lambda_handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const tableName = process.env.TABLE_NAME;
  const unicorn = build_unicorn(event);

  var params = {
    TableName: tableName,
    Item: {
      name: unicorn.name,
      breed: unicorn.breed,
      description: unicorn.description
    }
  };

  docClient.put(params, function(err, data) {
    if (err) callback(err)
    else callback(null, {
      statusCode: 200,
      body: JSON.stringify(unicorn)
    });
  });
};

var build_unicorn = function(event) {
  const body = JSON.parse(event.body);

  return {
    name: event.pathParameters.name,
    breed: body.breed,
    description: body.description
  };
};
