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
import DynamicImage from '../components/DynamicImage';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

import '../css/main.css';

const Unicorns = () => (
  <div className="page-unicorns">
    <header className="site-header">
      <div className="site-logo dark">Wild Rydes</div>
      <div className="row column medium-8 large-6 xlarge-5 xxlarge-4">
        <h1 className="title">Unicorns Are Our Friends</h1>
        <p className="content">
          The app is what makes this service exist, but the unicorns make it move. Meet them and see who you are riding with!
        </p>
      </div>
      <SiteNav/>
    </header>
    <div className="row column medium-10 large-8 xxlarge-6">
      <p className="content">
        Wild Rydes has a dedicated staff that recruits, trains, and tends to our herd of unicorns. We take great pride in the quality of unicorns and rydes that we provide to our customers, and our staff exercises the utmost care in vetting the unicorns that join our herd.
      </p>
      <p className="content">
        Every unicorn goes through a rigorous due diligence process where we perform background checks, flying exams, and several rounds of interviews. Unicorns accepted to Wild Rydes are then treated to the best care and maintenance possible. We provide them excellent benefits, health care, and employee perks. This is part of our company philosophy in which happy unicorns lead to happy customers.
      </p>
      <p className="content">Meet a few of the unicorns that are part of our family.</p>
    </div>
    <section className="unicorns-list">
      <div className="row">
        <div className="unicorn jimmy">
          <div className="columns medium-5 large-6 xlarge-5 xlarge-offset-1">
            <DynamicImage src="wr-unicorn-one.png"/>
          </div>
          <div className="columns medium-7 large-6 xlarge-5 xxlarge-4">
            <h2 className="title">Bucephalus</h2>
            <div className="subtitle">Golden Swiss</div>
            <p className="content">
              Bucephalus joined Wild Rydes in February 2016 and has been giving rydes almost daily. He says he most enjoys getting to know each of his ryders, which makes the job more interesting for him. In his spare time, Bucephalus enjoys watching sunsets and playing Pokemon Go.
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="unicorn henry">
          <div className="columns medium-5 medium-push-7 large-6 large-push-6 xlarge-5 xlarge-offset-1 xlarge-push-5">
            <DynamicImage src="wr-unicorn-two.png"/>
          </div>
          <div className="columns medium-7 medium-pull-5 large-6 large-pull-6 xlarge-5 xlarge-pull-5 xxlarge-4 xxlarge-offset-1">
            <h2 className="title">Shadowfox</h2>
            <div className="subtitle">Brown Jersey</div>
            <p className="content">
              Shadowfox joined Wild Rydes after completing a distinguished career in the military, where he toured the world in many critical missions. Shadowfox enjoys impressing his ryders with magic tricks that he learned from his previous owner.
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="unicorn veronica">
          <div className="columns medium-5 large-6 xlarge-5 xlarge-offset-1">
            <DynamicImage src="wr-unicorn-three.png"/>
          </div>
          <div className="columns medium-7 large-6 xlarge-5 xxlarge-4">
            <h2 className="title">Rocinante</h2>
            <div className="subtitle">Baby Flying Yellowback</div>
            <p className="content">
              Rocinante recently joined the Wild Rydes team in Madrid, Spain. She was instrumental in forming Wild Rydes’ Spanish operations after a long, distinguished acting career in windmill shadow-jousting.
            </p>
          </div>
        </div>
      </div>
    </section>

    <SiteFooter/>
  </div>
);

export default Unicorns;
