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

class EmailSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', emailsubmitted: false };
  }

  onEmailChanged(event) {
    this.setState({ email: event.target.value.toLowerCase() });
  }

  /* TODO: HANDLE FORM INPUT */
  onEmailSubmitted(event) {
    event.preventDefault();

    this.setState({ email: '', emailsubmitted: true });
  }
  /* END OF PINPOINT CHANGES */

  render() {
    if (this.state.emailsubmitted) {
      return (<h2>Thank you for signing up</h2>);
    }
    return (
      <div>
        <h2 className="section-title">Sign Up</h2>
        <p className="content">Wild Rydes is coming sooon! Enter your email to enter the limited private beta</p>
        <form onSubmit={(event) => this.onEmailSubmitted(event)} >
          <input type="email" value={this.state.email} placeholder="Enter your email address" onChange={(event) => this.onEmailChanged(event)}/>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default EmailSignUp;
