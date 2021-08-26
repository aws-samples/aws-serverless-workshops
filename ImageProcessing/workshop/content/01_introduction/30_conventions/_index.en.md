+++
title = "Conventions & Best Practices"
chapter = false
weight = 3
+++

This workshop is composed of a combination of english-language instructions, code and Javascript Object Notation (JSON) snippets, and images from the AWS Console. Because of this variety of content, below is a helpful guide to make sure you understand the conventions used and the best practices recommended to get the most out of this workshop with the least amount of confusion.

### Styling used ###

#### Names ####
Sometimes something needs to be referred to using a conceptual reference, or name. For these names, we will enclose them in double quotes. For example, "Configuration panel". In this example, we may be referring to a section of the screen without an obvious label. We will illustrate or explain these names the first time we use them.

#### Key & Values & Input ####
Keys and associated values that are specifically referenceable in either code, JSON, our generated output will have the following style: `Key` or `Value`. If you're asked to type any input into a field, it will be indicated similarly. For example: Type `NewValue` into the **Name** field (we'll cover bold items below).

#### Steps ####
Each section of the workshop will ask you to perform actions within the AWS Console or other AWS tools. We will refer to these as "Steps" These steps are easy to pick out and reference as they start with

➡️ Step 1: \<Followed by some instructions\>

➡️ Step 2: \<Followed by some instructions\>

#### UI Components ####
Instructions will often ask you to click a button or link (or other web-based UI component). These will be highlighted in **BOLD**. For example, the instructions might ask you to click the **Submit** button, or check the **Acknowledge** check box.

#### Notices ####
When there is context that is worth noting, but isn't necessarily part of the instructions, we'll use styled notices to call this information out. There are three types of notices you will see throughtout this workshop: Tip, Info, and Warning.

{{% notice tip %}}
Tip notices contain helpful information that may be useful or make your experience better. You could ignore them without too much consequence, but they are nice to know.
{{% /notice %}}

{{% notice info %}}
Info notices contain information you should be aware of. There may be consequences that significantly impact your experience if you choose to ignore these.
{{% /notice %}}

{{% notice warning %}}
Warning notices contain information that is critically important. Stop, make sure you understand them, and follow the instructions or guidance. Failing to do so can lead you down extensive troubleshooting paths.
{{% /notice %}}

#### Code Blocks ####

Code blocks (either for code snippets or JSON objects) will be formatted as follows:

    aws rekognition delete-collection \
      --collection-id rider-photos \
      --region us-east-1

{{< highlight json >}}
{
     "StatusCode": 200,
     "CollectionArn": "aws:rekognition:us-east-1:0123456789:collection/rider-photos",
     "FaceModelVersion": "5.0"
}	{{< /highlight>}}

These have an icon in the top right that allows you to quickly copy thier contents to your clip board.

#### Images with Focus Areas ####
This workshop makes extensive use of images and screenshots. Some of them have areas that are highlighted to draw your attention to them or indicate where you should be interacting with the UI. Focus areas are indicated by red bounding-boxes like the following:

{{< figure
	src="/images/statemachine-step1.png"
	alt="Step 1"
>}}

#### End of Section ####
Once you reach the end of the section, you'll see a green check mark with a congratulatory message. Below is an example of this.

:white_check_mark: Great job! You can move to the next section.

### Best Practices ###

Below is a set of best practices that we recommend to get the most out of this workshop.

#### Don't skip steps ####
Steps are tied to a broad goal (i.e., "Navigate to the S3 dashboard", or "Configure the Lambda Integration") and the broad goal may be reused for multiple steps in different sections. Scan through the step to make sure there's not some contextually important sub-step that is needed 'this time through'. You will often navigate back and forth to various tools within AWS Console, this might lead you to believe if you've seen the step once, you should do what you did before.

#### Use Multiple Tabs ####
Save context switching time by using multiple open tabs at once. When you're logged into the AWS Console, you can, and should, keep various tools open in different tabs. A good example of this is using Cloud9 IDE in one tab, StepFunctions Dashboard in another, and S3 dashboard in another. Doing so allows you to quickly jump back to previous steps in case you missed something.

#### Revisit the Content After the Workshop ####
Getting proficient with anything takes practice. Going through this once will expose you to the general process of accomplishing a goal. Repeat the workshop a few times to reinforce your knowledge, think about how you could accomplish the tasks a different way as you learn more AWS services, or to refresh your knowledge after you've been away from the material for some lengthy time periods. This content will likely change as the AWS Console interface is updated, and over time, things *look* different and require different steps.


:white_check_mark: Great job! You can move to performing prerequisite tasks necessary before we can get started building the workflow.
