.PHONY: all clean

all: consumer producer
	tar -cvf client.tar producer consumer

consumer:
	go build consumer.go

producer:
	go build producer.go

clean:
	rm client.tar producer consumer
