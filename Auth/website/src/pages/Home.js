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
import DynamicImage from '../components/DynamicImage';
import EmailSignUp from '../components/EmailSignUp';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

import '../css/main.css';

const AboutSection = () => (
  <section className="home-about">
    <div className="row column large-9 xlarge-6 xxlarge-4">
      <h2 className="section-title">How Does This Work?</h2>
      <p className="content">
        In today’s fast paced world, you’ve got places you need to be but not enough time in your jam packed schedule. Wouldn’t it be nice if there were a transportation service that changed the way you get around daily? Introducing Wild Rydes, an innovative transportation service that helps people get to their destination faster and hassle-free. Getting started is as easy as tapping a button in our app.
      </p>
    </div>
    <div className="row medium-up-2 large-up-4">
      <div className="column">
        <div className="home-about-block">
          <h3 className="title icon-download">Download The App</h3>
          <p className="content">Head over to the app store and download the Wild Rydes app. You’re just a few taps away from getting your ryde.</p>
        </div>
      </div>
      <div className="column">
        <div className="home-about-block">
          <h3 className="title icon-unicorn">Request A Unicorn</h3>
          <p className="content">We can get you there. Simply request a ryde on the app and we'll connect you with a unicorn immediately.</p>
        </div>
      </div>
      <div className="column">
        <div className="home-about-block">
          <h3 className="title icon-price">Pick A Price</h3>
          <p className="content">Pick the valuation you're willing to pay and your ryde is set up. The only surge is the acceleration you get when taking off.</p>
        </div>
      </div>
      <div className="column">
        <div className="home-about-block">
          <h3 className="title icon-success">Ride Off To Success!</h3>
          <p className="content">After matching with your unicorn and agreeing to its terms, you’ll be all set. Your unicorn will arrive shortly to pick you up.</p>
        </div>
      </div>
    </div>
  </section>
);

const StorySection = () => (
  <section className="home-story">
    <div className="row column large-9 xlarge-6 xxlarge-4">
      <h2 className="section-title">Our Story</h2>
      <p className="content">
        Wild Rydes was started by a former hedge fund analyst and a software developer. The two long-time friends happened upon the Wild Rydes idea after attending a silent yoga retreat in Nevada. After gazing upon the majestic herds of unicorns prancing across a surreal Nevada sunset, they witnessed firsthand the poverty and unemployment endemic to that once proud race. Whether it was modern society’s reliance on science over magic or not, we’ll never know the cause of their Ozymandian downfall and fade to obscurity. Moved by empathy, romance, and free enterprise, they saw an opportunity to marry society’s demand for faster, more flexible transportation to underutilized beasts of labor through an on-demand market making transportation app. Using the founders’ respective expertise in animal husbandry and software engineering, Wild Rydes was formed and has since raised untold amounts of venture capital. Today, Wild Rydes has thousands of unicorns in its network fulfilling hundreds of rydes each day.
      </p>
    </div>
  </section>
);

const SignUpSection = () => (
  <section className="home-sign-up">
    <div className="row column">
      <DynamicImage src="wr-home-w.png"/>
      <EmailSignUp/>
      <div className="apps">
        <a className="app-icon" href=""><DynamicImage src="wr-home-apple.png"/></a>
        <a className="app-icon" href=""><DynamicImage src="wr-home-google.png"/></a>
      </div>
      <div className="social">
        <a className="icon-fb" href="">Facebook</a>
        <a className="icon-tw" href="">Twitter</a>
        <a className="icon-ig" href="">Instagram</a>
        <a className="icon-wc" href="">Wechat</a>
        <a className="icon-wb" href="">Weibo</a>
      </div>
    </div>
  </section>
);

const QuoteSection = () => (
  <section className="home-quote">
    <div className="row column medium-8 xxlarge-6">
      <div className="quote-wrap">
        <div className="quote">
          “I was almost late to my ultimate frisbee tournament in DOLORES park. BUt Wild Rydes Got me there from the marina in under five minutes.”
        </div>
        <div className="quoter">- Satisfied Wild Rydes User</div>
      </div>
    </div>
  </section>
);

const KrakenSection = () => (
  <section className="kraken-callout">
    <div className="row">
      <div className="columns medium-6 xxlarge-4 xxlarge-offset-2">
        <DynamicImage src="wr-home-kraken.png"/>
      </div>
      <div className="columns medium-6 xlarge-5 xxlarge-4">
        <h4 className="title">Coming Soon</h4>
        <p className="content">
          Kraken 3xplorer and Dragon Flyght. We’re looking to provide you a full service package from air, land, and to sea.
        </p>
      </div>
    </div>
  </section>
);

const Home = () => {
  return (
    <div className="page-home">
      <header className="site-header">
        <h1 className="title">Wild Rydes</h1>
        <SiteNav/>
        <Link className="home-button" to="/app">
          Giddy Up!
        </Link>
      </header>
      <AboutSection/>
      <StorySection/>
      <SignUpSection/>
      <QuoteSection/>
      <KrakenSection/>
      <SiteFooter/>
    </div>
  );
};

export default Home;
