SHELL := /bin/bash

include .env
STACK_NAME?=WildRydesIAM

GIT_FQDN?=                   $(shell git config --get remote.origin.url | sed 's@\(.*\):\(.*\).git@\2@g')
GIT_REF_NAME?=               $(shell git rev-parse --abbrev-ref HEAD | tr '/' '-' )
GIT_REF_SHORT?=              $(shell git log -1|head -n1|cut -d ' ' -f2- | head -c 8)

CFN_CHANGE_SET?=             $(GIT_REF_NAME)-$(GIT_REF_SHORT)

help:           ## prints help
	@cat $(MAKEFILE_LIST) | grep -e "^[a-zA-Z_\-]*: *.*## *" | awk 'BEGIN {FS = ":.*?## "}; {printf " > \033[36m%-20s\033[0m %s\n", $$1, $$2}'

info: ## env info
	@echo CFN_CHANGE_SET = $(CFN_CHANGE_SET)
	@echo GIT_FQDN = $(GIT_FQDN)
	@echo GIT_REF_NAME = $(GIT_REF_NAME)
	@echo GIT_REF_SHORT = $(GIT_REF_SHORT)
	@echo STACK_NAME = $(STACK_NAME)

update-stack:  ## update cfn template
	aws cloudformation create-change-set --change-set-name ${CFN_CHANGE_SET} --stack-name ${STACK_NAME} --capabilities CAPABILITY_IAM --template-body file://./iam.template --parameters=ParameterKey=Password,ParameterValue=${PASSWORD}
	aws cloudformation describe-change-set --change-set-name ${CFN_CHANGE_SET} --stack-name ${STACK_NAME}
	sleep 10
	aws cloudformation execute-change-set --change-set-name ${CFN_CHANGE_SET} --stack-name ${STACK_NAME}


validate-stack: ## cfn validate template
	aws cloudformation validate-template --template-body file://./iam.template
