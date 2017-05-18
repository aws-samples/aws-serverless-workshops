'use strict';

const jp = require('jsonpath');
const util = require('util');
const AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.AWS_REGION
});

const cloudformation = new AWS.CloudFormation();
const codepipeline = new AWS.CodePipeline();
const lambda = new AWS.Lambda();

const test_function = process.env.TEST_FUNCTION;

exports.lambda_handler = (event, context, callback) => {
  var job_id = event["CodePipeline.job"].id;
  var stack_name = event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters;

  get_api_url(stack_name).then(function(api_url) {
    return invoke_test(job_id, api_url);
  }).catch(function(err) {
    fail_job(job_id, err, context.invokeid, callback);
  });
};

var invoke_test = function(job_id, api_url) {
  var params = {
    FunctionName: test_function,
    InvocationType: 'Event',
    Payload: JSON.stringify({
      job_id: job_id,
      api_url: api_url
    })
  };
  return lambda.invoke(params).promise();
};

var get_api_url = function(stack_name) {
  return list_stack_resources(stack_name).then(function(stack_resources) {
    var rest_api_id = jp.query(stack_resources, '$.StackResourceSummaries[?(@.ResourceType=="AWS::ApiGateway::RestApi")].PhysicalResourceId');
    var stage_name = jp.query(stack_resources, '$.StackResourceSummaries[?(@.ResourceType=="AWS::ApiGateway::Stage")].PhysicalResourceId');
    return util.format('https://%s.execute-api.%s.amazonaws.com/%s', rest_api_id, process.env.AWS_REGION, stage_name);
  });
};

var list_stack_resources = function(stack_name) {
  var params = {
    StackName: stack_name
  };
  return cloudformation.listStackResources(params).promise();
};

var fail_job = function(job_id, message, invokeid, callback) {
  var params = {
    jobId: job_id,
    failureDetails: {
      message: JSON.stringify(message),
      type: 'JobFailed',
      externalExecutionId: invokeid
    }
  };
  codepipeline.putJobFailureResult(params, function(err, data) {
    callback(message);
  });
};
