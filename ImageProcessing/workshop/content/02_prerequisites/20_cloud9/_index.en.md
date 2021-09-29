+++
title = "Cloud9 Environment"
chapter = false
weight = 2
+++

## Starting AWS Cloud9 IDE

[AWS Cloud9](https://aws.amazon.com/cloud9) is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. It includes a code editor, debugger, and terminal. Cloud9 comes pre-packaged with essential tools for popular programming languages and the AWS Command Line Interface (CLI) pre-installed so you don’t need to install files or configure your laptop for this workshop.

Your Cloud9 environment will have access to the same AWS resources as the user you logged into the AWS Management Console with.

{{% notice info %}}
We strongly recommend using Cloud9 to complete this workshop.
{{% /notice %}}

{{% notice info %}}
Cloud9 works best with Chrome or Firefox, not Safari. Using mobile devices (iPad, smartphone, etc) is *not* recommended.
{{% /notice %}}

****

➡️ Step 1: Navigate to the "Cloud9 Dashboard."  

From the AWS Management Console, type `Cloud9` in the search field at the top of the window and select **Cloud9** from the list of services.
{{< figure
    src="/images/setup-step4.png"
    alt="Step 4"
>}}



➡️ Step 2: Start creating an environment by selecting **Create environment**.
{{< figure
    src="/images/setup-step5.png"
    alt="Step 5"
>}}

➡️ Step 3: Name the environment.

Enter `image-processing-development` into **Name** and optionally provide a **Description**. When finished, select **Next step**

{{< figure
    src="/images/setup-step6.png"
    alt="Step 6"
>}}

➡️ Step 4: Configure the environment settings.

On the "Configure settings" screen, choose an Instance type of to **t2.micro (1 GiB RAM + 1 vCPU)**. Leave all other defaults unchanged and select **Next step**.

{{< figure
    src="/images/setup-step7.png"
    alt="Step 7"
>}}

➡️ Step 5: Review the environment settings and create the environment.
{{% notice tip %}}
It can take a few minutes for your Cloud9 environment to be provisioned and prepared. Before you create your environment, it might be helpful to copy the URL of the AWS Console to the clipboard so you can open the AWS Console in a new tab. Once you click **Create environment**, the console will be replaced by the Cloud9 IDE.
{{% /notice %}}

You can simply press the **Create environment** button to create and start your Environment.

## Setting up Cloud9 IDE

➡️ Step 6: Configure your IDE and locate the terminal.

Once ready, your IDE will open to a welcome screen. Below that, you should see a terminal prompt. You can optionally close the "Welcome tab" and drag up the terminal window to give yourself more space to work in.

{{< figure
    src="/images/setup-step8.png"
    alt="Step 8"
>}}

In this terminal, you can run AWS CLI commands in here just like you would on your local computer.

{{% notice info %}}
Remember for this workshop to run all commands within the Cloud9 terminal window rather than on your local computer. Keep your AWS Cloud9 IDE opened in a browser tab throughout this workshop.
{{% /notice %}}

➡️ Step 7: Verify your environment user.

Verify that your user is logged in by running the command `aws sts get-caller-identity`. Copy and paste the command into the Cloud9 terminal window.

{{< figure
    src="/images/setup-step9.png"
    alt="Step 9"
>}}

- You'll see output indicating your account and user information:

{{< figure
    src="/images/setup-step10.png"
    alt="Step 10"
>}}

{{% notice tip %}}
Keep an open scratch pad in Cloud9 or a text editor on your local computer for notes. When the step-by-step directions tell you to note something such as an ID or Amazon Resource Name (ARN), copy and paste that into your scratch pad. You can save your AWS Console URL here as well!{{% /notice %}}

:white_check_mark: Now you have Cloud9 launched and initalized. Next, we'll begin implementing our workflow.
