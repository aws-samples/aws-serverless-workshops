'use strict';

const AWS = require("aws-sdk");
const table = process.env.TABLE_NAME;

exports.handler = (event, context, callback) => {

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: table
    };

    docClient.scan(params, function (err, data) {

        let response = {};
        let body = {};
        body.region = process.env.AWS_REGION;


        if (err) {

            console.log(JSON.stringify(err, null, 2));

            body.message = ("Could not read from DynamoDB table.");

            response = {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                },
                body: JSON.stringify(body)
            };

        } else {

            body.message = ("Successful response reading from DynamoDB table.");

            response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                },
                body: JSON.stringify(body)
            };
        }



        callback(null, response);
    });

};