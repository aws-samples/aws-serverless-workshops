'use strict';

(function() {
  const Dashboard = {};

  Dashboard.Map = function(L) {
    const circleColor = 'blue';
    const circleRadius = 50;
    const gcFrequency = 1000;
    const iconSize = 30;
    const iconUrl = 'images/unicorn-icon.png';
    const lineColor = 'orange';
    const mapAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
    const mapBoxAccessToken = 'pk.eyJ1IjoicGlnbmF0YWoiLCJhIjoiY2o3a2xrcDlxMHBxeTJxcW5wa2JlZW1mbyJ9.7dKS6nM8xwV-92s_3HMWtA';
    const mapBoxEndpoint = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
    const mapBoxLayerId = 'mapbox.streets';
    const mapCenter = [40.749167, -73.985184];
    const mapZoom = 12;
    const unicornTimeout = 30000;
    const metersPerSecondInMPH = 2.23694;

    return {
      init: function(divName) {
        this.icon = L.icon({
          iconSize: iconSize,
          iconUrl: iconUrl,
        });
        this.map = L.map(divName).setView(mapCenter, mapZoom);
        this.unicorns = {};

        L.circle(mapCenter, {
          color: circleColor,
          radius: circleRadius,
        }).addTo(this.map);

        garbageCollector(this.unicorns, this.map);

        return this;
      },

      render: function() {
        L.tileLayer(mapBoxEndpoint, {
          accessToken: mapBoxAccessToken,
          attribution: mapAttribution,
          id: mapBoxLayerId,
        }).addTo(this.map);

        return this;
      },

      update: function(status) {
        if (!this.unicorns.hasOwnProperty(status.Name)) this.add(status);

        const unicorn = this.unicorns[status.Name];
        const mph = (status.Distance*metersPerSecondInMPH).toFixed(1);
        const popUpMsg = `
          <p id="popUpName">${status.Name}</p>

          <table id="popUpDetails">
            <tr>
              <td class="popUpDetailsHeader">Speed</td>
              <td>${mph} mph</td>
            </tr>
            <tr>
              <td class="popUpDetailsHeader">Health</td>
              <td>${status.HealthPoints} points</td>
            </tr>
            <tr>
              <td class="popUpDetailsHeader">Magic</td>
              <td>${status.MagicPoints} points</td>
            </tr>
          </table>
        `;

        unicorn.polyline.addLatLng([status.Latitude, status.Longitude]);
        unicorn.marker
          .setLatLng([status.Latitude, status.Longitude])
          .bindPopup(popUpMsg);

        unicorn.lastStatusTime = new Date();

        return this;
      },

      add: function(status) {
        const unicorn = {};

        unicorn.polyline = L.polyline([mapCenter], {
          color: lineColor,
        }).addTo(this.map);
        unicorn.marker = L.marker([status.Latitude, status.Longitude], {
          icon: this.icon,
        }).addTo(this.map);

        this.unicorns[status.Name] = unicorn;

        return this;
      }
    };

    function garbageCollector(unicorns, map) {
      setInterval(function() {
        Object.keys(unicorns).forEach(function(unicornName) {
          const unicorn = unicorns[unicornName];
          const now = new Date().getTime();

          if (now - unicorn.lastStatusTime.getTime() > unicornTimeout) {
            unicorn.polyline.removeFrom(map);
            unicorn.marker.removeFrom(map);

            delete unicorns[unicornName];
          }
        });
      }, gcFrequency);
    }
  }

  Dashboard.Poller = function(kinesis, map, console) {
    const streamName = 'wildrydes';
    const shardIteratorType = 'LATEST';
    const pollFrequency = 1000;

    return {
      poll: function() {
        return describeStream(streamName)
          .then((data) => data.StreamDescription.Shards.map((shard) => shard.ShardId))
          .then((shardIds) => getShardIterators(shardIds))
          .then((data) => data.map((shardIterator) => shardIterator.ShardIterator))
          .then((shardIteratorIds) => getRecords(shardIteratorIds))
          .catch(console.error);
      }
    };

    function describeStream(streamName) {
      const params = {
        StreamName: streamName,
      };

      return kinesis.describeStream(params).promise();
    }

    function getShardIterators(shardIds) {
      const iterators = shardIds.map(function(shardId) {
        const params = {
          ShardId: shardId,
          ShardIteratorType: shardIteratorType,
          StreamName: streamName,
        };

        return kinesis.getShardIterator(params).promise();
      });

      return Promise.all(iterators);
    }

    function getRecords(shardIteratorIds) {
      const recordSets = shardIteratorIds.map(function(shardIteratorId) {
        const params = {
          ShardIterator: shardIteratorId,
        };

        return kinesis.getRecords(params).promise();
      });

      return Promise.all(recordSets)
        .then((recordSets) => update(recordSets))
        .then((recordSets) => recordSets.map((records) => records.NextShardIterator))
        .then((shardIteratorIds) => setTimeout(() => getRecords(shardIteratorIds), pollFrequency))
        .catch(function(err) {
          console.error(err);
          setTimeout(() => getRecords(shardIteratorIds), pollFrequency);
        });
    }

    function update(recordSets) {
      recordSets.forEach(function(records) {
        records.Records.forEach(function(record) {
          const status = JSON.parse(record.Data);

          console.log(status);
          map.update(status);
        });
      });

      return recordSets;
    }
  }

  $(window).on('load', function() {
    const map = Dashboard.Map(L).init('map').render();

    if (Cookies.get('cognitoIdentityPoolId') !== undefined) {
      $('#cognitoIdentityPoolId').val(Cookies.get('cognitoIdentityPoolId'));
      $('#modal').on('shown.bs.modal', () => $('button').focus());
    }

    $('form').on('submit', function(e) {
      e.preventDefault();

      const cognitoIdentityPoolId = $('#cognitoIdentityPoolId').val();
      const region = cognitoIdentityPoolId.substring(0, cognitoIdentityPoolId.indexOf(":"))

      AWS.config.region = region;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: cognitoIdentityPoolId,
      });

      const kinesis = new AWS.Kinesis({});

      kinesis.listStreams().promise()
        .then(() => Cookies.set("cognitoIdentityPoolId", cognitoIdentityPoolId))
        .then(() => Dashboard.Poller(kinesis, map, console).poll())
        .then(() => $('#modal').modal('hide'))
        .catch((err) => $('#modal .notice').text(err).show());
    });

    $('#modal').modal('show');
  });
})();
