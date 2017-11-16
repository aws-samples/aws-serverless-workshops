# About

This readme provides instructions on setting up a dev ec2 instance 
that you can use to clone the project, edit project files, build the ui
and deploy the application. 

Alternatively, you can use one of the AMIs which contain the required 
dependencies baked in to the AMI. See the "Use AMI" section of readme 
to use a pre-baked AMI.

#EC2 dev instance configuration.

Make sure to use the AWS linux AMI already configured with the AWS CLI. 
Your EC2 instance should have:
- a role assigned that allows access to S3 (see sample policy below).
- a security group that allows ssh from your ip address.

Once launched log in to your dev ec2 instance.

#### Update to latest packages
`sudo yum update -y`

#### Install git
`sudo yum install git -y`

#### Create a dev directory
- create a dev directory: `mkdir sxrdev`
- cd into this directory: `cd sxrdev`

##### Install Node & NPM

We will use nvm (node version manager) to install node and npm.

Execute the following commands to install node & npm:

- install nvm: `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash`
- activate nvm: - `. ~/.nvm/nvm.sh`
- install node and npm: `nvm install 8.9.1`

confirm installation by typing the following
- `npm -v` should output 'v8.9.1'
- `node -v`should output '5.5.1'

#### Clone the SXR project

` git clone https://git-codecommit.us-east-1.amazonaws.com/v1/repos/aws-serverless-workshops`

#### Angular CLI installation

Now that you have node & npm we can install the angular cli to build our project.

Install angular cli: `npm install -g @angular/cli`

This will take about a minute and when done you will see a message like 
"added 968 packages in 31.494s"


#### Building the UI

You should now be able to build the UI. Please go to the "Configure and build the application code"
section of the 2_UI/README.md file.


# Use an AMI for your dev environment.
Coming Soon




# Example Policy allowing EC2 dev instance to write to your S3 bucket

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