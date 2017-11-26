const proxyquire = require('proxyquire').noCallThru();

const assert = require('assert');

describe("Listing Unicorns", function () {
    const PATH_TO_MODULE_UNDER_TEST = '../app/list';
    const TABLE_NAME = 'UnicornsTable';
    process.env.TABLE_NAME = TABLE_NAME;

    var aws = null;
    var lambda = null;

    before(() => {
        // Create a mock DDB backend
        aws = proxyquire(PATH_TO_MODULE_UNDER_TEST, {
            'aws-sdk' :{
                "VERSION" : "2.155.0",
                "DynamoDB": {
                    "DocumentClient": function() {
                        return {
                            "scan": (params, callback) => {
                                assert.equal(params.TableName, TABLE_NAME);
                                callback(null, { "Items": [
                                    {
                                        "breed": "Test Breed",
                                        "description": "This is a test unicorn. There are infinitely many like it, but this one is ours.",
                                        "name": "Testy"
                                    },
                                    {
                                        "breed": "Test Breed",
                                        "description": "This is the only test unicorn. Pay no attention to the other unicorns; this one is the real deal.",
                                        "name": "Asserty"
                                    },
                                    {
                                        "breed": "Not a Test Breed",
                                        "description": "This is most definitely not a test unicorn.",
                                        "name": "Fakey"
                                    }
                                ]});
                            }
                        }
                    }
                }
            }
        });

        lambda = require(PATH_TO_MODULE_UNDER_TEST);
    });

    it("lists unicorn data", function (done) {
        lambda.lambda_handler({
            "resource": "unicorns",
            "httpMethod": "GET"
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
