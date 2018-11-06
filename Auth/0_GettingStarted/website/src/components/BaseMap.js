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

class BaseMap extends React.Component {
    static defaultProps = {
      mapOptions: {
        basemap: 'gray-vector'
      },
      viewOptions: {
        zoom: 12,
        center: [ -122.31, 47.60 ]
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

    componentDidMount() {
      loadModules([ 'esri/Map', 'esri/views/MapView' ], this.esriOptions)
        .then(([Map, MapView]) => {
          const map = new Map(this.props.mapOptions);
          const view = new MapView({
            container: 'esriMapView',
            map,
            ...this.props.viewOptions
          });
          view.then(() => {
            this.setState({ map, view, status: 'loaded' });
          });
        });
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

export default BaseMap;

