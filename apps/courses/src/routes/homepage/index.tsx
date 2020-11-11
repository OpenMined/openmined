import React from 'react';

import Hero from './Hero';
import Learn from './Learn';
import Slides from './Slides';
import Features from './Features';
import SignUp from './SignUp';
import Footer from './Footer';

import content from '../../content/homepage';
import Page from '@openmined/shared/util-page';

export default () => (
  <Page>
    <Hero {...content.hero} />
    <Learn {...content.learn} />
    <Slides {...content.slides} />
    <Features {...content.features} />
    <SignUp signup={content.signup} signedup={content.signedup} />
    <Footer {...content.footer} />
  </Page>
);
