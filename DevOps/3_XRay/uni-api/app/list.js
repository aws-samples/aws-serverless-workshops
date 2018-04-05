'use strict';

const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

function list_unicorns(callback) {
  var params = {
    TableName: tableName
  };

  AWSXRay.captureAsyncFunc('List Unicorns', (subsegment) => {
    docClient.scan(params, function(err, data) {
      // Comment or Delete the following line of code to remove simulated error
      err = Error("something is wrong");

      if (err) {
        callback(err, null, subsegment);
      } else {
        callback(null, data, subsegment);
      }
    });
  });
}

function return_from_stable(callback) {
  // Comment or Delete the following line of code to remove simulated delay
  const isDelayed = true;

  AWSXRay.captureAsyncFunc('Return From Stable', (subsegment) => {
    if (typeof isDelayed !== 'undefined' && isDelayed) {
      setTimeout(function() {
        callback(subsegment);
      }, 5000);
    } else {
      callback(subsegment);
    }
  });
}

exports.lambda_handler = (event, context, callback) => {
  list_unicorns((err, data, list_subsegment) => {
    if (err) {
      list_subsegment.close(err.stack);

      callback(err, {
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      });
    } else {
      return_from_stable((stable_subsegment) => {
        stable_subsegment.close();
        list_subsegment.close();

        callback(null, {
          statusCode: 200,
          body: JSON.stringify(data.Items)
        });
      });
    }
  });
};
