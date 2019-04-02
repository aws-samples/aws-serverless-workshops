#!/bin/bash

cd ../lambda-functions/thumbnail
npm install
echo "success installing npm dependencies!"
cd ../copy-s3-object
pip2.7 install -r requirements.txt -t .
echo "success installing python dependencies!"
cd ../../cloudformation

listOfRegions="us-east-1
us-east-2
us-west-2
eu-west-1
ap-south-1
ap-northeast-2
ap-southeast-2
ap-northeast-1"

# change here to profile name being used 
profile=sfnworkshop

for region in $listOfRegions
do
  bucket="wildrydes-${region}"
  echo $bucket
  aws cloudformation package --s3-bucket ${bucket} --region ${region} --template ./module-setup.yaml --output-template-file setup-sam-transformed-${region}.yaml --profile ${profile} --s3-prefix ImageProcessing
  aws s3 cp setup-sam-transformed-${region}.yaml s3://${bucket}/ImageProcessing/setup-sam.yaml --profile ${profile}
  echo "deployed to $bucket"
done
