# Example Workshop [Replace with your workshop title]

This directory should be used as a basic template for building new workshops.

The primary README.md file in the main workshop directory should contain a brief overview of the topics being covered and set expectations for the student about what they should expect to learn. It should also instruct students to complete the Pre Lab before starting the workshop to ensure they have the appropriate background knowledge and to verify that their environment and AWS account is configured correctly in order for them to successfully complete the modules.

Keep the workshop summary relatively short. One or two paragraphs is fine. Detailed discussion of architectural topics should be done in each module or potentially in a standalone page linked to from the primary landing page.

The main README.md file of your workshop should serve as an appropriate landing page for complete newcomers to the Wild Rydes repo. Expect that there will be links directly to this page and that a self-serve student should be able to easily complete your workshop based on the information and links provided.

## Prerequisites

Provide a list of prerequisites that are required to successfully complete your workshop. This should include setting up an AWS account (note if you support multiple students sharing a single account), installing and configuring the CLI, and setting up any other tools students may need. Additionally, if there are specific skills or technologies students need to have existing knowledge of, you should list those here.

Add a subsection for each prerequisite.

## Modules

A workshop consists of multiple modules. Each module should cover a single, cohesive topic and take between 30 and 60 minutes for all students to complete. Consider the least experienced students who are likely to take this workshop when scoping your modules.

You should strongly consider providing CloudFormation templates that students can use to launch any required resources from previous modules to enable students to jump ahead to later modules without having to complete the preceeding modules manually.

Provide a numbered list with links to each module

1. [Example Module 1](1_ExampleTemplate)
2. [Example Module 2](2_Example2)
