'use strict';

const AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.AWS_REGION
});

const codepipeline = new AWS.CodePipeline();
const hippie = require('hippie');

exports.lambda_handler = (event, context, callback) => {
  var api = event.api_url + '/unicorns/';
  var unicorn = build_unicorn();

  Promise.resolve()
    .then(result => {
      return list_unicorns(api, unicorn);
    })
    .then(result => {
      return update_unicorn(api, unicorn);
    })
    .then(result => {
      return view_unicorn_found(api, unicorn);
    })
    .then(result => {
      return view_unicorn_not_found(api, unicorn);
    })
    .then(result => {
      return remove_unicorn(api, unicorn);
    })
    .then(result => {
      console.log('SUCCESS');
      complete_job(event.job_id, result, callback);
    })
    .catch(reason => {
      console.log('ERROR: ' + reason.test_name + ' | ' + reason.message);
      fail_job(event.job_id, reason, context.invokeid, callback);
    });
};

var list_unicorns = function(api, unicorn) {
  return hippie().get(api).expectStatus(200).end()
    .catch(reason => {
      reason.test_name = 'list_unicorns';
      throw reason;
    });
};

var update_unicorn = function(api, unicorn) {
  return hippie().put(api + unicorn.name).send(unicorn).json().expectStatus(200).end()
    .catch(reason => {
      reason.test_name = 'update_unicorn';
      throw reason;
    });
};

var view_unicorn_found = function(api, unicorn) {
  return hippie().get(api + unicorn.name).expectStatus(200).end()
    .catch(reason => {
      reason.test_name = 'view_unicorn_found';
      throw reason;
    });
};

var view_unicorn_not_found = function(api, unicorn) {
  return hippie().get(api + unicorn.name + random_string()).expectStatus(404).end()
    .catch(reason => {
      reason.test_name = 'view_unicorn_not_found';
      throw reason;
    });
};

var remove_unicorn = function(api, unicorn) {
  return hippie().del(api + unicorn.name).expectStatus(200).end()
    .catch(reason => {
      reason.test_name = 'remove_unicorn';
      throw reason;
    });
};

var fail_job = function(job_id, reason, invokeid, callback) {
  var message = "Test: " + reason.test_name + " | Actual: " + reason.actual + " | Expected: " + reason.expected;
  var params = {
    jobId: job_id,
    failureDetails: {
      message: message,
      type: 'JobFailed',
      externalExecutionId: invokeid
    }
  };
  console.log("fail_job: ", JSON.stringify(params));
  codepipeline.putJobFailureResult(params, function(err, data) {
    callback(null, message);
  });
};

var complete_job = function(job_id, message, callback) {
  var params = {
    jobId: job_id
  };
  console.log("complete_job: ", JSON.stringify(params));
  codepipeline.putJobSuccessResult(params, function(err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, message);
    }
  });
};

var random_string = function() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

var build_unicorn = function() {
  return {
    name: random_string(),
    breed: random_string(),
    description: random_string()
  };
};
