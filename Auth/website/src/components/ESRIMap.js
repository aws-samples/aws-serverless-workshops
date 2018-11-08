/*
 *   Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 *  Licensed under the Apache License, Version 2.0 (the "License").
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the "license" file accompanying this file. This file is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *  express or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 */
import React from 'react';
import { loadModules } from 'esri-loader';

class ESRIMap extends React.Component {
    static defaultProps = {
      mapOptions: {
        basemap: 'gray-vector'
      }
    };

    constructor(props) {
      super(props);
      this.state = { status: 'loading' };
      this.esriOptions = {
        url: 'https://js.arcgis.com/4.6/'
      };
      this.style = {
        container: {
          height: '100vh',
          width: '100vw'
        },
        map: {
          padding: 0,
          margin: 0,
          height: '100%',
          width: '100%'
        }
      };
    }

    /**
     * Loads the ESRI modules and returns them as an object
     */
    async loadEsriModules() {
      const [
        Map,
        MapView,
        Graphic,
        Point,
        TextSymbol,
        PictureMarkerSymbol,
        webMercatorUtils
      ] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/geometry/Point',
        'esri/symbols/TextSymbol',
        'esri/symbols/PictureMarkerSymbol',
        'esri/geometry/support/webMercatorUtils'
      ], this.esriOptions);

      return {
        Map,
        MapView,
        Graphic,
        Point,
        TextSymbol,
        PictureMarkerSymbol,
        webMercatorUtils
      };
    }

    async componentDidMount() {
      try {
        const ESRI = await this.loadEsriModules();
        this.xyToLngLat = ESRI.webMercatorUtils.xyToLngLat;

        const map = ESRI.Map({ basemap: 'gray-vector' });
        const view = ESRI.MapView({
          center: [-122.31, 47.60],
          container: 'esriMapView',
          map: map,
          zoom: 12
        });

        const pinSymbol = new ESRI.TextSymbol({
          color: '#f50856',
          text: '\ue61d',
          font: { size: 20, family: 'CalciteWebCoreIcons' }
        });

        var unicornSymbol = new ESRI.PictureMarkerSymbol({
          url: 'https://s3.amazonaws.com/aws-mobile-hub-images/wild-rydes/unicorn-icon.png',
          width: '25px',
          height: '25px'
        });

        this.pinGraphic = null;
        if (this.props.pinLocation) {
          this.selectedPoint = this.props.pinLocation;
          this.pinGraphic = new ESRI.Graphic({
            symbol: this.state.pinSymbol,
            geometry: this.selectedPoint
          });
          view.graphics.add(this.pinGraphic);
        }

        // Watch for map re-centering
        view.watch('center', (position) => this.updateCenter(position));

        // Watch for map pinch-and-zoom actions
        view.watch('extent', (extent) => this.updateExtent(extent));

        // Watch for map click events
        view.on('click', (event) => {
          this.unsetLocation();
          this.selectedPoint = event.mapPoint;
          this.pinGraphic = new ESRI.Graphic({
            symbol: this.state.pinSymbol,
            geometry: this.selectedPoint
          });
          view.graphics.add(this.pinGraphic);

          if (this.props.onMapClick) {
            this.props.onMapClick(this.selectedPoint);
          }
        });

        view.then(() => {
          // Set the current map settings in the object
          // once it is rendered
          this.updateCenter(view.center);
          this.updateExtent(view.extent);

          // Store the status of the map
          this.setState({
            map,
            view,
            pinSymbol,
            unicornSymbol,
            status: 'loaded'
          });
        });
      } catch (err) {
        console.error(err);
      }
    }

    /**
     * Updates the position of the map by re-centering.
     *
     * @param {Point} position the new center of the map
     */
    updateCenter(position) {
      this.center = {
        latitude: position.latitude,
        longitude: position.longitude
      }
    }

    /**
     * Updates the extents of the map - used when zooming
     *
     * @param {Rectangle} extent
     */
    updateExtent(extent) {
      if (typeof this.xyToLngLat !== 'undefined') {
        var min = this.xyToLngLat(extent.xmin, extent.ymin);
        var max = this.xyToLngLat(extent.xmax, extent.ymax);
        this.extent = {
          minLng: min[0],
          minLat: min[1],
          maxLng: max[0],
          maxLat: max[1]
        };
      }
    }

    unsetLocation() {
      this.selectedPoint = null;
      if (this.pinGraphic !== null) {
        this.state.view.graphics.remove(this.pinGraphic);
        this.pinGraphic = null;
      }
    }

    render() {
      return (
        <div style={this.style.container}>
          <div id='esriMapView' style={this.style.map}>
            {this.state.status === 'loading' && (<div>Loading...</div>)}
          </div>
        </div>
      );
    }
}

export default ESRIMap;
