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
import PageList from './PageList';

class SiteNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpened: false
    };
  }

  onClick(event) {
    this.setState({ menuOpened: !this.state.menuOpened });
  }

  render() {
    const cl = this.state.menuOpened ? 'menu-opened' : 'menu-closed';
    const clickHandler = (event) => this.onClick(event);

    return (
      <div className={cl}>
        <nav className="site-nav">
          <PageList/>
        </nav>
        <button type="button" className="btn-menu" onClick={clickHandler}>
          <span>Menu</span>
        </button>
      </div>
    );
  }
}

export default SiteNav;
