from __future__ import print_function

import mxnet as mx
import json
import boto3
import os
import numpy as np

def download_model():
    bucket = os.environ['OUTPUT_BUCKET']
    # UPDATE THIS PATH TO YOUR S3 KEY
    key = os.environ['MODEL_PATH']
    boto3.resource('s3').Bucket(bucket).download_file(key, '/tmp/model.tar.gz')

    os.system('cd /tmp && tar -zxvf model.tar.gz')
    os.system('cd /tmp && unzip model_algo-1')

def create_data_iter(input):
    data = np.array([[input['distance'],input['healthpoints'],input['magicpoints'],input['TMIN'],input['TMAX'],input['PRCP']]])
    data_iter = mx.io.NDArrayIter(data=data, batch_size=1)
    return data_iter

def make_prediction(input):
    data_iter = create_data_iter(input)

    # Next bind the module with the data shapes.
    mod.bind(data_shapes=data_iter.provide_data)

    # Predict
    results = mod.predict(data_iter)
    return round(results.asnumpy().tolist()[0][0], 2)


download_model()

# mod = mx.module.Module.load("/tmp/mx-mod", 0, label_names=["out_label"])
mod = mx.module.Module.load("/tmp/mx-mod", 0, label_names=None)

# model's weights
mod._arg_params['fc0_weight'].asnumpy().flatten()

# model bias
mod._arg_params['fc0_bias'].asnumpy().flatten()

def handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    # make_prediction({ "distance": 100, "healthpoints": 10000, "magicpoints": 50, "TMAX": 1, "TMIN": 1, "PRCP": 240 })
    result = make_prediction(json.loads(event['body']))
    return { "statusCode": 200, "body": result }
