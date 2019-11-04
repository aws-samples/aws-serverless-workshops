package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"math"
	"math/rand"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/kinesis"
)

const (
	latitudeStart   = 40.749167
	longitudeStart  = -73.985184
	latitudeOffset  = 110540
	longitudeOffset = 111320
	minDistance     = 29.0
	maxDistance     = 31.0
)

type unicornStatus struct {
	Distance     float64
	HealthPoints int
	Latitude     float64
	Longitude    float64
	MagicPoints  int
	Name         *string
	StatusTime   string
}

func main() {
	name := flag.String("name", "Shadowfax", "Unicorn Name")
	stream := flag.String("stream", "wildrydes", "Stream Name")

	flag.Parse()

	sess := session.Must(
		session.NewSessionWithOptions(
			session.Options{
				SharedConfigState: session.SharedConfigEnable,
			},
		),
	)

	simulateUnicorn(kinesis.New(sess), name, stream)
}

func simulateUnicorn(client *kinesis.Kinesis, name, stream *string) {
	rand.Seed(time.Now().UnixNano())

	latitude := latitudeStart
	longitude := longitudeStart
	bearing := rand.Float64() * math.Pi * 2
	ticker := time.NewTicker(time.Second)

	for range ticker.C {
		distance := float64(rand.Intn(maxDistance-minDistance)+minDistance) + rand.Float64()
		magicPoints := nextPoints(distance)
		healthPoints := nextPoints(distance)
		latitude, longitude = nextLocation(latitude, longitude, bearing, distance)
		status, _ := json.Marshal(
			&unicornStatus{
				Distance:     distance,
				HealthPoints: healthPoints,
				Latitude:     latitude,
				Longitude:    longitude,
				MagicPoints:  magicPoints,
				Name:         name,
				StatusTime:   randate().Format("2006-01-02 15:04:05.000"),
			},
		)
		putRecordInput := &kinesis.PutRecordInput{
			Data:         append([]byte(status), "\n"...),
			PartitionKey: name,
			StreamName:   stream,
		}

		if _, err := client.PutRecord(putRecordInput); err != nil {
			fmt.Println(err)
			os.Exit(1)
		}

		fmt.Print(".")
	}
}

func nextLocation(latitude, longitude, bearing float64, distance float64) (nextLatitude, nextLongitude float64) {
	nextLatitude = latitude + float64(distance)*math.Sin(bearing)/latitudeOffset
	nextLongitude = longitude + float64(distance)*math.Cos(bearing)/(longitudeOffset*math.Cos(math.Pi*latitude/180))

	return
}

func nextPoints(distance float64) int {
	return int(10 * distance)
}

func randate() time.Time {
    min := time.Date(2018, 1, 0, 0, 0, 0, 0, time.UTC).Unix()
    max := time.Date(2019, 1, 0, 0, 0, 0, 0, time.UTC).Unix()
    delta := max - min

    sec := rand.Int63n(delta) + min
    return time.Unix(sec, 0)
}
