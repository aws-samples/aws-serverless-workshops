## About

This README provides instructions on setting up a dev environment
that you can use to clone the project, edit project files, build the UI
and deploy the application.

We recommend you use the given AMI with the necessary dependencies, i.e. git,
node/npm, angular cli already installed and configured.

Our dev environment instance will be in `eu-west-1` (Ireland)

## Using an AMI

Make sure you are in eu-west-1 region. Launch an EC2 instance by navigating
to the "Community AMI"s in step 1 of EC2 launch wizard. In the "Search
community AMIs" text box enter "sxr-dev-instance". For this instance a
t2.micro will suffice. Launch the instance in a public subnet with a
security group allowing ssh from your ip address and a role allowing
Administrator access to the AWS account (sample policy below).


## EC2 Dev Instance Configuration.

If you would really like to set up your own instance from scratch you can execute the following instructions.

For this dev instance
- a t2.micro will be fine.
- use the AWS Linux AMI already configured with the AWS CLI.
- deploy to the default VPC

Your EC2 instance should have:
- A role assigned that allows access to S3 (see sample policy below).
- A security group that allows SSH from your IP address.

Once launched, SSH in to your dev EC2 instance.

#### Update to latest packages
`sudo yum update -y`

#### Install git
`sudo yum install git -y`

#### Create a dev directory
- create a dev directory: `mkdir sxrdev`
- cd into this directory: `cd sxrdev`

##### Install Node & NPM

We will use NVM (Node Version Manager) to install Node and NPM (Node Package
Manager).

Execute the following commands to install Node & NPM:

- Install NVM: `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash`
- Activate NVM: - `. ~/.nvm/nvm.sh`
- Install Node and NPM: `nvm install 8.9.1`

Confirm installation by typing the following:
- `npm -v` should output '5.5.1'
- `node -v` should output 'v8.9.1'

#### Clone the workshop project

`git clone https://github.com/awslabs/aws-serverless-workshops.git`

#### Angular CLI installation

Now that you have Node and NPM we can install the Angular CLI to build our
project.

Install Angular cli: `npm install -g @angular/cli`

This will take about a minute and when done you will see a message like
"added 968 packages in 31.494s"


#### Building the UI

You should now be able to build the UI when you get to that step in the second module.


## Example Policy allowing EC2 dev instance access to the account

You can use this sample policy to attach to ec2 role or you can simply create
a role and attach Administrator access to it.


**NOTE: this is a permissive policy allowing all access to s3. For your
own environment we recommend a more restrictive policy that enforces
least privilege.**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```

## Completion

Now you are ready to get back to the Workshop. Go back to the
[README](README.md#implementation-instructions)
