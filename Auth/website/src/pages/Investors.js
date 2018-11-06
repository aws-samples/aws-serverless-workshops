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
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

import '../css/main.css';

const Investor = (props) => {
  const cl = `title ${props.className}`;
  return (
    <div className="investor">
      <h2 className={cl}>
        {props.title}
      </h2>
      <div className="subtitle">{props.type}</div>
      <p className="content">{props.description}</p>
    </div>
  );
};

const InvestorsList = () => {
  const investors = [
    {
      className: 'pcp',
      title: 'Penglai Communications and Post New Century Technology Corporation Ltd',
      type: 'Global Communications Provider',
      description: 'PCPNCTC was formed in 2008 to hold the telecommunications services, media, and IT businesses of Penglai Communications and Post LTD, a multinational mass media and telecommunications company. PCPL provides broadband subscription television services, fixed telephone, and mobile telephone across 20 countries and 3 continents.'
    },
    {
      className: 'awesome',
      title: 'Tenderloin Capital',
      type: 'Venture Capital Firm',
      description: 'What makes us awesome sauce and not your typical venture firm? Backed by over three decades of experience and partnering successfully with entrepreneurs, Tenderloin Capital was founded to serve the needs of early-stage founders. It’s not just our experience that sets us apart; we relate to our entrepreneurs as people, not just as investments. Tenderloin Capital backs entrepreneurs who are building market-disrupting social-mobile-local-machine learned-artificially-intelligent cognitive experiences.'
    },
    {
      className: 'barn',
      title: 'The Barn',
      type: 'Accelerator',
      description: 'The Barn is an institution for primarily incubating chicken eggs as well as the next revolutions in precision agriculture technology. The Barn created the industry defining model for funding sustainable, humane, non-GMO, and fairtrade early stage businesses in animal husbandry. We look forward to working with you.'
    }
  ];

  return (
    <div className="investors-list">
      <div className="row">
        {investors.map((v, i) => (
          <div className="columns large-4" key={i}>
            <Investor className={v.className} title={v.title} type={v.type} description={v.description}/>
          </div>
        ))}
      </div>
    </div>
  );
};

const BoardOfDirectors = () => (
  <section className="board-directors">
    <div className="row">
      <div className="columns large-4 large-push-4">
        <div className="intro block">
          <h2 className="title">Our Board of Directors</h2>
          <p className="content">
            Wild Rydes has a talented Board of Directors which advises the company on strategy and enabling business success. Using its collective leadership intangibles, the Board works with Wild Rydes to ideate solutions and form audacious ideas to the company’s most pressing business challenges. The Board and the Company work together to make informed problem solving decisions using process optimization and agile decision making techniques.
          </p>
        </div>
      </div>
      <div className="columns large-4 large-pull-4">
        <div className="one block">
          <h3 className="title">Dr. Tim Wagner</h3>
          <p className="content">Chairman of the Board, Grand Master of the Serverless Rite</p>
        </div>
      </div>
      <div className="columns large-4">
        <div className="two block">
          <h3 className="title">Vaughn R. Nicholson</h3>
          <p className="content">EIR at Awesome Sauce Capital</p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="columns large-4">
        <div className="three block">
          <h3 className="title">Conway Bulle</h3>
          <p className="content">Partner at The Barn</p>
        </div>
      </div>
      <div className="columns large-4">
        <div className="four block">
          <h3 className="title">Dr. Samantha Walleford, PhD</h3>
          <p className="content">Managing Partner at Tenderloin Capital</p>
        </div>
      </div>
      <div className="columns large-4">
        <div className="five block">
          <h3 className="title">Qilin Fei</h3>
          <p className="content">Chairman of the Central Committee for Planning at PENGLAI COMMUNICATIONS AND POST NEW CENTURY TECHNOLOGY CORPORATION LTD</p>
        </div>
      </div>
    </div>
  </section>
);

const Investors = () => (
  <div className="page-investors">
    <div className="top-section">
      <header className="site-header">
        <div className="site-logo dark">Wild Rydes</div>
        <div className="row column medium-8 large-6 xlarge-5 xxlarge-4">
          <h1 className="title">Backed By Top Decile Investors</h1>
          <p className="content">We would not be anywhere without our trusted investors. We thank each of them for where we are today.</p>
        </div>
        <SiteNav/>
      </header>
      <InvestorsList/>
    </div>
    <BoardOfDirectors/>
    <SiteFooter/>
  </div>
);

export default Investors;
