```
aws cloudformation create-stack \
  --stack-name wild-rydes-machine-learning-raw \
  --template-body file://cloudformation/optional_raw_data.yml
```

```
aws cloudformation create-stack \
  --stack-name wild-rydes-machine-learning-infrastructure \
  --template-body file://cloudformation/infrastructure.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=RawBucketName,ParameterValue=<your_bucket_name>
```
