const proxyquire = require('proxyquire').noCallThru();

var assert = require('assert');

describe("Reading Unicorns", function () {
    const PATH_TO_MODULE_UNDER_TEST = '../app/read';
    const TABLE_NAME = 'UnicornsTable';
    const UNICORN_NAME = 'FakeName';

    var aws = null;
    var lambda = null;

    before(()=> {
        process.env.TABLE_NAME = TABLE_NAME;

        // Create a mock DDB backend
        aws = proxyquire(PATH_TO_MODULE_UNDER_TEST, {
            'aws-sdk' :{
                "VERSION" : "2.155.0",
                "DynamoDB": {
                    "DocumentClient": function() {
                        return {
                            "get": (params, callback) => {
                                console.log(JSON.stringify(params))
                                assert.equal(params.TableName, TABLE_NAME);
                                var item = null;
                                if (params.Key.name == UNICORN_NAME)
                                {
                                    item = {
                                        "breed": "Test Breed",
                                        "description": "This is a test unicorn. There are infinitely many like it, but this one is ours.",
                                        "name": "Testy"
                                    };
                                }
                                callback(null, { "Item":  item });
                            }
                        }
                    }
                }
            }
        });

        // Load our Lambda
        lambda = require(PATH_TO_MODULE_UNDER_TEST);
    });

    it("reads existing unicorn data", function (done) {
        lambda.lambda_handler({
            "resource": "unicorns",
            "httpMethod": "GET",
            "pathParameters" : {
                "name": UNICORN_NAME
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

    it("errors on missing unicorn data", function (done) {
        lambda.lambda_handler({
            "resource": "unicorns",
            "httpMethod": "GET",
            "pathParameters" : {
                "name": "MissingUnicorn"
            }
        },
        {},
        (err, response) => {
            // Check whether we received any error information
            assert.ifError(err);
            // Verify that we got a 404 (NotFound)
            assert.equal(response.statusCode, 404);
            done();
        });
    });
});
