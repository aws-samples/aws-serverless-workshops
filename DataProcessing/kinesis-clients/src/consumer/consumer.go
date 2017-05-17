package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/kinesis"
	"os"
	"sync"
)

func main() {
	region := flag.String("region", "us-east-1", "Region")
	stream := flag.String("stream", "wildrydes", "Stream Name")
	flag.Parse()

	sess := session.Must(
		session.NewSession(
			&aws.Config{
				Region: region,
			},
		),
	)

	pollShards(kinesis.New(sess), stream)
}

func pollShards(client *kinesis.Kinesis, stream *string) {
	var wg sync.WaitGroup

	streamDescription, err := client.DescribeStream(
		&kinesis.DescribeStreamInput{
			StreamName: stream,
		},
	)

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	for _, shard := range streamDescription.StreamDescription.Shards {
		go getRecords(client, stream, shard.ShardId)
		wg.Add(1)
	}

	wg.Wait()
}

func getRecords(client *kinesis.Kinesis, stream *string, shardID *string) {
	shardIteratorRes, err := client.GetShardIterator(
		&kinesis.GetShardIteratorInput{
			StreamName:        stream,
			ShardId:           shardID,
			ShardIteratorType: aws.String("LATEST"),
		},
	)

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	shardIterator := shardIteratorRes.ShardIterator

	for {
		records, err := client.GetRecords(
			&kinesis.GetRecordsInput{
				ShardIterator: shardIterator,
			},
		)

		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}

		for _, record := range records.Records {
			var prettyJSON bytes.Buffer
			err := json.Indent(&prettyJSON, record.Data, "", "    ")

			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}

			fmt.Println(string(prettyJSON.Bytes()))
		}

		shardIterator = records.NextShardIterator
	}
}
