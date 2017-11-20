## About

This README provides instructions on setting up a dev EC2 instance
that you can use to clone the project, edit project files, build the UI
and deploy the application.

Alternatively, you can use one of the AMIs which contain the required
dependencies baked in to the AMI. See the "Use AMI" section of README
to use a pre-baked AMI.

## EC2 dev instance configuration.

Make sure to use the AWS Linux AMI already configured with the AWS CLI. Your
EC2 instance should have:
- A role assigned that allows access to S3 (see sample policy below).
- A security group that allows SSH from your IP address.

Once launched, log in to your dev EC2 instance with SSH.

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
- `npm -v` should output 'v8.9.1'
- `node -v` should output '5.5.1'

#### Clone the workshop project

`git clone https://github.com/awslabs/aws-serverless-workshops.git`

#### Angular CLI installation

Now that you have Node and NPM we can install the Angular CLI to build our
project.

Install Angular cli: `npm install -g @angular/cli`

This will take about a minute and when done you will see a message like
"added 968 packages in 31.494s"


#### Building the UI

You should now be able to build the UI. Please go to the "Configure and build
the application code" section of the [2_UI/README.md](2_UI/README.md#3-configure-and-build-the-application-code) file.


## Use an AMI for your dev environment.
Coming Soon




## Example Policy allowing EC2 dev instance to write to your S3 bucket

You can use this sample policy to attach to ec2 role.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": "<your s3 website bucket>"
        }
    ]
}
```

Security Group
ssh from your ip address

Misc
https://github.com/swimlane/ngx-datatable/issues/1105

## Completion

Now you are ready to get back to the Workshop. Go back to the
[README](README.md#implementation-instructions)
