'use strict';

const AWS = require("aws-sdk");
const table = process.env.TABLE_NAME;

/**
 * This will handle posting of new ticket and puts for updates.
 * if incoming ticket has a non-zero id value its assumed to be an update
 * request to an existing ticket entity.
 *
 * @param event
 * @param context
 * @param callback
 */
exports.handler = (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));

    let body = JSON.parse(event.body);

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: table, //we get table name from env variable.
        Item: {
            "id": new Date().toISOString(),
            "description": body.description,
            "assigned": body.assigned,
            "priority": body.priority,
            "status": body.status,
            "createdBy": body.createdBy,
            "createdOn": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        }
    };

    console.log("Adding a new ticket..." + JSON.stringify(params));

    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add ticket. Error JSON:", JSON.stringify(err, null, 2));
            this.statusCode = '500';
            callback("Unable to add ticket");
        } else {
            console.log("Added ticket:", JSON.stringify(data, null, 2));
            this.statusCode = '200';

            const response = {
                statusCode: this.statusCode,
                headers: {
                    "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                },
                body: JSON.stringify(params.Item)
            };

            callback(null, response);
        }
    });



};
