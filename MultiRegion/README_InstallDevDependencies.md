## About

This README provides brief instructions on setting up a dev environment
that you can use to clone the project, edit project files, build the UI
and deploy the application.  You can also deploy any of the CloudFormation
templates from any module using the EC2 instance as well.

We strongly recommend you use this AMI which will have the necessary
dependencies, i.e. AWS CLI, git, node/npm, angular cli already installed
and configured - you'll only need to clone the git repository.

Our dev environment instance will be in `eu-west-1` (Ireland)

## Create the IAM Role to assign to the EC2 instance

Brief instructions on how to create the policy and role:

1. Open IAM
2. Select **Role** from the left and then **Create Role**
3. Under *AWS Service* choose `EC2` and then select the use case of `EC2`
4. Click **Next: Permissions**
5. Choose **AdministratorAccess** from the list of Policies
6. Click **Next: Review**
7. Give the role a name such as `EC2-admin-role`

Assign this role to the EC2 instance when launching the AMI

## Using an AMI

Before you launch the AMI, if this is your first time launching a Linux EC2
instance, read through the following documentation on how to access the instance
using SSH keys:

[EC2 Linux SSH Documentation](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)

Make sure you are in `eu-west-1` region. Launch an EC2 instance by navigating
to the "Community AMI"s in step 1 of EC2 launch wizard. In the "Search
community AMIs" text box enter "sxr-dev-instance". For this instance a
t2.micro will suffice. Launch the instance in a public subnet with a
security group allowing ssh from anywhere.  Choose the role you created above and
assign it to the instance before launching.  Assign an existing SSH key you
already have access to, or create and download a new one.

Once the instance is up and running, you can connect to it using SSH.  Here is
a sample of how to use the SSH command on MacOS and Linux:

`ssh -i yourkey.pem ec2-user@x.x.x.x` (where x.x.x.x is the public IP of the EC2
instance)

If you are using Windows and Putty, you will need to convert the .pem file to a
.ppk file.  There are instructions available on how to do this by searching the
internet.

## Clone the workshop project

Once you get logged in to the instance,
run `git clone https://github.com/awslabs/aws-serverless-workshops.git`

This will pull down all of the files and directories you will need to complete
the workshop and keep them on the local file system.

## Building the UI

You should now be able to build the UI when you get to that step in the second
module, as well as deploy CloudFormation templates, and do any other workshop
activities that require command line activities.

One you have the instance up and running and you have connected to it, go ahead
and start the workshop.

## EC2 Dev Instance Configuration (manually installing - not needed if using the AMI)

If you would really like to set up your own instance from scratch you can execute
the following instructions.

For this dev instance
- a t2.micro will be fine.
- use the AWS Linux AMI already configured with the AWS CLI.
- deploy to the default VPC

Your EC2 instance should have:
- A role assigned that allows full access (see sample policy below).
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

## Completion

Now you are ready to get back to the Workshop. Go back to the
[README](README.md#implementation-instructions)
