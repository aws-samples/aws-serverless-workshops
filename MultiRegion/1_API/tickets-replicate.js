var startTime = Date.now();
console.log("Start Time: " + startTime);
var http = require('http');
var https = require('https');
http.globalAgent.maxSockets = 500;
https.globalAgent.maxSockets = 500;

//We are reading in the environment variables from Lambda
var table = process.env.TABLE_NAME;
var targetregion = process.env.TARGET_REGION;


//We are configuring the AWS Client
var AWS = require('aws-sdk');

//Lets set the destination AWS Region
AWS.config.update({region : targetregion});

//Lets set up the DynamoDB Client
var dynamodb = new AWS.DynamoDB();

exports.handler = function(event, context) {
    var handlerBegin = Date.now();
    console.log("Handler Start Time: " + handlerBegin);
    //Track the requests that are in flight
    var Requestsinflight = 0;

    //If there is an update to the same key then deduplicate it
    var buffer = {};
    event.Records.forEach(function(record){
        buffer[JSON.stringify(record.dynamodb.Keys)] = record.dynamodb;
    });

    // callback function to execute once the request completes
    var handleResponse = function(err, data) {
        if (err) {
            //log errors
            console.error(err, err.stack);
        } else {
            //check if requests are all completed and if so end the function
            Requestsinflight;
            if (Requestsinflight === 0) {
                context.succeed("We have successfully replicated" + event.Records.length + " records. ");
                console.log("Total Time: ", Date.now()-handlerBegin, "ms");
            }
        }
    }

    for (var key in buffer) {
        if (!buffer.hasOwnProperty(key)) continue;

        // obtain new image of dynamodb stream record
        var oldItemImage = buffer[key].OldImage;
        var newItemImage = buffer[key].NewImage;

        // decide what type of request to send
        if (validate(oldItemImage) && !validate(newItemImage)) {
            dynamodb.deleteItem({Key : buffer[key].Keys, TableName : table}, handleResponse);
        } else if (validate(newItemImage)) {
            dynamodb.putItem({Item : newItemImage, TableName : table}, handleResponse);
        } else {
            console.error("The old image and the new image are not valid.");
        }

        // Increase count for number of requests in flight
        Requestsinflight++;
    }

    console.log("Sent all request took: ", Date.now()-handlerBegin, "ms");

    // if there are no more requests pending, end the function
    if (Requestsinflight === 0) {
        context.succeed("Number of records succesfully processed:" + event.Records.length);
    }
};

// return only if record image is correctly validated
var validate = function(image) {
  if (typeof image !== 'undefined' && image) {
      return true;
  }
  return false;
};
