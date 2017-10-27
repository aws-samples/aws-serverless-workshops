# SAM Local

AWS SAM is a fast and easy way of deploying your serverless applications, allowing you to write simple templates to describe your functions and their event sources (Amazon API Gateway, Amazon S3, Kinesis, and so on). Based on AWS SAM, SAM Local is an AWS CLI tool that provides an environment for you to develop, test, and analyze your serverless applications locally before uploading them to the Lambda runtime.  In this section, you will install SAM Local and use it to perform local testing.

## SAM Local Installation

You will first need to install pre-requisites, then install the actual SAM Local package.  SAM Local emulates AWS Lambda execution environment and requires Docker to run Linux Containers.  The package itself is installed via Node package manager (NPM). Installation procedure will vary depending on which OS you are trying to use.

<details>
<summary><strong>Amazon Linux (EC2) SAM Local Installation</strong></summary>

You can use EC2 instance with Amazon Linux to perform exercises in this section.  In this case, you will not be performing work locally on your laptop, instead you will connect remotely into an EC2 instance to perform editing and testing.  Here are the installation steps:

### Launch and Configure Amazon Linux EC2 Instance
1. Create a keypair, if you do not have one already
2. Launch an EC2 instance with:
  1. OS: Amazon Linux
  2. Public IP address
  3. Minimum size t2.micro
  4. Security Group allows SSH access from your laptop
3. Once launched, use SSH client such as Putty or Bitvise to connect to the instance (you can find instructions for connecting from Windows using Putty here: [Connecting to Your Linux Instance from Windows Using PuTTY](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html))
4. Execute the command line below to install prerequisites and SAM Local:

```bash

sudo yum install -y git docker & \

sudo service docker start & \

sudo chmod 666 /var/run/docker.sock & \

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash & \

. ~/.nvm/nvm.sh & \

nvm install 6.11.4 & \

npm install -g aws-sam-local

```

Test by running sam local and you should see output with help text for sam local command:

```bash

sam local

```

output should looks similar to this: 
![SAM Local Help](images/sam-local-help.png)


#### Setup Port Forwarding Configuration

SAM Local can start an HTTP server locally on EC2 instance on port 3000.  In order to view content on that HTTP server through the browser on your laptop, you need to configure port forwarding.

##### Port Forwarding with Putty on Windows

In your putty configuration, select **Connection** , **SSH** , **Tunnels** and add a mapping:

```

Source port: 3000

Destination: 127.0.0.1:3000

```

The configuration should look like this:

![Putty Tunnel Config](images/putty-tunnel-config.png)

##### Port Forwarding with Bitvise SSH Client on Windows

In **Profile** window, select **C2S** tab, create an entry with this configuration:

```

Listen Interface: 127.0.0.1

List. Port: 3000

Destination Host: localhost

Dest. Port: 3000

```

C2S configuration should look similar to this:

![Bitvise Tunnel Config](images/bitvise-tunnel-config.png)

</details>

<details>
<summary><strong>Windows SAM Local Installation</strong></summary>

*Note*: Security policies applied to your Windows configuration may interfere with installation of prerequisites for SAM Local.  For this workshop, you may find it easier to use SAM Local on an Amazon Linux EC2 instance (see instructions above).

If you intend to use Windows on your local machine, note that the key requirement is to run Docker Linux containers.  Depending on the local configuration of Windows, you may be able to install Docker Toolbox. SAM Local will use the DOCKER\_HOST environment variable to contact the docker daemon.

The procedure to setup requirements and SAM Local:

1. Install [Docker Toolbox](https://download.docker.com/win/stable/DockerToolbox.exe)
2. Run a few docker commands from CLI (e.g. 'docker ps') to verify the installation
3. Install [NodeJS](https://nodejs.org/dist/v6.11.4/node-v6.11.4-x64.msi)
4. Install [Git for Windows](https://git-scm.com/download/win) – test that you can use git from command line
5. Use NPM to install SAM Local

```bash

npm install -g aws-sam-local

```

Test by executing sam local, you should see help contents displayed.

```bash

sam local

```

output should looks similar to this: 
![SAM Local Help](images/sam-local-help.png)

</details>

<details>
<summary><strong>Mac OS SAM Local Installation</strong></summary>

1. Install Docker
2. Install NodeJS
3. Use NPM to install SAM Local

```bash

npm install -g aws-sam-local

```

Test by executing sam local, you should see help contents displayed.

```bash

sam local

```

output should looks similar to this: 
![SAM Local Help](images/sam-local-help.png)

</details>

### Clone Repository

If you have successfully cloned uni-api repo in Module 0 **and** you are using your local machine (not remote EC2 instance), then you can skip this section and move on to Local Web Service Development.

<details>
<summary><strong>Cloning Code Repository to Local Disk</strong></summary>
If you are using remote EC2 instance or if you have not cloned the uni-api repository as instructed in Module 0, then follow these steps to clone uni-api repo:

1. In **AWS Console** , navigate to **CodeStar** service
2. Select **uni-api** project
3. Click on **Project** , then Connect tools
4. Select Command line tools and click Next
5. Select your Operating System and use HTTPS for Connection Method
6. Follow the instructions shown in the console

As a result, you should have uni-api code repository cloned to local directory.  Listing the directory should show you files stored in the repository:

```bash

$ ls  uni-api/

app.js  buildspec.yml  index.js  package.json  README.md  template.yml

```

After synchronizing the code to local machine, you are now ready to test local code development with SAM Local.
</details>

## Local Web Service Development

You will now use SAM Local to make modifications to a web service.  Since it executes locally, you are able to make quick changes and immediately test the web service.  Note that this step requires that you have cloned uni-api project from CodeCommit to your disk.  SAM Local commands will parse template and code in those files to emulate a local Lambda environment.

<details>
<summary><strong>Step-by-Step Instructions</strong></summary>

You will use start-api option wich creates a local HTTP server hosting all of your Lambda functions.  SAM Local will parse the SAM template file, in this case template.yml file.  It will launch the Lambda function defined in AWS::Serverless::Function section.  You will be able to interact with the function using your browser.  After you make changes to the code, those will be immediately visible in your browser.

In command prompt, execute SAM Local start-api in the directory containing local copy of the code:

```bash

cd /home/ec2-user/uni-api/

npm install

sam local start-api

```

**Note:** adjust the path to match location of the uni-api repo on your disk.

SAM Local downloads the container image and starts its execution using local Docker service.  In addition, local HTTP server launches at [http://127.0.0.1:3000](http://127.0.0.1:3000).  
![start-api output](images/start-api-output.png)

Open the browser on your local machine and view the output:
![Hello World in Browser](images/browser-hello-world.png)

Now, make a modification to the app.  Edit **app.js** file in any text editor and find this section that responds to GET requests:

```javascript

app.get('/', function(req, res) {

  res.send({

    'Output': 'Hello World!';

  });

});

```

Modify the message 'Hello World!' to 're:invent the World!' and save the file.  Refresh the browser and you will immediately see the updated message.

![re:invent the World in Browser](images/browser-reinvent-world.png)

That's it!  You modified the code and got immediate feedback in your browser.  
</details>

## Completion

Congratulations!  You have successfully installed SAM Local, then performed local development and testing of a serverless API.  Using SAM Local will help you to iterate code changes quickly while getting instant feedback.