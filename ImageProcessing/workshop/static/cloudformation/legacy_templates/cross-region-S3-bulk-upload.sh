#!/bin/bash

listOfRegions="us-east-1
us-east-2
us-west-2
eu-west-1
ap-south-1
ap-northeast-2
ap-southeast-2"

#profile=sfnworkshop

for region in $listOfRegions
do
  bucket="wildrydes-${region}"

#  bucket="sfn-image-workshop-${region}"
  echo $bucket
#  aws cloudformation package --s3-bucket ${bucket}  --s3-prefix packaged-lambda --region ${region} --template ../step0-webapp.yaml --output-template-file step0-webapp-transformed-${region}.yaml
  #--profile ${profile}
#  aws s3 cp step0-webapp-transformed-${region}.yaml s3://${bucket}/cloudformation/step0-webapp.yaml
  aws s3 cp setup-sam-${region}.yaml s3://${bucket}/ImageProcessing/setup-sam.yaml
#  aws s3 cp s3://sfn-image-workshop-eu-west-1/webapp/webapp.zip s3://${bucket}/webapp/webapp.zip --profile sfnworkshop
  #aws cloudformation deploy --template-file step0-webapp-transformed-${region}.yaml  --stack-name sfn-workshop-setup-webapp --profile ${profile}  --region ${region}  --capabilities CAPABILITY_IAM --parameter-overrides SetupStack=sfn-workshop-setup
done