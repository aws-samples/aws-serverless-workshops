package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/kinesis"
	"math"
	"math/rand"
	"os"
	"time"
)

const minDistance = 100
const maxDistance = 200
const distanceDelta = 20
const latitudeStart = 40.749167
const longitudeStart = -73.985184
const latitudeOffset = 110540
const longitudeOffset = 111320
const pointsStart = 150

type unicornStatus struct {
	Name         *string
	StatusTime   string
	Latitude     float64
	Longitude    float64
	Distance     int
	MagicPoints  int
	HealthPoints int
}

func main() {
	name := flag.String("name", "Shadowfax", "Unicorn Name")
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

	simulateUnicorn(kinesis.New(sess), name, region, stream)
}

func simulateUnicorn(client *kinesis.Kinesis, name, region, stream *string) {
	rand.Seed(time.Now().UnixNano())

	magicPoints := pointsStart
	healthPoints := pointsStart
	minDistance := rand.Intn(maxDistance-minDistance) + minDistance
	maxDistance := minDistance + distanceDelta
	latitude := latitudeStart
	longitude := longitudeStart
	bearing := rand.Float64() * math.Pi * 2
	ticker := time.NewTicker(time.Second)

	for {
		magicPoints = nextPoints(magicPoints)
		healthPoints = nextPoints(healthPoints)
		distance := rand.Intn(maxDistance-minDistance) + minDistance
		latitude, longitude = nextLocation(latitude, longitude, bearing, distance)
		status, err := json.Marshal(
			&unicornStatus{
				Distance:     distance,
				HealthPoints: healthPoints,
				Latitude:     latitude,
				Longitude:    longitude,
				MagicPoints:  magicPoints,
				Name:         name,
				StatusTime:   time.Now().Format("2006-01-02 15:04:05.000"),
			},
		)

		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}

		<-ticker.C
		_, err = client.PutRecord(
			&kinesis.PutRecordInput{
				Data:         []byte(status),
				PartitionKey: name,
				StreamName:   stream,
			},
		)

		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}

		fmt.Print(".")
	}
}

func nextLocation(latitude, longitude, bearing float64, distance int) (nextLatitude, nextLongitude float64) {
	nextLatitude = latitude + float64(distance)*math.Sin(bearing)/latitudeOffset
	nextLongitude = longitude + float64(distance)*math.Cos(bearing)/(longitudeOffset*math.Cos(math.Pi*latitude/180))

	return
}

func nextPoints(points int) int {
	y := rand.Intn(2)

	if rand.Int()%2 == 0 {
		y = y * -1
	}

	return points + y
}
