'use strict';

const util = require('util');

exports.handler = (event, context, callback) => {

    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));

    var title = "";
    var message = "";

    if (event["errorInfo"]) {
        title = event["errorInfo"]["Error"];
        var errorCause = JSON.parse(event["errorInfo"]["Cause"]);
        message = errorCause["errorMessage"];
    }

    callback(null, {"messageToSend": {"title": title, "message": message}})

};
