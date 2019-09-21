# About
This yaml file is used to create the necessary cognito 
resources, e.g. user pool, identity pool, etc.




# Instructions

- cd into cfn folder and execute the following.

```bash
aws cloudformation deploy \
--region eu-west-1 \
--template-file web-ui-stack.yaml \
--stack-name ticket-service-ui \
--capabilities CAPABILITY_IAM
```

- You will use the output of the executed template to update reference ids in
  the UI code: [environment.ts](../src/environments/environment.ts) (See TODO Comments in file)



# Useful commands

```bash
aws cloudformation validate-template --template-body file://cognito.yaml
```


