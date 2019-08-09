import mxnet as mx
import json
import boto3
import os

bucket = ''
key = '<your path>/model.tar.gz'
boto3.resource('s3').Bucket(bucket).download_file(key, 'model.tar.gz')

os.system('tar -zxvf model.tar.gz')
os.system('unzip model_algo-1')

mod = mx.module.Module.load("mx-mod", 0)
print(mod)
