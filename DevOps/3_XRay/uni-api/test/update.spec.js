const proxyquire = require('proxyquire').noCallThru();

const assert = require('assert');

describe("Updating Unicorns", function () {
    const PATH_TO_MODULE_UNDER_TEST = '../app/update';
    const TABLE_NAME = 'UnicornsTable';
    const UNICORN_NAME = 'FakeName';
    const UNICORN_BREED = 'Testy';
    const UNICORN_DESCRIPTION = 'A description';

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
                            "put": (params, callback) => {
                                assert.equal(params.TableName, TABLE_NAME);
                                assert.equal(params.Item.name, UNICORN_NAME);
                                assert.equal(params.Item.breed, UNICORN_BREED);
                                assert.equal(params.Item.description, UNICORN_DESCRIPTION);
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

    it("updates unicorn data", function (done) {
        lambda.lambda_handler({
            "resource": "unicorns",
            "httpMethod": "PUT",
            "pathParameters" : {
                "name" : UNICORN_NAME
            },
            "body": JSON.stringify({ "name": UNICORN_NAME, "breed": UNICORN_BREED, "description": UNICORN_DESCRIPTION })
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
