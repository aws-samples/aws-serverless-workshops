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
import { Link } from 'react-router-dom';

const PageList = () => {
    const pages = [
        { url: '/', title: 'Home' },
        { url: '/unicorns', title: 'Meet the Unicorns' },
        { url: '/investors', title: 'Investors & Board of Directors' },
        { url: '/faq', title: 'FAQ' },
        { url: '/profile', title: 'Profile' },
        { url: '/register', title: 'Apply' }
    ];

    return (
      <ul>
        {
          pages.map((v, i) => (
            <li key={i}><Link to={v.url}>{v.title}</Link></li>
          ))
        }
      </ul>
    );
};

export default PageList;
