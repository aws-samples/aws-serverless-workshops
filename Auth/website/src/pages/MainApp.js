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
import BaseMap from '../components/BaseMap';
import ESRIMap from '../components/ESRIMap';
import Amplify from 'aws-amplify';
import { Auth, API } from 'aws-amplify';
import awsConfig from '../amplify-config';
import '../css/ride.css';

const apiName = 'WildRydesAPI';
const apiPath = '/ride';

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: null,
      idToken: null,
      requestRideEnabled: false,
      updates: [
        'Welcome! Click the map to set your pickup location.'
      ]
    };
  }

  async componentDidMount() {
    const session = await Auth.currentSession();
    this.setState({ authToken: session.accessToken.jwtToken });
    this.setState({ idToken: session.idToken.jwtToken });
  }

  /**
   * Determines if the API is enabled
   *
   * @return {Boolean} true if API is configured
   */
  hasApi() {
    // const api = awsConfig.API.endpoints.filter(v => v.endpoint !== '');                                                   
    // return (typeof api !== 'undefined');
  }

  /**
   * Calls the backend API to retrieve the Unicorn data
   *
   * @param {Number} latitude
   * @param {Number} longitude
   */
  async getData(pin) {
    console.error('Request a Ride is not implemented');
  }

  /**
   * Called when Request Ride is called
   */
  async onClick() {
    if (!this.state.pin) {
      console.error('No pin present - skipping');
      return true;
    }

    const updates = [ 'Requesting Unicorn' ];
    try {
      this.setState({
        requestRideEnabled: false,
        updates
      });
      const data = await this.getData(this.state.pin);
      console.log(data);
      updates.push([ `Your unicorn, ${data.Unicorn.Name} will be with you in ${data.Eta}` ]);
      this.setState({ updates });

      // Let's fake the arrival
      setTimeout(() => {
        console.log('Ride Complete');
        const updateList = this.state.updates;
        updateList.push([ `${data.Unicorn.Name} has arrived` ]);
        this.setState({
          updates: updateList,
          requestRideEnabled: false,
          pin: null
        });
      }, data.Eta * 1000);
    } catch (err) {
      console.error(err);
      updates.push([ 'Error finding unicorn' ]);
      this.setState({ updates });
    }
  }

  /**
   * Called when the mapClick happens
   * @param {Point} position the position of the map pin
   */
  onMapClick(position) {
    console.log(`onMapClick(${JSON.stringify(position)})`);
    this.setState({ pin: position, requestRideEnabled: true });
  }

  render() {
    const hasApi = this.hasApi();

    // If API is not configured, but auth is, then output the
    // token.
    if (!hasApi) {
      return (
        <div>
          <BaseMap/>
          <div className="configMessage">
            <div className="backdrop"></div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Successfully Authenticated!</h3>
              </div>
              <div className="panel-body">
                <p>This page is not functional yet because there is no API configured.</p>
                <p>Here is your user's identity token:</p>
                <p className="idToken">{this.state.idToken}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If the API is configured, then display the "requestUnicorn"
    // button.  If data is available (i.e. unicorn is requested),
    // then display the additional patterns (unicorn on map).
    const updateList = this.state.updates.map(
      (v, i) => <li key={i}>{v}</li>
    );
    return (
      <div>
        <div className="info panel panel-default">
          <div className="panel-heading">
            <button id="request" className="btn btn-primary" disabled={!this.state.requestRideEnabled} onClick={() => this.onClick()}>Request</button>
          </div>
          <div className="panel-body">
            <ol id="updates">{updateList}</ol>
          </div>
        </div>
        <div id="main">
          <ESRIMap onMapClick={(position) => { this.onMapClick(position); }}/>
        </div>
      </div>
    );
  }
}

export default MainApp;
