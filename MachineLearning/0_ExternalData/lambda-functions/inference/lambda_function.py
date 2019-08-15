from __future__ import print_function

import mxnet as mx
import json
import boto3
import os
import numpy as np
import pandas as pd


def download_model():
    bucket = 'wrtest1-modelbucket-zvao8a2ziew5'
    key = 'linear-learner-2019-08-14-20-24-39-776/output/model.tar.gz'
    boto3.resource('s3').Bucket(bucket).download_file(key, '/tmp/model.tar.gz')
    
    os.system('cd /tmp && tar -zxvf model.tar.gz')
    os.system('cd /tmp && unzip model_algo-1')

def create_data_iter():
    data = np.random.rand(100,3)
    label = np.random.randint(0, 10, (100,))
    data_iter = mx.io.NDArrayIter(data=data, label=label, batch_size=30)
    return data_iter

download_model()

mod = mx.module.Module.load("/tmp/mx-mod", 0, label_names=["out_label"])

# model's weights
mod._arg_params['fc0_weight'].asnumpy().flatten()
 
# model bias
mod._arg_params['fc0_bias'].asnumpy().flatten()
 
# Using the model for prediction
# First create a mxnet data iterator:
# https://mxnet.incubator.apache.org/tutorials/basic/data.html#reading-data-in-memory
# https://mxnet.incubator.apache.org/tutorials/basic/data.html#reading-data-from-csv-files
data_iter = create_data_iter()
 
# Next bind the module with the data shapes.
mod.bind(data_shapes=data_iter.provide_data)
 
# Predict
mod.predict(data_iter)

def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))

    return 'done'  # Echo back the first key value
    #raise Exception('Something went wrong')
