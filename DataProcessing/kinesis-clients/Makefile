.PHONY: all fmt lint consumer producer clean

GOPATH = $(shell go env GOPATH)
VPATH = build:$(GOPATH)/src/github.com
PATH := $(PATH):$(GOPATH)/bin

all: fmt lint consumer producer

fmt:
	find . -name '*.go' -exec go fmt {} \;

lint: golang/lint
	golint -set_exit_status **/*/*.go

consumer: macos/consumer linux/consumer windows/consumer.exe

producer: macos/producer linux/producer windows/producer.exe

clean:
	rm -rf build/*

golang/lint:
	go get github.com/golang/lint

aws/aws-sdk-go:
	go get github.com/aws/aws-sdk-go

macos/consumer: aws/aws-sdk-go
	GOOS=darwin GOARCH=386 go build -o build/macos/consumer src/consumer/*

linux/consumer: aws/aws-sdk-go
	GOOS=linux GOARCH=386 go build -o build/linux/consumer src/consumer/*

windows/consumer.exe: aws/aws-sdk-go
	GOOS=windows GOARCH=386 go build -o build/windows/consumer.exe src/consumer/*

macos/producer: aws/aws-sdk-go
	GOOS=darwin GOARCH=386 go build -o build/macos/producer src/producer/*

linux/producer: aws/aws-sdk-go
	GOOS=linux GOARCH=386 go build -o build/linux/producer src/producer/*

windows/producer.exe: aws/aws-sdk-go
	GOOS=windows GOARCH=386 go build -o build/windows/producer.exe src/producer/*
