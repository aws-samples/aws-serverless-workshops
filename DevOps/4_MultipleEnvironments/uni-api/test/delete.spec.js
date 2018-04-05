const proxyquire = require('proxyquire').noCallThru();

const assert = require('assert');

describe("Deleting Unicorns", function () {
    const PATH_TO_MODULE_UNDER_TEST = '../app/delete';
    const TABLE_NAME = 'UnicornsTable';
    const UNICORN_NAME = 'FakeName';

    var aws = null;
    var lambda = null;

    before(() => {
        process.env.TABLE_NAME = TABLE_NAME;

        // Create a mock DDB backend
        aws = proxyquire(PATH_TO_MODULE_UNDER_TEST, {
            'aws-sdk' :{
                "VERSION" : "2.155.0",
                "DynamoDB": {
                    "DocumentClient": function() {
                        return {
                            "delete": (params, callback) => {
                                assert.equal(params.TableName, TABLE_NAME);
                                assert.equal(params.Key.name, UNICORN_NAME);
                                callback();
                            }
                        }
                    }
                }
            }
        });

        // Load our Lambda
        lambda = require(PATH_TO_MODULE_UNDER_TEST);
    });

    it("deletes unicorn data", function (done) {
        lambda.lambda_handler({
            "resource": "unicorns",
            "httpMethod": "DELETE",
            "pathParameters" :
            {
                "name" : UNICORN_NAME
            }
        },
        {},
        (err, response) => {
            // Check whether we received any error information
            assert.ifError(err);
            // Verify that we got an OK
            assert.equal(response.statusCode, 200);
            done();
        });
    });
});
