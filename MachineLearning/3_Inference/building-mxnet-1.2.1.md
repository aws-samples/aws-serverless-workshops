
# Build the Apache MXNet deployment package for AWS Lambda
In the previous sections of the workshop, and more specifically while executing the steps related to hosting in AWS Lambda, we have been using the contents of a GitHub repository to download the libraries required to run Apache MXNet in a Lambda function.

This section will show how to build the deployment package for an AWS Lambda function from scratch, by compiling the Apache MXNet framework libraries for the Lambda execution environment. This is required since there isn't yet a pre-compiled release package of Apache MXNet that would run smoothly in a Lambda function. Once the package is ready, it will be enough to add the Lambda handler to be ready to use MXNet in Lambda for hosting models and executing inferences.

The instructions in this section assume that you already have familiarity with Amazon EC2 service to execute operations like starting a new instance, configure the security groups, logging in through SSH and terminating it. In case you are not experienced with these tasks, you can refer to the wizards below:

https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/launching-instance.html
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html
## Launch an Amazon EC2 instance with the proper AMI
In order to compile MXNet for the Lambda function, you would need an environment running the AMI that the Lambda service is using. The current version is:

[amzn-ami-hvm-2017.03.1.20170812-x86_64-gp2](https://console.aws.amazon.com/ec2/v2/home#Images:visibility=public-images;search=amzn-ami-hvm-2018.03.0.20181129-x86_64-gp2)

We suggest double-checking that the current version is still the one above by visiting https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html.

You will have to launch an Amazon EC2 instance with that AMI and then access it by using an SSH client.

## Install the required libraries
First, install development tools and the libraries required to compile MXNet. Apache MXNet requires several libraries as prerequisites. In this tutorial we will be using

```
sudo yum groupinstall -y "Development Tools" && sudo yum install -y git
sudo yum install atlas-devel
sudo yum install openblas openblas-devel.x86_64 lapack-devel.x86_64
```
## Build Apache MXNet
We are now ready to build Apache MXNet from sources. We are going to get the sources from the GitHub repository where MXNet is maintained and then build with the proper settings.
```
wget -c https://github.com/apache/incubator-mxnet/releases/download/1.2.1/apache-mxnet-src-1.2.1-incubating.tar.gz -O - | tar -xz
cd apache-mxnet-src-1.2.1-incubating
make -j $(nproc) USE_OPENCV=0 USE_CUDNN=0 USE_CUDA=0 USE_BLAS=openblas USE_LAPACK=1
```
## Install language bindings
When the build process is completed, we will need to install the Python bindings as we want to use Python as programming language. All language bindings supported by MXNet are configured after building the framework, except C++ that needs to be included during the compilation.

To install language bindings, execute the following commands:
```
cd python/
sudo python setup.py install
```
## Build the package
Once the bindings are installed, we are ready to build a package that will contain all the relevant libraries to run MXNet in Lambda.

Please note that these instructions assume using the latest version of Apache MXNet and Numpoy, which, at the time being, are 1.3.1 and 1.15.2. This means that, if a new version is released, you might have to update the paths below.
```
cd
mkdir mxnetpackage
cp -r /usr/local/lib/python2.7/site-packages/mxnet-1.2.1-py2.7.egg/mxnet mxnetpackage/
cd mxnetpackage/
sudo pip install numpy
cp -r /usr/local/lib/python2.7/site-packages/numpy-1.15.0-py2.7-linux-x86_64.egg/numpy/ .
mkdir lib
cp /usr/lib64/atlas/libatlas.so.3 lib/
cp /usr/lib64/atlas/libcblas.so.3 lib/
cp /usr/lib64/atlas/libclapack.so.3 lib/
cp /usr/lib64/atlas/libf77blas.so.3 lib/
cp /usr/lib64/libgfortran.so.3 lib/
cp /usr/lib64/libgfortran.so.3.0.0 lib/
cp /usr/lib64/libgomp.so.1 lib/
cp /usr/lib64/libgomp.so.1.0.0 lib/
cp /usr/lib64/atlas/liblapack.so.3 lib/
cp /usr/lib64/libopenblas.so.0 lib/
cp /usr/lib64/atlas/libptcblas.so.3 lib/
cp /usr/lib64/atlas/libptf77blas.so.3 lib/
cp /usr/lib64/libquadmath.so.0 lib/
```
## Save the package
We are now going to compress and save the package to Amazon S3 as the final step.
```
tar cfz mxnet.tar.gz *
aws s3 cp mxnet.tar.gz s3://<your bucket>/
```

Now you can run a test by creating an AWS Lambda function starting from the package content and write a simple Python lambda handler that executes some basic MXNet code.

Finally, after ensuring the package works as expected, you can terminate the EC2 instance to avoid incurring in unexpected charges.