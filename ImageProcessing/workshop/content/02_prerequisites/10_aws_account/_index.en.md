+++
title = "Console Login"
chapter = false
weight = 1
+++

## Logging into AWS Event Engine
{{% notice info %}}
This section is applicable only to workshops leveraging an AWS account via the AWS Event Engine service. Alternatively, you can use an AWS Account with IAM Administrator privileges. If you already have an AWS account, and have IAM Administrator access, you can log in using those credentials and then [skip ahead to Region Selection]({{< ref "#region-selection" >}} "Go to Cloud9 Setup" ).
{{% /notice %}}


To complete this workshop, you are provided with an AWS account via the AWS Event Engine service. You will find a 12-digit hash at your table - this is your unique access code.

➡️ Step 1: Open <a href="https://dashboard.eventengine.run" target="_blank">AWS Event Engine</a>.

{{< figure
    src="/images/setup-step1.png"
    alt="Step 1"
>}}

➡️ Step 2: Enter the hash code ({{< defHash >}}) and click the green login button. **Accept Terms & Login**.

{{< figure
    src="/images/setup-step2.png"
    alt="Step 2"
>}}

➡️ Step 3: Choose **AWS Console**, then **Open AWS Console**.

This account will expire at the end of the workshop and the all the resources created will be automatically deprovisioned. You will not be able to access this account after today.

## Region selection

Once you have logged in to the AWS Console, you should make sure the appropriate region is selected. This workshop lab guide supports the following regions:

- US East (N. Virginia) us-east-1

{{% notice warning %}}
If using AWS Event Engine, you should use the region provided by the workshop host(s) for the entirety of this workshop as other regions will not be functional or you may encounter unexpected errors.
{{% /notice %}}

➡️ Step 4: Select the assigned region in the top right corner of the AWS Console.

{{< figure
    src="/images/setup-step3.png"
    alt="Step 3"
>}}


:white_check_mark: Now have now logged in to the AWS Console and selected your region. Lets continue by setting up a Cloud9 environment so that we can run some AWS commands from the command line.
