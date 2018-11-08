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
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Home, FAQ, Investors, MainApp, Unicorns, Profile } from './pages';
import { SignIn, SignUp } from './auth';
import 'normalize.css';

const isAuthenticated = () => false; 

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
    isAuthenticated() === true
      ? <Component {...props} />
      : <Redirect to='/signin' />
  )} />
)

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/faq" component={FAQ} />
          <Route path="/investors" component={Investors} />
          <Route path="/unicorns" component={Unicorns} />
          <Route path="/register" component={SignUp} />
	        <Route path="/signin" component={SignIn} />
          <Route path="/profile" component={Profile} />
          <PrivateRoute path="/app" component={MainApp} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
