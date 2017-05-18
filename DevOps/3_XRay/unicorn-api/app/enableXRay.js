'use strict';

const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const response = require('cfn-response');

exports.lambda_handler = function(event, context, callback) {
  console.log('Received event: ', JSON.stringify(event, null, 2));

  if (event.RequestType == 'Delete') {
    response.send(event, context, response.SUCCESS, {}, null);
  }

  var params = {
    FunctionName: event.ResourceProperties.FunctionName,
    TracingConfig: {
      Mode: 'Active'
    }
  };

  lambda.updateFunctionConfiguration(params, function(err, data) {
    var status = err ? response.FAILED : response.SUCCESS;
    if (status == response.FAILED) {
      console.log('err: ', JSON.stringify(err, null, 2));
    }
    response.send(event, context, status, {}, null);
  });
};
