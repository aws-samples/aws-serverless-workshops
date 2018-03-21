# Serverless New Developer Workshop

Welcome to the Wild Rydes team!  We’re excited you’ve joined our startup that sees past the fad of autonomous vehicle technology the emerging field of mythical winged creature creation and it’s disruptive effect on consumer transportation.

We have funding that has helped us to secure a small fleet of mythical winged creatures.  We have built out a small MVP technical platform on AWS using serverless architecture for launch.  (These unicorns cost a lot and serverless provides us a cheaper alternative to virtualization, eg. EC2.)  It’s now time for us to prove that our product and business model works.  We need to scale the Wild Rydes platform.

Today as a new developer on the team we’ll walk you through our development workflow! We’re also going to be launching a new feature!

## About The Wild Rydes Tech Stack
Wild Rydes is built using an AWS serverless nanoservices architecture.  The language of choice for our services is Python.

Our cloud environment consists of three AWS accounts.  This allows us to segregate environments and limit the blast radius caused by mistakes.

They are:

* __prime:__ Where user access to the environment is managed.
* __prod:__ The production version of our platform used by our users.
* __dev__: This is where the development version of our application resides along with individual developer instances of services.  The development environment should nearly resemble prod as the time between deploying to the development version and prod should be minimal.  Changes laying around undeployed to prod aren’t doing users any good.

## Getting Started

### Developer Laptop Setup
Before starting this workshop ensure you have the following tools setup.

* __NodeJS / NPM:__ Our chosen tool for managing serverless systems is [Serverless Framework](https://serverless.com/framework/) which is written in JavaScript.  Please install by using one of the methods below.

Mac / Homebrew: `brew update && brew install node`
Windows / Generic: Install the latest stable or LTS release located here: https://nodejs.org/en/download/

* __Python:__ Our platform is written in Python 3.6 and we will need a Python runtime installed.

Mac / Homebrew: `brew update && brew install node`
Windows / Generic: Install the latest version of Python 3.6 located here: https://www.python.org/downloads/


### AWS Account Setup
Now time to setup your AWS credentials.

__FIXME:__ %%NEED A WAY TO DISTRIBUTE CREDS ONLINE%%

Install the AWS CLI.
```
pip install awscli
```

Configure AWS credentials by creating the following files if they do not exist for you already, and add the following contents to them.

_~/.aws/config_
```
[profile training-prime]
region = us-east-1
output = json

[profile training-dev]
region = us-east-1
output = json

[profile training-prod]
region = us-east-1
output = json
```

_~/.aws/credentials_
```
[training-prime]
aws_access_key_id = %%AWS_ACCESS_KEY_ID%%
aws_secret_access_key = %%AWS_SECRET_ACCESS_KEY%%

[training-dev]
source_profile = training-prime
role_arn = arn:aws:iam::144121712529:role/OrganizationAccountAccessUserRole

[training-prod]
source_profile = serverlessops-prime
role_arn = arn:aws:iam::820506766567:role/OrganizationAccountAccessUserRole

```

If you want to make switching between profiles easy, take a look at adding one of the following to your shell environment.

* __aws-profile:__ https://github.com/jaymecd/aws-profile
* __awsp:__ https://github.com/antonbabenko/awsp

## Modules

__FIXME:__ %%Explain what comes next.%%
